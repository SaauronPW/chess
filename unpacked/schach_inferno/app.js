// ═══════════════════════════════════════
// SCHACH INFERNO — Main App
// ═══════════════════════════════════════

import { makeState, legalMovesForPiece, allLegalMoves, applyMove, undoMove,
         isInCheck, hasAnyLegal, rfToAlg, aiChooseMove } from './chess.js';
import { createEngine3D } from './engine3d.js';
import { PORTRAITS } from './portraits.js';
import { ENEMIES, RELICS, MAP_NODES, SCORE_EVENTS, makeRun, getEnemy,
         applyRelic, calcVictoryRewards, getRandomRelicChoices, EVENTS } from './roguelike.js';

// ─────────────────────────────────────────
// Game state
// ─────────────────────────────────────────
let R        = null;    // Run state
let S        = null;    // Chess state
let engine   = null;
let selected = null;
let selMoves = [];
let aiBusy   = false;
let battleScore = 0;
let lastFrom = null, lastTo = null;
let currentEnemy = null;
let shopActiveCat = 'all';

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}
function showHud() { $('globalHud').classList.add('visible'); }
function hideHud() { $('globalHud').classList.remove('visible'); }

let toastT = null;
function toast(msg, type = '', ms = 2400) {
  const el = $('toast');
  el.textContent = msg;
  el.className = 'show' + (type ? ' t-' + type : '');
  clearTimeout(toastT);
  toastT = setTimeout(() => el.className = '', ms);
}

function showModal({ icon, title, text, html, btns }) {
  const ic = $('modalIcon');
  if (icon) { ic.style.display = 'block'; ic.textContent = icon; } else ic.style.display = 'none';
  $('modalTitle').textContent = title || '';
  const mt = $('modalText');
  if (html) mt.innerHTML = html; else { mt.textContent = text || ''; mt.style.whiteSpace = 'pre-line'; }
  $('modalBtns').innerHTML = '';
  (btns || []).forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'btn ' + (b.cls || 'btn-dark');
    btn.textContent = b.label;
    btn.onclick = () => { closeModal(); b.fn?.(); };
    $('modalBtns').appendChild(btn);
  });
  $('overlay').classList.add('active');
}
function closeModal() { $('overlay').classList.remove('active'); }

function updateHud() {
  if (!R) return;
  // Lives dots
  let livesHtml = '';
  for (let i = 0; i < R.lives; i++) livesHtml += '<div class="life-dot"></div>';
  if (R.reviveAvailable) livesHtml += '<div class="life-dot revive" title="Revive bereit!"></div>';
  $('hudLives').innerHTML = livesHtml;
  $('hudGold').textContent  = R.gold;
  $('hudScore').textContent = R.score;
  const node = R.map[R.currentNode];
  $('hudChapter').innerHTML = `Node <span>${R.currentNode + 1}/${R.map.length}</span>`;
}

// ─────────────────────────────────────────
// MAP
// ─────────────────────────────────────────
function buildMap() {
  $('mapLegend').innerHTML = '<span>⚔ Kampf</span><span>💢 Elite</span><span>🛒 Händler</span><span>✨ Event</span><span>💀 Boss</span>';
  const wrap = $('mapNodes'); wrap.innerHTML = '';
  R.map.forEach(n => {
    const done    = !!R.nodeDone[n.id];
    const locked  = n.id > R.currentNode;
    const current = n.id === R.currentNode && !done;
    const div = document.createElement('div');
    div.className = `node type-${n.type}${done ? ' done' : ''}${locked ? ' locked' : ''}${current ? ' current' : ''}`;
    div.innerHTML = `
      <span class="node-icon">${n.icon}</span>
      <div class="node-lbl">${n.label}</div>
      <div class="node-desc">${n.desc}</div>`;
    if (!locked && !done) div.onclick = () => enterNode(n);
    wrap.appendChild(div);
  });
}

