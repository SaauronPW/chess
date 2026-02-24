// ═══════════════════════════════════════
// SCHACH INFERNO — Roguelike System
// Enemies · Shop · Relics · Map · Score
// ═══════════════════════════════════════

export const ENEMIES = [
  {
    id: 'novice', name: 'Der Novize', title: 'Verwirrter Schüler',
    portrait: 'pawn_ghost', aiDepth: 1, randomness: .1, gold: 4, score: 40,
    flavor: 'Er hält die Figuren manchmal verkehrt herum.',
  },
  {
    id: 'apprentice', name: 'Der Lehrling', title: 'Aufstrebendes Talent',
    portrait: 'red_knight', aiDepth: 2, randomness: .06, gold: 6, score: 60,
    flavor: 'Er kennt die Regeln. Die Strategie weniger.',
  },
  {
    id: 'knight', name: 'Ritter der Stille', title: 'Schweigender Kämpfer',
    portrait: 'red_knight', aiDepth: 2, randomness: .03, gold: 7, score: 75,
    flavor: 'Sagt nichts. Schlägt hart.',
  },
  {
    id: 'bishop', name: 'Der Bischof', title: 'Hüter der Diagonalen',
    portrait: 'grandmaster', aiDepth: 3, randomness: .02, gold: 9, score: 90,
    flavor: 'Läufer-Meister. Weicht dem direkten Kampf aus.',
  },
  {
    id: 'rook', name: 'Der Turmwächter', title: 'Unüberwindliche Mauer',
    portrait: 'fortress', aiDepth: 3, randomness: .01, gold: 11, score: 110,
    flavor: 'Türme kontrollieren alles. Er weiß das.',
  },
  {
    id: 'queen_boss', name: 'Die Schwarze Dame', title: 'Herrscherin des Verderbens',
    portrait: 'dark_queen', aiDepth: 4, randomness: .005, gold: 16, score: 160,
    isBoss: true,
    flavor: 'Sie verliert nie. Außer heute.',
  },
  {
    id: 'king_final', name: 'Der Ewige König', title: 'Der Alptraum selbst',
    portrait: 'dark_queen', aiDepth: 5, randomness: 0, gold: 30, score: 300,
    isBoss: true, isFinal: true,
    flavor: 'Es gibt kein Danach.',
  },
];

export const RELICS = [
  // ── Common ──────────────────────────────────────────
  { id:'greed',       cat:'relic',   rarity:'common',   price:5,
    icon:'🦷', name:'Goldzahn',
    desc:'+3 Gold nach jedem Sieg.',
    hint:'Gier ist gut.',
  },
  { id:'score_up',    cat:'relic',   rarity:'common',   price:5,
    icon:'🪶', name:'Rabenfeder',
    desc:'+30 Score nach jedem Sieg.',
    hint:'Raben sammeln Wissen.',
  },
  { id:'extra_gold',  cat:'upgrade', rarity:'common',   price:3,
    icon:'💰', name:'Goldschmelze',
    desc:'+6 Gold sofort.',
    hint:'Für den sofortigen Bedarf.',
    instant: true,
  },
  // ── Uncommon ────────────────────────────────────────
  { id:'revive',      cat:'relic',   rarity:'uncommon', price:8,
    icon:'🕯', name:'Kerzenschein',
    desc:'1× eine Niederlage überleben.',
    hint:'Das Licht erlischt langsam.',
  },
  { id:'demonEye',    cat:'relic',   rarity:'uncommon', price:8,
    icon:'👁', name:'Dämonenblick',
    desc:'KI macht einmalig pro Kampf absichtlich einen schlechten Zug.',
    hint:'Lenke den Feind ab.',
  },
  { id:'weakenAI',    cat:'upgrade', rarity:'uncommon', price:7,
    icon:'🧠', name:'Gedankennebel',
    desc:'Nächster Gegner: KI-Stärke um 1 reduziert.',
    hint:'Trübe das Wasser.',
    instant: true,
  },
  // ── Rare ────────────────────────────────────────────
  { id:'bloodrune',   cat:'relic',   rarity:'rare',     price:13,
    icon:'🔮', name:'Blutrune',
    desc:'Jedes Schlagen gibt +20 Score extra.',
    hint:'Blut für Macht.',
  },
  { id:'goldDouble',  cat:'relic',   rarity:'rare',     price:14,
    icon:'🪞', name:'Seelenspiegel',
    desc:'Verdoppelt die Goldbelohnung des nächsten Sieges.',
    hint:'Ein Spiegel zeigt zwei.',
  },
  { id:'hardMode',    cat:'relic',   rarity:'rare',     price:10,
    icon:'⏳', name:'Sanduhr der Qual',
    desc:'+1 KI-Tiefe (stärkerer Gegner), aber +40% Gold.',
    hint:'Leid schärft den Verstand.',
  },
  // ── Amazon (Special Piece) ───────────────────────────
  { id:'amazon_sp',   cat:'special', rarity:'legendary', price:18,
    icon:'⚜️', name:'Die Amazone',
    desc:'Ersetzt deine Dame durch die AMAZONE: bewegt sich wie Dame + Springer. Die mächtigste Figur im Schach.',
    hint:'Unsterbliche Kriegerin.',
    specialType: 'amazon',
    specialSlot: '7_3',   // replaces queen on d1
  },
  // ── Legendary ────────────────────────────────────────
  { id:'mirror_life', cat:'relic',   rarity:'legendary', price:22,
    icon:'💎', name:'Ewiges Herz',
    desc:'+1 Leben. Du startest mit 2 Versuchen.',
    hint:'Unsterblichkeit hat ihren Preis.',
    instant: true,
  },
];

