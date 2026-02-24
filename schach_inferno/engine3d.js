// ═══════════════════════════════════════
// SCHACH INFERNO — 3D Board Engine
// Three.js · Candle flicker · Highlights
// Special piece visual rings
// ═══════════════════════════════════════

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const GLYPH = {
  wP:'♙', wN:'♘', wB:'♗', wR:'♖', wQ:'♕', wK:'♔',
  bP:'♟', bN:'♞', bB:'♝', bR:'♜', bQ:'♛', bK:'♚',
};
const SPECIAL_GLYPH = { amazon: '⚜' };

export function createEngine3D(rootEl, onSquareClick) {
  // ── Renderer ──────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  rootEl.innerHTML = '';
  rootEl.appendChild(renderer.domElement);

  // ── Scene / Camera ─────────────────────────────────
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);

  let yaw = 0, pitch = 1.10, dist = 16.0;
  const camTarget = new THREE.Vector3(0, 0, 0);

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function applyOrbit() {
    pitch = clamp(pitch, 0.85, 1.42);
    dist  = clamp(dist, 7.5, 28.0);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    camera.position.set(
      camTarget.x + dist * cp * Math.sin(yaw),
      camTarget.y + dist * sp,
      camTarget.z + dist * cp * Math.cos(yaw)
    );
    camera.lookAt(camTarget);
  }
  applyOrbit();

  // ── Lights ─────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));

  const sunLight = new THREE.DirectionalLight(0xffe8c0, 0.75);
  sunLight.position.set(6, 10, 4);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  scene.add(sunLight);

  // Two candle point lights — they flicker
  const candleL = new THREE.PointLight(0xff8822, 0.55, 22);
  candleL.position.set(-5, 6, -5);
  scene.add(candleL);
  const candleR = new THREE.PointLight(0xff6612, 0.45, 22);
  candleR.position.set(5, 5, 5);
  scene.add(candleR);

  // ── Board geometry ─────────────────────────────────
  const SQ   = 1.0;
  const orig = new THREE.Vector3(-3.5 * SQ, 0, -3.5 * SQ);

  const boardGroup = new THREE.Group();
  scene.add(boardGroup);

  const lightMat = new THREE.MeshStandardMaterial({ color: 0xb98a55, roughness: .85, metalness: .05 });
  const darkMat  = new THREE.MeshStandardMaterial({ color: 0x6b3e24, roughness: .85, metalness: .05 });
  const sqGeo    = new THREE.BoxGeometry(SQ, 0.18, SQ);

  // Highlight overlay geometries / materials
  const hlGeo = new THREE.PlaneGeometry(SQ * .95, SQ * .95);
  const MAT = {
    move:     new THREE.MeshBasicMaterial({ color: 0x22cc55, transparent: true, opacity: .30, side: THREE.DoubleSide }),
    capture:  new THREE.MeshBasicMaterial({ color: 0xdd2200, transparent: true, opacity: .38, side: THREE.DoubleSide }),
    selected: new THREE.MeshBasicMaterial({ color: 0xffcc00, transparent: true, opacity: .42, side: THREE.DoubleSide }),
    lastFrom: new THREE.MeshBasicMaterial({ color: 0xffaa22, transparent: true, opacity: .22, side: THREE.DoubleSide }),
    lastTo:   new THREE.MeshBasicMaterial({ color: 0xffaa22, transparent: true, opacity: .28, side: THREE.DoubleSide }),
  };

  const hlMeshes = [];
  for (let r = 0; r < 8; r++) {
    hlMeshes[r] = [];
    for (let f = 0; f < 8; f++) {
      // Square tile
      const sq = new THREE.Mesh(sqGeo, ((r + f) & 1) ? darkMat : lightMat);
      sq.position.set(orig.x + f * SQ, -0.09, orig.z + r * SQ);
      sq.receiveShadow = true;
      sq.userData = { r, f, kind: 'square' };
      boardGroup.add(sq);

      // Highlight plane
      const hl = new THREE.Mesh(hlGeo, MAT.move);
      hl.rotation.x = -Math.PI / 2;
      hl.position.set(orig.x + f * SQ, 0.012, orig.z + r * SQ);
      hl.visible = false;
      boardGroup.add(hl);
      hlMeshes[r][f] = hl;
    }
  }

  // Board border/frame
  const border = new THREE.Mesh(
    new THREE.BoxGeometry(9.0, 0.55, 9.0),
    new THREE.MeshStandardMaterial({ color: 0x2b1a10, roughness: 1.0, metalness: 0 })
  );
  border.position.set(0, -0.37, 0);
  border.receiveShadow = true;
  scene.add(border);

  // Coordinate labels (thin planes with canvas texture) — optional, adds polish
  function makeCoordTex(text) {
    const c = document.createElement('canvas'); c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 64, 64);
    ctx.font = 'bold 36px serif';
    ctx.fillStyle = 'rgba(200,168,100,0.7)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 32);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const coordGeo = new THREE.PlaneGeometry(0.55, 0.55);
  for (let i = 0; i < 8; i++) {
    // rank numbers (left side)
    const rm = new THREE.Mesh(coordGeo, new THREE.MeshBasicMaterial({ map: makeCoordTex(String(8 - i)), transparent: true }));
    rm.rotation.x = -Math.PI / 2;
    rm.position.set(orig.x - 0.7, 0.01, orig.z + i * SQ);
    scene.add(rm);
    // file letters (front side)
    const fm = new THREE.Mesh(coordGeo, new THREE.MeshBasicMaterial({ map: makeCoordTex(String.fromCharCode(97 + i)), transparent: true }));
    fm.rotation.x = -Math.PI / 2;
    fm.position.set(orig.x + i * SQ, 0.01, orig.z + 8 * SQ + 0.1);
    scene.add(fm);
  }

  // ── Pieces ─────────────────────────────────────────
  let pieceMeshes = Array.from({ length: 8 }, () => Array(8).fill(null));
  const piecesGroup = new THREE.Group();
  scene.add(piecesGroup);

  const tokenGeo = new THREE.CylinderGeometry(0.42, 0.44, 0.32, 32);
  const ringGeo  = new THREE.TorusGeometry(0.44, 0.045, 8, 32);

  function makeTokenTex(pieceCode, specialType) {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);

    const side = pieceCode[0];
    // Chess glyph
    ctx.font = 'bold 158px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle    = side === 'w' ? '#111010' : '#ece8de';
    ctx.strokeStyle  = side === 'w' ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.38)';
    ctx.lineWidth    = 9;
    ctx.strokeText(GLYPH[pieceCode] || '?', 128, 140);
    ctx.fillText(GLYPH[pieceCode] || '?', 128, 140);

    // Special badge
    if (specialType) {
      ctx.font = 'bold 72px serif';
      ctx.fillStyle   = '#cc44ff';
      ctx.strokeStyle = 'rgba(0,0,0,.7)';
      ctx.lineWidth   = 6;
      const g = SPECIAL_GLYPH[specialType] || '✦';
      ctx.strokeText(g, 208, 48); ctx.fillText(g, 208, 48);
    }

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
  }

  function makeToken(pieceCode, specialType) {
    const side  = pieceCode[0];
    const color = specialType
      ? (side === 'w' ? 0xc8b0e8 : 0x3a1060)
      : (side === 'w' ? 0xd6d1c6 : 0x1b1b1b);

    const mat  = new THREE.MeshStandardMaterial({ color, roughness: .65, metalness: .18 });
    const mesh = new THREE.Mesh(tokenGeo, mat);
    mesh.castShadow = true;

    // Top label
    const topMat = new THREE.MeshBasicMaterial({ map: makeTokenTex(pieceCode, specialType), transparent: true });
    const top = new THREE.Mesh(new THREE.CircleGeometry(0.38, 32), topMat);
    top.rotation.x = -Math.PI / 2; top.position.y = 0.17;
    mesh.add(top);

    // Purple ring for special pieces
    if (specialType) {
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xaa40ff }));
      ring.rotation.x = Math.PI / 2; ring.position.y = 0.17;
      mesh.add(ring);
    }
    return mesh;
  }

  function clearPieces() {
    piecesGroup.clear();
    pieceMeshes = Array.from({ length: 8 }, () => Array(8).fill(null));
  }

  function renderPieces(board, specials = {}) {
    clearPieces();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = board[r][f]; if (!p) continue;
        const sp = specials[r + '_' + f];
        const mesh = makeToken(p, sp);
        mesh.position.set(orig.x + f * SQ, 0.28, orig.z + r * SQ);
        mesh.userData = { r, f, kind: 'piece', piece: p };
        piecesGroup.add(mesh);
        pieceMeshes[r][f] = mesh;
      }
    }
  }

  // ── Highlights ────────────────────────────────────
  function setHighlights(hl) {
    for (let r = 0; r < 8; r++)
      for (let f = 0; f < 8; f++)
        hlMeshes[r][f].visible = false;
    if (!hl) return;

    const set = (r, f, mat) => {
      if (r < 0 || r > 7 || f < 0 || f > 7) return;
      const m = hlMeshes[r][f]; m.material = mat; m.visible = true;
    };

    if (hl.selected) set(hl.selected.r, hl.selected.f, MAT.selected);
    if (hl.lastFrom) set(hl.lastFrom.r, hl.lastFrom.f, MAT.lastFrom);
    if (hl.lastTo)   set(hl.lastTo.r,   hl.lastTo.f,   MAT.lastTo);
    for (const sq of (hl.moves    || [])) set(sq.r, sq.f, MAT.move);
    for (const sq of (hl.captures || [])) set(sq.r, sq.f, MAT.capture);
  }

  // ── Raycasting ────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener('pointerdown', ev => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x =  ((ev.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -(((ev.clientY - rect.top)  / rect.height) * 2 - 1);
    raycaster.setFromCamera(mouse, camera);
    for (const hit of raycaster.intersectObjects(boardGroup.children, false)) {
      if (hit.object.userData.kind === 'square') {
        onSquareClick?.(hit.object.userData.r, hit.object.userData.f);
        break;
      }
    }
  });

  // ── Keyboard controls ─────────────────────────────
  const keys = new Set();
  window.addEventListener('keydown', e => {
    const tag = e.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    keys.add(e.code);
    if (['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))
      e.preventDefault();
  }, { passive: false });
  window.addEventListener('keyup', e => keys.delete(e.code));

  renderer.domElement.addEventListener('wheel', e => {
    e.preventDefault();
    dist *= (e.deltaY > 0 ? 1.1 : 0.9);
    applyOrbit(); draw();
  }, { passive: false });

  // ── Animation loop ────────────────────────────────
  let lastT = performance.now(), candlePhase = 0;

  function tick(t) {
    const dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;
    candlePhase += dt;

    // Candle flicker
    candleL.intensity = 0.45 + Math.sin(candlePhase * 2.1) * 0.08 + Math.sin(candlePhase * 5.3) * 0.03;
    candleR.intensity = 0.35 + Math.sin(candlePhase * 1.8 + 1.2) * 0.07 + Math.sin(candlePhase * 6.1) * 0.025;

    // Camera keyboard control
    const speed = (keys.has('ShiftLeft') || keys.has('ShiftRight')) ? 3.2 : 1.8;
    if (keys.has('KeyA') || keys.has('ArrowLeft'))  yaw   -= speed * dt;
    if (keys.has('KeyD') || keys.has('ArrowRight')) yaw   += speed * dt;
    if (keys.has('KeyW') || keys.has('ArrowUp'))    pitch += speed * dt;
    if (keys.has('KeyS') || keys.has('ArrowDown'))  pitch -= speed * dt;
    if (keys.has('KeyQ')) yaw  -= speed * dt;
    if (keys.has('KeyE')) yaw  += speed * dt;
    if (keys.has('KeyR')) dist *= (1 - 0.9 * 0.12 * dt);
    if (keys.has('KeyF')) dist *= (1 + 0.9 * 0.12 * dt);

    applyOrbit();
    draw();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ── Resize / Draw ─────────────────────────────────
  function resize() {
    const w = Math.max(1, rootEl.clientWidth  | 0);
    const h = Math.max(1, rootEl.clientHeight | 0);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    draw();
  }

  function draw() { renderer.render(scene, camera); }

  // ── Public API ────────────────────────────────────
  function renderPosition(board, highlights, specials) {
    if (board) renderPieces(board, specials || {});
    setHighlights(highlights || null);
    draw();
  }

  function resetCamera() {
    yaw = 0; pitch = 1.10; dist = 16.0; camTarget.set(0, 0, 0);
    applyOrbit(); draw();
  }

  resize();

  return { resize, resetCamera, renderPosition };
}