function enterNode(node) {
  if (node.type === 'shop')  { openShop(); return; }
  if (node.type === 'event') { doEvent();  return; }
  const isBoss  = node.type === 'boss';
  const isFinal = node.type === 'boss' && node.id === R.map.length - 1;
  const enemy   = getEnemy(R, isBoss, isFinal);
  startBattle(enemy, isBoss);
  if (!isBoss) R.enemyIndex++;
}

function nodeComplete() {
  R.nodeDone[R.currentNode] = true;
  R.currentNode = Math.min(R.currentNode + 1, R.map.length - 1);
  updateHud(); buildMap(); showScreen('mapScreen');
}

// ─────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────
function doEvent() {
  const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  const btns = ev.choices.map(c => ({
    label: c.label, cls: c.cls,
    fn: () => {
      const result = c.fn(R, applyRelic);
      if (result && result.startsWith('FEHLER:')) { toast(result.slice(7), 'bad'); return; }
      if (result) toast(result, 'good', 3000);
      updateHud(); nodeComplete();
    },
  }));
  showModal({ icon: ev.icon, title: ev.title, text: ev.text, btns });
}

// ─────────────────────────────────────────
// BATTLE
// ─────────────────────────────────────────
function startBattle(enemy, isBoss = false) {
  currentEnemy  = enemy;
  battleScore   = 0;
  lastFrom = lastTo = null;
  selected = null; selMoves = [];
  aiBusy = false;
  R.blunderUsed = false;

  showScreen('battleScreen');
  $('battleScoreDisplay').textContent = '0';
  $('scoreFeed').innerHTML = '';

  // Portraits
  $('enemyPortrait').innerHTML  = PORTRAITS[enemy.portrait] || PORTRAITS.pawn_ghost;
  $('playerPortrait').innerHTML = PORTRAITS.wanderer;
  $('enemyName').textContent    = enemy.name;
  $('enemyTitle').textContent   = enemy.title;
  $('enemyFlavor').textContent  = enemy.flavor || '';
  $('encounterText').textContent = isBoss
    ? `💀 BOSS: ${enemy.name}`
    : `⚔ KI-Stärke: ${enemy.aiDepth} · ${enemy.name}`;

  // Chess state — apply special pieces from relics
  S = makeState({ specials: { ...R.specials } });

  // Amazon info badge
  const hasAmazon = Object.values(S.specials).includes('amazon');
  $('amazonBadge').style.display = hasAmazon ? 'block' : 'none';

  // Init 3D engine (only once)
  if (!engine) {
    engine = createEngine3D($('threeRoot'), onSquareClick);
    window.addEventListener('resize', () => engine?.resize());
  }
  requestAnimationFrame(() => { engine.resize(); renderBattle(); });
  renderRelics();
  updateBattleLabels();
}

function renderBattle() {
  const moves = [], caps = [];
  for (const m of selMoves) {
    if (S.board[m.r][m.f]) caps.push({ r: m.r, f: m.f });
    else                   moves.push({ r: m.r, f: m.f });
  }
  engine.renderPosition(S.board, {
    selected, moves, captures: caps,
    lastFrom, lastTo,
  }, S.specials);
  updateBattleLabels();
}

function updateBattleLabels() {
  $('battleTurn').textContent  = S.turn === 'w' ? 'Weiß' : 'Schwarz';
  $('battleTurn').className    = 'turn-badge ' + (S.turn === 'w' ? 'turn-white' : 'turn-black');
  $('battleRight').textContent = isInCheck(S, 'w') ? '⚠ Weiß im Schach!'
                               : isInCheck(S, 'b') ? '⚠ Schwarz im Schach!' : '—';
  $('battleLeft').textContent  = selected ? `Gewählt: ${rfToAlg(selected.r, selected.f)}` : 'Wähle eine Figur';
}

