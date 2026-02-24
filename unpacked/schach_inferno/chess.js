// ═══════════════════════════════════════
// SCHACH INFERNO — Chess Engine
// Improved AI (Alpha-Beta + PST + Move Ordering)
// Special Pieces: Amazone
// ═══════════════════════════════════════

export function rfToAlg(r, f) { return String.fromCharCode(97 + f) + (8 - r); }
export function algToRf(s)    { return { r: 8 - parseInt(s[1], 10), f: s.charCodeAt(0) - 97 }; }
export function inBounds(r, f){ return r >= 0 && r < 8 && f >= 0 && f < 8; }
export function cloneBoard(b) { return b.map(row => row.slice()); }

export function makeStartBoard() {
  const b = Array.from({ length: 8 }, () => Array(8).fill(null));
  const back = ['R','N','B','Q','K','B','N','R'];
  for (let f = 0; f < 8; f++) {
    b[0][f] = 'b' + back[f];
    b[1][f] = 'bP';
    b[6][f] = 'wP';
    b[7][f] = 'w' + back[f];
  }
  return b;
}

export function makeState(overrides = {}) {
  return {
    board:    makeStartBoard(),
    turn:     'w',
    rights:   { wK: true, wQ: true, bK: true, bQ: true },
    epSq:     null,
    halfmove: 0,
    fullmove: 1,
    history:  [],
    specials: {},   // "r_f" -> specialType string
    ...overrides,
  };
}

export function findKing(board, col) {
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++)
      if (board[r][f] === col + 'K') return { r, f };
  return null;
}

// ── Special piece pseudo-moves ─────────────────────
function amazonMoves(S, r, f) {
  // Moves like Queen + Knight
  const { board } = S;
  const col = board[r][f][0], opp = col === 'w' ? 'b' : 'w';
  const moves = [];

  // Queen directions (slide)
  for (const [dr, df] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) {
    let nr = r + dr, nf = f + df;
    while (inBounds(nr, nf)) {
      if (!board[nr][nf]) { moves.push({ r: nr, f: nf }); }
      else { if (board[nr][nf][0] === opp) moves.push({ r: nr, f: nf }); break; }
      nr += dr; nf += df;
    }
  }
  // Knight hops
  for (const [dr, df] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
    const nr = r + dr, nf = f + df;
    if (inBounds(nr, nf) && (!board[nr][nf] || board[nr][nf][0] === opp))
      moves.push({ r: nr, f: nf });
  }
  return moves;
}

// ── Pseudo-move generator ──────────────────────────
export function pseudoMoves(S, r, f) {
  const { board, rights, epSq, specials } = S;
  const p = board[r][f];
  if (!p) return [];
  const col = p[0], type = p[1], opp = col === 'w' ? 'b' : 'w';

  // Check for special piece override
  const key = r + '_' + f;
  if (specials && specials[key]) {
    if (specials[key] === 'amazon') return amazonMoves(S, r, f);
  }

  const moves = [];
  const slide = (dr, df) => {
    let nr = r + dr, nf = f + df;
    while (inBounds(nr, nf)) {
      if (!board[nr][nf]) { moves.push({ r: nr, f: nf }); }
      else { if (board[nr][nf][0] === opp) moves.push({ r: nr, f: nf }); break; }
      nr += dr; nf += df;
    }
  };
  const step = (dr, df) => {
    const nr = r + dr, nf = f + df;
    if (inBounds(nr, nf) && (!board[nr][nf] || board[nr][nf][0] === opp))
      moves.push({ r: nr, f: nf });
  };

  if (type === 'P') {
    const dir = col === 'w' ? -1 : 1, startR = col === 'w' ? 6 : 1;
    if (inBounds(r + dir, f) && !board[r + dir][f]) {
      moves.push({ r: r + dir, f });
      if (r === startR && !board[r + 2 * dir][f])
        moves.push({ r: r + 2 * dir, f, doublePush: true });
    }
    for (const df of [-1, 1]) {
      const nr = r + dir, nf = f + df;
      if (!inBounds(nr, nf)) continue;
      if (board[nr][nf] && board[nr][nf][0] === opp) moves.push({ r: nr, f: nf });
      if (epSq && epSq.r === nr && epSq.f === nf)    moves.push({ r: nr, f: nf, epCapture: true });
    }
  } else if (type === 'N') {
    for (const [dr, df] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) step(dr, df);
  } else if (type === 'B') {
    for (const [dr, df] of [[-1,-1],[-1,1],[1,-1],[1,1]]) slide(dr, df);
  } else if (type === 'R') {
    for (const [dr, df] of [[-1,0],[1,0],[0,-1],[0,1]]) slide(dr, df);
  } else if (type === 'Q') {
    for (const [dr, df] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) slide(dr, df);
  } else if (type === 'K') {
    for (const [dr, df] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) step(dr, df);
    const hr = col === 'w' ? 7 : 0;
    if (r === hr && f === 4) {
      if (rights[col+'K'] && !board[hr][5] && !board[hr][6] && board[hr][7] === col+'R')
        moves.push({ r: hr, f: 6, castle: 'K' });
      if (rights[col+'Q'] && !board[hr][3] && !board[hr][2] && !board[hr][1] && board[hr][0] === col+'R')
        moves.push({ r: hr, f: 2, castle: 'Q' });
    }
  }
  return moves;
}