export const MAP_NODES = [
  { type:'battle', icon:'⚔', label:'Kampf',     desc:'Normaler Gegner' },
  { type:'battle', icon:'⚔', label:'Kampf',     desc:'Normaler Gegner' },
  { type:'shop',   icon:'🛒', label:'Händler',   desc:'Kauf Relikte & Upgrades' },
  { type:'battle', icon:'⚔', label:'Kampf',     desc:'Stärkerer Gegner' },
  { type:'event',  icon:'✨', label:'Event',     desc:'Mysteriöse Begegnung' },
  { type:'shop',   icon:'🛒', label:'Händler',   desc:'Seltene Waren' },
  { type:'elite',  icon:'💢', label:'Elite',     desc:'Besonders starker Gegner' },
  { type:'boss',   icon:'💀', label:'Boss',      desc:'Mächtiger Widersacher' },
  { type:'event',  icon:'✨', label:'Event',     desc:'Letzte Chance' },
  { type:'boss',   icon:'👑', label:'Finalboss', desc:'Der Ewige König' },
];

export const SCORE_EVENTS = {
  capture:    { pts: 10, label: '⚔ Figur geschlagen',    type: 'good' },
  captureFat: { pts: 20, label: '⚔ Große Figur geschlagen', type: 'good' },
  check:      { pts: 15, label: '♟ Schach!',              type: 'good' },
  castle:     { pts: 20, label: '🏰 Rochiert',            type: 'good' },
  promotion:  { pts: 35, label: '👑 Bauernumwandlung',    type: 'good' },
  amazon:     { pts: 25, label: '⚜ Amazonen-Zug',        type: 'special' },
  blunder_ai: { pts: 30, label: '👁 KI-Fehler (Relikt)', type: 'special' },
};

export function makeRun() {
  return {
    gold: 10,
    score: 0,
    lives: 1,
    relics: [],
    specials: {},           // "r_f" -> specialType, applied to board at battle start
    reviveAvailable: false,
    extraLife: false,
    map: MAP_NODES.map((n, i) => ({ ...n, id: i, done: false })),
    currentNode: 0,
    nodeDone: {},
    enemyIndex: 0,         // non-boss enemy progression
    shopSold: {},
    weakenAI: false,
    goldDouble: false,
    blunderReady: false,   // from demonEye relic
    hardMode: false,
  };
}