function addScore(evKey, override = {}) {
  const def = SCORE_EVENTS[evKey] || { pts: 0, label: evKey, type: 'good' };
  const pts   = override.pts   ?? def.pts;
  const label = override.label ?? def.label;
  const type  = override.type  ?? def.type;
  if (!pts) return;
  battleScore += pts;
  R.score     += pts;
  updateHud();
  $('battleScoreDisplay').textContent = battleScore;
  const row = document.createElement('div');
  row.className = `score-entry s-${type}`;
  row.innerHTML = `<span>${label}</span><span class="pts">+${pts}</span>`;
  const feed = $('scoreFeed');
  feed.insertBefore(row, feed.firstChild);
  while (feed.children.length > 16) feed.removeChild(feed.lastChild);
}

function onSquareClick(r, f) {
  if (S.turn !== 'w') return;
  const p = S.board[r][f];

  if (selected) {
    const mv = selMoves.find(m => m.r === r && m.f === f);
    if (mv) {
      const captured   = S.board[r][f];
      const wasInCheck = isInCheck(S, 'b');
      const isAmazonSq = S.specials?.[selected.r + '_' + selected.f] === 'amazon';

      S = applyMove(S, selected.r, selected.f, r, f, mv);
      lastFrom = { r: selected.r, f: selected.f };
      lastTo   = { r, f };
      selected = null; selMoves = [];

      // Score events
      if (captured) {
        const bigPiece = ['Q','R','B','N'].includes(captured[1]);
        addScore(bigPiece ? 'captureFat' : 'capture',
          R.relics.find(x => x.id === 'bloodrune')
            ? { pts: bigPiece ? 40 : 30, label: `⚔ +Blutrune Bonus` } : {});
      }
      if (mv.castle)         addScore('castle');
      if (!wasInCheck && isInCheck(S, 'b')) addScore('check');
      if (S.board[r][f]?.[1] === 'Q' && S.history.length > 0 &&
          S.history[S.history.length - 1].board[r][f]?.[1] === 'P') addScore('promotion');
      if (isAmazonSq)        addScore('amazon');

      renderBattle();
      const tp = S.turn;
      if (!hasAnyLegal(S, tp)) {
        handleBattleEnd(isInCheck(S, tp) ? (tp === 'w' ? 'blackWins' : 'whiteWins') : 'stalemate');
        return;
      }
      scheduleAI();
      return;
    }
  }

  if (p && p[0] === 'w') {
    selected = { r, f };
    selMoves = legalMovesForPiece(S, r, f);
    renderBattle();
    return;
  }
  selected = null; selMoves = [];
  renderBattle();
}

function scheduleAI() {
  if (S.turn !== 'b' || aiBusy) return;
  aiBusy = true;
  setTimeout(() => {
    try { if (S?.turn === 'b') doAIMove(); }
    finally { aiBusy = false; }
  }, 420);
}

function doAIMove() {
  let depth = currentEnemy?.aiDepth ?? 2;
  if (R.weakenAI)   { depth = Math.max(1, depth - 1); R.weakenAI = false; }
  if (R.hardMode)   depth = Math.min(5, depth + 1);

  // Blunder: one bad move per battle
  let blunder = false;
  if (R.relics.find(x => x.id === 'demonEye') && !R.blunderUsed) {
    R.blunderUsed = true; blunder = true;
    toast('👁 Dämonenblick: KI macht einen Fehler!', 'special', 2500);
    addScore('blunder_ai');
  }

  const mv = aiChooseMove(S, { depth, randomness: currentEnemy?.randomness ?? 0.03, blunder });
  if (!mv) { toast('KI hat keine Züge.'); return; }

  S = applyMove(S, mv.fromR, mv.fromF, mv.toR, mv.toF, mv.extra);
  lastFrom = { r: mv.fromR, f: mv.fromF };
  lastTo   = { r: mv.toR,  f: mv.toF };
  selected = null; selMoves = [];
  renderBattle();

  const tp = S.turn;
  if (!hasAnyLegal(S, tp))
    handleBattleEnd(isInCheck(S, tp) ? (tp === 'w' ? 'blackWins' : 'whiteWins') : 'stalemate');
}