export function applyMove(S, fromR, fromF, toR, toF, extra = {}) {
  const snap = {
    board: cloneBoard(S.board), turn: S.turn, rights: { ...S.rights },
    epSq: S.epSq ? { ...S.epSq } : null, halfmove: S.halfmove,
    fullmove: S.fullmove, specials: { ...S.specials },
  };
  const hist = [...S.history, snap];
  const board = cloneBoard(S.board);
  const p = board[fromR][fromF], col = p[0];
  const captured = board[toR][toF];

  board[fromR][fromF] = null;
  board[toR][toF] = p;

  if (extra.epCapture && p[1] === 'P') board[col === 'w' ? toR + 1 : toR - 1][toF] = null;
  if (p[1] === 'P' && (toR === 0 || toR === 7)) board[toR][toF] = col + 'Q';
  if (extra.castle === 'K') { board[toR][5] = col + 'R'; board[toR][7] = null; }
  if (extra.castle === 'Q') { board[toR][3] = col + 'R'; board[toR][0] = null; }

  const rights = { ...S.rights };
  if (p[1] === 'K') { rights[col+'K'] = false; rights[col+'Q'] = false; }
  if (p[1] === 'R') {
    if (col==='w' && fromR===7 && fromF===7) rights.wK = false;
    if (col==='w' && fromR===7 && fromF===0) rights.wQ = false;
    if (col==='b' && fromR===0 && fromF===7) rights.bK = false;
    if (col==='b' && fromR===0 && fromF===0) rights.bQ = false;
  }

  // Move special piece key along with the piece
  const specials = { ...S.specials };
  const oldKey = fromR + '_' + fromF;
  if (specials[oldKey]) {
    specials[toR + '_' + toF] = specials[oldKey];
    delete specials[oldKey];
  }

  const epSq = (p[1] === 'P' && extra.doublePush)
    ? { r: col === 'w' ? toR + 1 : toR - 1, f: toF } : null;
  const halfmove = (p[1] === 'P' || captured || extra.epCapture) ? 0 : S.halfmove + 1;
  const nextTurn = S.turn === 'w' ? 'b' : 'w';

  return { ...S, board, rights, epSq, turn: nextTurn,
    halfmove, fullmove: S.fullmove + (nextTurn === 'w' ? 1 : 0),
    history: hist, specials };
}

export function undoMove(S) {
  if (!S.history.length) return S;
  const last = S.history[S.history.length - 1];
  return { ...S, ...last, history: S.history.slice(0, -1) };
}

export function isSquareAttacked(S, r, f, byCol) {
  for (let rr = 0; rr < 8; rr++)
    for (let ff = 0; ff < 8; ff++) {
      if (S.board[rr][ff]?.[0] !== byCol) continue;
      if (pseudoMoves({ ...S, turn: byCol }, rr, ff).some(m => m.r === r && m.f === f))
        return true;
    }
  return false;
}

export function isInCheck(S, col) {
  const k = findKing(S.board, col);
  if (!k) return false;
  return isSquareAttacked(S, k.r, k.f, col === 'w' ? 'b' : 'w');
}

export function legalMovesForPiece(S, r, f) {
  const p = S.board[r][f]; if (!p) return [];
  const col = p[0], opp = col === 'w' ? 'b' : 'w';
  return pseudoMoves(S, r, f).filter(m => {
    if (m.castle) {
      if (isInCheck(S, col)) return false;
      const mf = m.castle === 'K' ? 5 : 3;
      if (isSquareAttacked(S, r, 4, opp)) return false;
      if (isSquareAttacked(S, r, mf, opp)) return false;
      if (isSquareAttacked(S, r, m.f, opp)) return false;
    }
    return !isInCheck(applyMove(S, r, f, m.r, m.f, m), col);
  });
}