export function getEnemy(run, isBoss, isFinal) {
  if (isFinal) return ENEMIES.find(e => e.isFinal) || ENEMIES[ENEMIES.length - 1];
  if (isBoss)  return ENEMIES.find(e => e.isBoss && !e.isFinal) || ENEMIES[ENEMIES.length - 2];
  const nonBoss = ENEMIES.filter(e => !e.isBoss);
  return nonBoss[Math.min(run.enemyIndex, nonBoss.length - 1)];
}

export function applyRelic(run, relic) {
  if (relic.instant) {
    if (relic.id === 'extra_gold')  run.gold += 6;
    if (relic.id === 'weakenAI')    run.weakenAI = true;
    if (relic.id === 'mirror_life') run.lives += 1;
    return; // instant items don't go to relic list
  }
  if (!run.relics.find(r => r.id === relic.id)) {
    run.relics.push(relic);
  }
  if (relic.id === 'revive')     run.reviveAvailable = true;
  if (relic.id === 'demonEye')   run.blunderReady = true;
  if (relic.id === 'hardMode')   run.hardMode = true;
  if (relic.id === 'goldDouble') run.goldDouble = true;
  if (relic.specialType)         run.specials[relic.specialSlot] = relic.specialType;
}

export function calcVictoryRewards(run, enemy) {
  let gold  = enemy.gold;
  let score = enemy.score;

  if (run.relics.find(r => r.id === 'greed'))    gold  += 3;
  if (run.relics.find(r => r.id === 'score_up')) score += 30;
  if (run.hardMode) gold = Math.round(gold * 1.4);
  if (run.goldDouble) { gold *= 2; run.goldDouble = false; }

  return { gold, score };
}

export function getRandomRelicChoices(run, count = 3) {
  const available = RELICS.filter(r =>
    !run.shopSold[r.id] &&
    !run.relics.find(x => x.id === r.id) &&
    (!r.instant || true)
  );
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const EVENTS = [
  {
    id: 'treasure', icon: '💎', title: 'Verlassener Schatz',
    text: 'Ein verstaubter Koffer liegt am Wegrand. +8 Gold.',
    choices: [
      { label: 'Nehmen', cls: 'btn-gold', fn: run => { run.gold += 8; return '+8 Gold erhalten!'; } },
    ],
  },
  {
    id: 'bargain', icon: '🩸', title: 'Pakt des Blutes',
    text: 'Ein Geist bietet dir Macht gegen Schmerz.\nZahle 4 Gold für ein seltenes Relikt.',
    choices: [
      { label: 'Annehmen (4💰)', cls: 'btn-red', fn: (run, applyFn) => {
        if (run.gold < 4) return 'FEHLER:Zu wenig Gold!';
        run.gold -= 4;
        const rare = RELICS.filter(r => r.rarity === 'rare');
        const relic = rare[Math.floor(Math.random() * rare.length)];
        applyFn(run, relic);
        return `${relic.icon} ${relic.name} erhalten!`;
      }},
      { label: 'Ablehnen', cls: 'btn-dark', fn: () => 'Du gehst weiter.' },
    ],
  },
  {
    id: 'fortune', icon: '🔮', title: 'Weissagung',
    text: 'Eine Seherin spricht: "+50 Punkte, doch der Weg wird schwerer."',
    choices: [
      { label: 'Hören', cls: 'btn-gold', fn: run => { run.score += 50; return '+50 Punkte!'; } },
      { label: 'Ignorieren', cls: 'btn-dark', fn: () => 'Du weißt genug.' },
    ],
  },
  {
    id: 'merchant', icon: '🎭', title: 'Geheimnisvoller Händler',
    text: 'Er bietet dir ein Item umsonst an — und verschwindet dann.',
    choices: [
      { label: 'Annehmen', cls: 'btn-gold', fn: (run, applyFn) => {
        const uncommon = RELICS.filter(r => r.rarity === 'uncommon' && !run.relics.find(x => x.id === r.id));
        if (!uncommon.length) return 'Er hat nichts mehr.';
        const relic = uncommon[Math.floor(Math.random() * uncommon.length)];
        applyFn(run, relic);
        return `${relic.icon} ${relic.name} erhalten!`;
      }},
    ],
  },
];