function handleBattleEnd(result) {
  if (result === 'whiteWins') {
    const { gold, score } = calcVictoryRewards(R, currentEnemy);
    R.gold  += gold;
    R.score += score + battleScore;
    updateHud();
    showModal({
      icon: '♛', title: 'Sieg!',
      html: `<div style="text-align:center">
        <div style="font-size:42px;margin-bottom:10px">♛</div>
        <div style="color:var(--green2);font-family:'Special Elite',cursive;font-size:16px;margin-bottom:12px">${currentEnemy.name} besiegt!</div>
        <div style="color:var(--candle);font-family:'Special Elite',cursive;font-size:14px">+${gold} 💰 Gold &nbsp;·&nbsp; +${score + battleScore} ⭐ Punkte</div>
        <div style="color:var(--ink-dim);font-size:11px;margin-top:8px">davon ${battleScore} Punkte aus dem Kampf</div>
      </div>`,
      btns: [{ label: '▶ Weiter', cls: 'btn-gold', fn: nodeComplete }],
    });
    return;
  }

  if (result === 'blackWins') {
    if (R.reviveAvailable) {
      R.reviveAvailable = false;
      toast('🕯 Kerzenschein rettet dich!', 'good', 3000);
      S = makeState({ specials: { ...R.specials } });
      lastFrom = lastTo = null; selected = null; selMoves = [];
      renderBattle(); return;
    }
    if (R.lives > 1) {
      R.lives--;
      toast(`☠ Du verlierst ein Leben! Noch ${R.lives} Leben.`, 'bad', 3000);
      S = makeState({ specials: { ...R.specials } });
      lastFrom = lastTo = null; selected = null; selMoves = [];
      renderBattle(); updateHud(); return;
    }
    triggerDeath(`${currentEnemy.name} hat dich matt gesetzt.`);
    return;
  }

  // Stalemate
  toast('½ Patt — gilt als Niederlage!', 'bad', 3000);
  if (R.reviveAvailable) {
    R.reviveAvailable = false;
    S = makeState({ specials: { ...R.specials } });
    lastFrom = lastTo = null; selected = null; selMoves = [];
    renderBattle(); return;
  }
  triggerDeath('Patt. Du wirst verband.');
}

function triggerDeath(reason) {
  $('deathReason').textContent = reason;
  $('deathStats').innerHTML = `
    <div>Knoten: ${R.currentNode + 1}/${R.map.length}</div>
    <div>Endpunkte: ${R.score}</div>
    <div>Gold übrig: ${R.gold}</div>
    <div>Relikte: ${R.relics.map(r => r.icon + ' ' + r.name).join(', ') || '—'}</div>`;
  hideHud(); showScreen('deathScreen');
}

function renderRelics() {
  const el = $('relicList');
  if (!R.relics.length) { el.innerHTML = '<div class="small" style="color:var(--ink-faint)">Keine Relikte.</div>'; return; }
  el.innerHTML = R.relics.map(r => `
    <div class="relic-row">
      <span class="relic-icon">${r.icon}</span>
      <span class="relic-name">${r.name}</span>
      <div class="relic-desc">${r.desc}</div>
    </div>`).join('');
}

// ─────────────────────────────────────────
// SHOP
// ─────────────────────────────────────────
function openShop() {
  showScreen('shopScreen');
  $('shopGoldDisplay').textContent = R.gold;
  renderShop();
}

function renderShop() {
  $('shopGoldDisplay').textContent = R.gold;
  const grid = $('shopGrid'); grid.innerHTML = '';
  const items = RELICS.filter(r =>
    shopActiveCat === 'all' || r.cat === shopActiveCat
  );
  items.forEach(item => {
    const sold  = !!R.shopSold[item.id];
    const owned = R.relics.find(r => r.id === item.id);
    const card  = document.createElement('div');
    card.className = `shop-card r-${item.rarity}${sold || owned ? ' sold' : ''}`;
    const RARITY_LABEL = { common:'Gewöhnlich', uncommon:'Ungewöhnlich', rare:'Selten', legendary:'Legendär' };
    card.innerHTML = `
      <div class="c-rarity">${RARITY_LABEL[item.rarity] || item.rarity}</div>
      <div class="c-icon">${item.icon}</div>
      <div class="c-name">${item.name}</div>
      <div class="c-desc">${item.desc}</div>
      <div class="c-hint">${item.hint || ''}</div>
      ${sold || owned
        ? `<div class="sold-stamp">${owned ? '— BESESSEN —' : '— VERKAUFT —'}</div>`
        : `<div class="c-price">💰 ${item.price} Gold</div>`}`;
    if (!sold && !owned) card.onclick = () => buyItem(item);
    grid.appendChild(card);
  });
}