export function allLegalMoves(S, col) {
  const res = [];
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++) {
      if (S.board[r][f]?.[0] !== col) continue;
      for (const m of legalMovesForPiece(S, r, f))
        res.push({ fromR: r, fromF: f, toR: m.r, toF: m.f, extra: m });
    }
  return res;
}

export function hasAnyLegal(S, col) { return allLegalMoves(S, col).length > 0; }

// ═══════════════════════════════════════
// IMPROVED AI — Alpha-Beta + PST + Move Ordering
// ═══════════════════════════════════════

const PIECE_VAL = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };
const AMAZON_VAL = 1200; // Queen + Knight bonus

// Piece-square tables (white perspective, flip for black)
const PST = {
  P: [[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],
      [5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],
      [5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]],
  N: [[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],
      [-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],
      [-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],
      [-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],
  B: [[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],
      [-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],
      [-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],
      [-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],
  R: [[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],
      [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
      [-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]],
  Q: [[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],
      [-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],
      [0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],
      [-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]],
  K: [[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
      [-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],
      [20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]],
};

function getPieceValue(board, r, f, specials) {
  const p = board[r][f]; if (!p) return 0;
  const col = p[0], type = p[1];
  const sp = specials?.[r + '_' + f];
  const base = sp === 'amazon' ? AMAZON_VAL : (PIECE_VAL[type] || 0);
  const pst  = PST[type] ? (col === 'w' ? PST[type][r][f] : PST[type][7 - r][f]) : 0;
  return (col === 'w' ? 1 : -1) * (base + pst);
}

function evaluate(S) {
  let score = 0;
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++)
      score += getPieceValue(S.board, r, f, S.specials);
  // Mobility bonus (small)
  score += (allLegalMoves(S, 'w').length - allLegalMoves(S, 'b').length) * 3;
  return score;
}

// MVV-LVA capture ordering
const MVV_LVA_VAL = { P: 1, N: 2, B: 2, R: 3, Q: 4, K: 5 };
function moveScore(S, mv) {
  const victim = S.board[mv.toR][mv.toF];
  const attacker = S.board[mv.fromR][mv.fromF];
  if (!victim) return mv.extra?.castle ? 50 : 0;
  return (MVV_LVA_VAL[victim[1]] || 0) * 10 - (MVV_LVA_VAL[attacker?.[1]] || 0);
}

function negamax(S, depth, alpha, beta) {
  if (depth <= 0) {
    const e = evaluate(S);
    return S.turn === 'w' ? e : -e;
  }
  const moves = allLegalMoves(S, S.turn);
  if (!moves.length) return isInCheck(S, S.turn) ? -999999 + depth : 0;

  // Move ordering: captures first (MVV-LVA), then castling, then quiet
  moves.sort((a, b) => moveScore(S, b) - moveScore(S, a));

  let best = -Infinity;
  for (const mv of moves) {
    const ns = applyMove(S, mv.fromR, mv.fromF, mv.toR, mv.toF, mv.extra);
    const score = -negamax(ns, depth - 1, -beta, -alpha);
    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }
  return best;
}

// opts: { depth, randomness, blunder }
export function aiChooseMove(S, opts = {}) {
  const depth      = Math.max(1, opts.depth ?? 2);
  const randomness = opts.randomness ?? 0.02;
  const blunder    = opts.blunder ?? false;   // intentional bad move

  const moves = allLegalMoves(S, S.turn);
  if (!moves.length) return null;

  if (blunder) {
    // Pick one of the worst moves
    moves.sort((a, b) => moveScore(S, a) - moveScore(S, b));
    return moves[0];
  }

  moves.sort((a, b) => moveScore(S, b) - moveScore(S, a));

  let best = null, bestScore = -Infinity;
  for (const mv of moves) {
    const ns = applyMove(S, mv.fromR, mv.fromF, mv.toR, mv.toF, mv.extra);
    let score = -negamax(ns, depth - 1, -Infinity, Infinity);
    score += (Math.random() - 0.5) * randomness * 100;
    if (score > bestScore) { bestScore = score; best = mv; }
  }
  return best;
}