function buyItem(item) {
  if (R.gold < item.price) { toast('Zu wenig Gold!', 'bad'); return; }
  R.gold -= item.price;
  R.shopSold[item.id] = true;
  applyRelic(R, item);
  toast(`${item.icon} ${item.name} gekauft!`, 'good');
  updateHud(); renderShop();
}

// Category filter buttons
document.querySelectorAll('.shop-cat-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.shop-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    shopActiveCat = btn.dataset.cat;
    renderShop();
  };
});

// ─────────────────────────────────────────
// DEV SKIP
// ─────────────────────────────────────────
window.devSkip = function () {
  if (!R) return;
  const id = document.querySelector('.screen.active')?.id;
  toast('⚡ DEV Skip');
  if (id === 'battleScreen') {
    if (!S || !currentEnemy) return;
    const { gold, score } = calcVictoryRewards(R, currentEnemy);
    R.gold += gold; R.score += score;
    updateHud(); nodeComplete();
  } else if (id === 'shopScreen') {
    nodeComplete();
  } else if (id === 'mapScreen') {
    const n = R.map[R.currentNode];
    if (n) enterNode(n);
  }
};

// ─────────────────────────────────────────
// WIRING
// ─────────────────────────────────────────
$('btnStart').onclick = () => {
  R = makeRun();
  showHud(); updateHud(); buildMap(); showScreen('mapScreen');
};

$('btnHow').onclick = () => showModal({
  icon: '📜', title: 'SCHACH INFERNO',
  text: `Besiege Gegner — werde stärker — überlebe.

⚔ Kampf: Du spielst Weiß. Besiege die KI.
🛒 Händler: Kauf Relikte und Upgrades.
✨ Event: Zufällige Begegnungen.
💀 Boss: Stärkere KI, höhere Belohnung.

Punktevergabe im Kampf:
• Figur schlagen: +10–20 Punkte
• Rochade: +20 · Schach: +15
• Bauernumwandlung: +35

⚜ AMAZONE (legendäres Special):
Bewegt sich wie Dame + Springer kombiniert.
Die mächtigste Figur im Schach!

Hardcore: Eine Niederlage = Game Over.
Kerzenschein-Relikt schützt 1×.`,
  btns: [{ label: 'Verstanden!', cls: 'btn-gold' }],
});

$('btnToMap').onclick    = () => { if (R) { buildMap(); showScreen('mapScreen'); } };
$('btnToShop').onclick   = () => { if (R) openShop(); };
$('btnCamReset').onclick = () => { engine?.resetCamera?.(); toast('📷 Kamera zurückgesetzt'); };
$('btnAIMove').onclick   = () => { if (S?.turn === 'b' && !aiBusy) { aiBusy = false; doAIMove(); } };
$('btnUndo').onclick     = () => {
  S = undoMove(S); selected = null; selMoves = [];
  lastFrom = lastTo = null; renderBattle();
};
$('btnRerollShop').onclick = () => {
  if (R.gold < 3) { toast('Brauche 3 Gold!', 'bad'); return; }
  R.gold -= 3; R.shopSold = {};
  updateHud(); renderShop(); toast('🎲 Neues Sortiment!');
};
$('btnLeaveShop').onclick = nodeComplete;
$('btnRestart').onclick   = () => {
  R = makeRun(); showHud(); updateHud(); buildMap(); showScreen('mapScreen');
};
$('btnMenu').onclick      = () => { hideHud(); showScreen('titleScreen'); };
$('btnContinue').onclick  = nodeComplete; // default fallback

// Init
hideHud();
showScreen('titleScreen');
