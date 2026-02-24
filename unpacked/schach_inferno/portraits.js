// ═══════════════════════════════════════
// SCHACH INFERNO — Character Portraits
// Inscryption-style woodcut SVG
// ═══════════════════════════════════════

// Shared woodcut filter — scratchy, hand-carved look
const WC_FILTER = `
  <defs>
    <filter id="wc" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="4" seed="2" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="wc2" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" seed="7" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4"/>
    </filter>
  </defs>`;

export const PORTRAITS = {

  // ── The Wanderer (Player) ──
  wanderer: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
    ${WC_FILTER}
    <rect width="80" height="100" fill="#1a0e06"/>
    <!-- Cloak outer -->
    <path d="M5 100 C5 68 12 52 40 46 C68 52 75 68 75 100Z"
      fill="#2a1808" stroke="#7a4a18" stroke-width="1.8" filter="url(#wc)"/>
    <!-- Cloak inner lines (woodcut hatching) -->
    <path d="M22 65 L18 100M30 58 L26 100M40 55 L38 100M50 58 L52 100M58 65 L62 100"
      stroke="#3a2010" stroke-width="0.8" opacity=".7"/>
    <!-- Body -->
    <rect x="28" y="46" width="24" height="30" rx="3" fill="#3a2010" stroke="#6a4020" stroke-width="1.2" filter="url(#wc)"/>
    <!-- Chest buckle -->
    <rect x="36" y="52" width="8" height="10" rx="1" fill="none" stroke="#c08030" stroke-width="1"/>
    <line x1="40" y1="52" x2="40" y2="62" stroke="#c08030" stroke-width="0.8"/>
    <!-- Head -->
    <ellipse cx="40" cy="32" rx="16" ry="18" fill="#c8a070" stroke="#5a3010" stroke-width="1.6" filter="url(#wc)"/>
    <!-- Hood -->
    <path d="M22 26 C20 8 60 8 58 26 L62 46 C52 38 28 38 18 46Z"
      fill="#2a1808" stroke="#6a3810" stroke-width="1.6" filter="url(#wc)"/>
    <!-- Hood inner shadow -->
    <path d="M26 28 C25 14 55 14 54 28 L57 44 C48 37 32 37 23 44Z"
      fill="#1a0e04" opacity=".6"/>
    <!-- Eyes (glowing amber) -->
    <ellipse cx="34" cy="32" rx="3.5" ry="4" fill="#0d0804"/>
    <ellipse cx="46" cy="32" rx="3.5" ry="4" fill="#0d0804"/>
    <ellipse cx="34.5" cy="31.5" rx="1.8" ry="2" fill="#e8a030" opacity=".9"/>
    <ellipse cx="46.5" cy="31.5" rx="1.8" ry="2" fill="#e8a030" opacity=".9"/>
    <!-- Battle scar -->
    <path d="M37 37 Q40 38 43 37" stroke="#7a3010" stroke-width="1.2" fill="none" filter="url(#wc)"/>
    <!-- Traveling staff -->
    <line x1="66" y1="22" x2="71" y2="100" stroke="#5a3010" stroke-width="2.8" stroke-linecap="round"/>
    <!-- Staff orb -->
    <circle cx="66" cy="22" r="4.5" fill="none" stroke="#e8a030" stroke-width="1.5"/>
    <circle cx="66" cy="22" r="2" fill="#e8a030" opacity=".7"/>
  </svg>`,

  // ── The Pawn Ghost (first enemy) ──
  pawn_ghost: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
    ${WC_FILTER}
    <rect width="80" height="100" fill="#0a0510"/>
    <!-- Ghost trail wisps -->
    <path d="M20 100 C18 88 12 82 14 95" fill="none" stroke="#4a3070" stroke-width="2" opacity=".5"/>
    <path d="M38 100 C35 90 28 86 30 98" fill="none" stroke="#4a3070" stroke-width="2" opacity=".4"/>
    <path d="M58 100 C60 88 66 83 64 96" fill="none" stroke="#4a3070" stroke-width="2" opacity=".5"/>
    <!-- Ghost body -->
    <path d="M14 100 C14 72 10 55 40 42 C70 55 66 72 66 100Z"
      fill="rgba(50,28,80,0.6)" stroke="#6040a0" stroke-width="1.5" filter="url(#wc)"/>
    <!-- Faint hatching on body -->
    <path d="M22 65 L18 100M32 58 L29 100M42 55 L40 100M52 58 L55 100"
      stroke="#5a3890" stroke-width="0.7" opacity=".4"/>
    <!-- Head -->
    <ellipse cx="40" cy="30" rx="18" ry="20" fill="#1c1030" stroke="#7050b0" stroke-width="1.8" filter="url(#wc)"/>
    <!-- Pawn crown (stylized) -->
    <path d="M25 16 L29 8 L40 13 L51 8 L55 16 L53 24 L27 24Z"
      fill="#2a1850" stroke="#7050b0" stroke-width="1.5" filter="url(#wc)"/>
    <circle cx="29" cy="8" r="2.2" fill="#8060c0"/>
    <circle cx="40" cy="13" r="2.2" fill="#8060c0"/>
    <circle cx="51" cy="8" r="2.2" fill="#8060c0"/>
    <!-- Hollow eyes -->
    <ellipse cx="33" cy="30" rx="5" ry="6" fill="#0a0616"/>
    <ellipse cx="47" cy="30" rx="5" ry="6" fill="#0a0616"/>
    <ellipse cx="33" cy="30" rx="3" ry="4" fill="#6040e0" opacity=".8"/>
    <ellipse cx="47" cy="30" rx="3" ry="4" fill="#6040e0" opacity=".8"/>
    <ellipse cx="33" cy="29" rx="1.2" ry="1.5" fill="#fff" opacity=".7"/>
    <ellipse cx="47" cy="29" rx="1.2" ry="1.5" fill="#fff" opacity=".7"/>
    <!-- Ectoplasm drip -->
    <path d="M40 50 Q37 62 41 76 Q38 86 40 100" fill="none" stroke="#6040a0" stroke-width="1.8" opacity=".5" filter="url(#wc)"/>
  </svg>`,

  // ── The Red Knight (aggressive fighter) ──
  red_knight: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
    ${WC_FILTER}
    <rect width="80" height="100" fill="#100508"/>
    <!-- Red battle cape -->
    <path d="M8 100 C8 70 16 54 40 48 C64 54 72 70 72 100Z"
      fill="#4a0e0e" stroke="#8a1a0a" stroke-width="1.8" filter="url(#wc)"/>
    <!-- Cape woodcut lines -->
    <path d="M18 62 L14 100M27 54 L23 100M40 51 L38 100M53 54 L57 100M62 62 L66 100"
      stroke="#6a1a10" stroke-width="0.8" opacity=".6"/>
    <!-- Chest armor -->
    <rect x="26" y="48" width="28" height="35" rx="2" fill="#2a1808" stroke="#8a3010" stroke-width="2" filter="url(#wc)"/>
    <!-- Armor rivets -->
    <circle cx="30" cy="54" r="1.5" fill="#c06030"/>
    <circle cx="50" cy="54" r="1.5" fill="#c06030"/>
    <circle cx="30" cy="74" r="1.5" fill="#c06030"/>
    <circle cx="50" cy="74" r="1.5" fill="#c06030"/>
    <!-- Cross emblem -->
    <rect x="37" y="56" width="6" height="18" rx="1" fill="none" stroke="#c06030" stroke-width="1.2"/>
    <rect x="31" y="62" width="18" height="6" rx="1" fill="none" stroke="#c06030" stroke-width="1.2"/>
    <!-- Helmet (visored) -->
    <rect x="22" y="14" width="36" height="36" rx="3" fill="#3a2010" stroke="#8a3010" stroke-width="2" filter="url(#wc)"/>
    <!-- Visor slit -->
    <rect x="27" y="28" width="26" height="10" rx="1.5" fill="#0d0602"/>
    <line x1="27" y1="33" x2="53" y2="33" stroke="#c04010" stroke-width="0.8"/>
    <!-- Eyes through visor -->
    <ellipse cx="35" cy="33" rx="2.8" ry="2.2" fill="#ff3010" opacity=".8"/>
    <ellipse cx="45" cy="33" rx="2.8" ry="2.2" fill="#ff3010" opacity=".8"/>
    <!-- Helmet crest / plume -->
    <path d="M34 14 C36 2 44 2 46 14" fill="#8a1a0a" stroke="#c02010" stroke-width="1.2" filter="url(#wc)"/>
    <path d="M36 14 C37 5 43 5 44 14" fill="#c02010" stroke="#e04020" stroke-width="0.8"/>
    <!-- Sword -->
    <rect x="66" y="38" width="4" height="52" rx="2" fill="#5a3010" stroke="#8a5020" stroke-width="1"/>
    <rect x="60" y="42" width="16" height="5" rx="1" fill="#8a5020" stroke="#c08030" stroke-width="1"/>
    <path d="M68 38 L66 20 L70 20 L68 38Z" fill="#c0c8d0" stroke="#8090a0" stroke-width="1"/>
  </svg>`,

  // ── The Grandmaster (wise old player) ──
  grandmaster: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
    ${WC_FILTER}
    <rect width="80" height="100" fill="#08060e"/>
    <!-- Star-robe -->
    <path d="M10 100 C10 70 16 54 40 46 C64 54 70 70 70 100Z"
      fill="#14102a" stroke="#3a2858" stroke-width="1.8" filter="url(#wc)"/>
    <!-- Robe hatching lines -->
    <path d="M18 64 L14 100M27 56 L23 100M40 53 L38 100M53 56 L57 100M62 64 L66 100"
      stroke="#2a1a40" stroke-width="0.8" opacity=".5"/>
    <!-- Stars on robe -->
    <text x="28" y="75" font-size="8" fill="#e8a030" opacity=".5">✦</text>
    <text x="44" y="66" font-size="6" fill="#e8a030" opacity=".4">✦</text>
    <text x="22" y="88" font-size="5" fill="#e8a030" opacity=".3">✦</text>
    <text x="52" y="84" font-size="7" fill="#e8a030" opacity=".4">✦</text>
    <!-- Long white beard -->
    <path d="M28 50 C24 66 22 80 32 94 C36 98 44 98 48 94 C58 80 56 66 52 50"
      fill="#e0d8c0" stroke="#a09878" stroke-width="1" filter="url(#wc)"/>
    <!-- Beard lines -->
    <path d="M33 54 C32 70 30 82 34 92M40 52 C40 68 39 82 41 94M47 54 C48 70 50 82 46 92"
      stroke="#b0a888" stroke-width="0.7" fill="none"/>
    <!-- Head -->
    <ellipse cx="40" cy="28" rx="16" ry="18" fill="#c8a878" stroke="#5a3810" stroke-width="1.6" filter="url(#wc)"/>
    <!-- Long white hair -->
    <path d="M24 22 C18 8 16 36 22 46" fill="#e8e0d0" stroke="#c0b8a0" stroke-width="3.5" stroke-linecap="round" filter="url(#wc)"/>
    <path d="M56 22 C62 8 64 36 58 46" fill="#e8e0d0" stroke="#c0b8a0" stroke-width="3.5" stroke-linecap="round" filter="url(#wc)"/>
    <!-- Wise eyes -->
    <ellipse cx="34" cy="28" rx="3.2" ry="2.8" fill="#1a1008"/>
    <ellipse cx="46" cy="28" rx="3.2" ry="2.8" fill="#1a1008"/>
    <circle cx="34.8" cy="27.5" r="1.2" fill="#e8c860" opacity=".9"/>
    <circle cx="46.8" cy="27.5" r="1.2" fill="#e8c860" opacity=".9"/>
    <!-- Bushy eyebrows -->
    <path d="M30 23 Q34 21 38 23" stroke="#e8e0c8" stroke-width="2.2" fill="none" filter="url(#wc)"/>
    <path d="M42 23 Q46 21 50 23" stroke="#e8e0c8" stroke-width="2.2" fill="none" filter="url(#wc)"/>
    <!-- Crown of understanding -->
    <path d="M24 14 L28 5 L40 11 L52 5 L56 14 L54 20 L26 20Z"
      fill="#1e1838" stroke="#e8a030" stroke-width="1.6" filter="url(#wc)"/>
    <circle cx="28" cy="5" r="2.5" fill="#e8a030"/>
    <circle cx="40" cy="11" r="2.5" fill="#e8a030"/>
    <circle cx="52" cy="5" r="2.5" fill="#e8a030"/>
    <!-- Chess piece in hand -->
    <g transform="translate(58,62)">
      <rect x="0" y="8" width="16" height="4" rx="1" fill="#5a3010" stroke="#8a5020" stroke-width="1"/>
      <rect x="3" y="4" width="10" height="5" rx="1" fill="#5a3010" stroke="#8a5020" stroke-width="1"/>
      <circle cx="8" cy="2" r="3.5" fill="#5a3010" stroke="#8a5020" stroke-width="1"/>
    </g>
  </svg>`,

  // ── The Fortress Warden (heavy armored boss) ──
  fortress: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
    ${WC_FILTER}
    <rect width="80" height="100" fill="#040810"/>
    <!-- Heavy plate body -->
    <rect x="14" y="46" width="52" height="54" rx="2" fill="#161e2c" stroke="#28384e" stroke-width="2.5" filter="url(#wc)"/>
    <!-- Armor plate horizontal lines (engraved) -->
    <line x1="14" y1="60" x2="66" y2="60" stroke="#28384e" stroke-width="1"/>
    <line x1="14" y1="74" x2="66" y2="74" stroke="#28384e" stroke-width="1"/>
    <line x1="14" y1="88" x2="66" y2="88" stroke="#28384e" stroke-width="1"/>
    <!-- Plate rivets -->
    <circle cx="17" cy="57" r="1.5" fill="#3a5070"/><circle cx="63" cy="57" r="1.5" fill="#3a5070"/>
    <circle cx="17" cy="71" r="1.5" fill="#3a5070"/><circle cx="63" cy="71" r="1.5" fill="#3a5070"/>
    <circle cx="17" cy="85" r="1.5" fill="#3a5070"/><circle cx="63" cy="85" r="1.5" fill="#3a5070"/>
    <!-- Pauldrons (shoulder guards) -->
    <ellipse cx="14" cy="52" rx="9" ry="14" fill="#161e2c" stroke="#28384e" stroke-width="2.5" filter="url(#wc)"/>
    <ellipse cx="66" cy="52" rx="9" ry="14" fill="#161e2c" stroke="#28384e" stroke-width="2.5" filter="url(#wc)"/>
    <!-- Shoulder rivets -->
    <circle cx="10" cy="46" r="1.2" fill="#3a5070"/><circle cx="70" cy="46" r="1.2" fill="#3a5070"/>
    <!-- Castle-top helmet -->
    <rect x="20" y="16" width="40" height="32" rx="2" fill="#161e2c" stroke="#28384e" stroke-width="2.5" filter="url(#wc)"/>
    <!-- Battlements -->
    <rect x="20" y="8" width="8" height="12" rx="1" fill="#161e2c" stroke="#28384e" stroke-width="2"/>
    <rect x="36" y="8" width="8" height="12" rx="1" fill="#161e2c" stroke="#28384e" stroke-width="2"/>
    <rect x="52" y="8" width="8" height="12" rx="1" fill="#161e2c" stroke="#28384e" stroke-width="2"/>
    <!-- Eye slit -->
    <rect x="25" y="30" width="30" height="8" rx="1" fill="#060a12"/>
    <!-- Cold blue eyes -->
    <rect x="28" y="32" width="10" height="4" rx="1" fill="#2050a0" opacity=".7"/>
    <rect x="42" y="32" width="10" height="4" rx="1" fill="#2050a0" opacity=".7"/>
    <!-- Shield on chest -->
    <path d="M30 64 L40 60 L50 64 L50 76 L40 82 L30 76Z"
      fill="none" stroke="#4080e0" stroke-width="1.5" filter="url(#wc)"/>
    <text x="40" y="74" text-anchor="middle" font-size="10" fill="#4080e0">♜</text>
  </svg>`,

  // ── The Dark Queen (final boss) ──
  dark_queen: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
    ${WC_FILTER}
    <rect width="80" height="100" fill="#080410"/>
    <!-- Dark flowing dress -->
    <path d="M4 100 C4 68 10 50 40 42 C70 50 76 68 76 100Z"
      fill="#0e0820" stroke="#3a1860" stroke-width="2" filter="url(#wc)"/>
    <!-- Dress pattern lines -->
    <path d="M15 60 L10 100M24 52 L19 100M33 48 L30 100M47 48 L50 100M56 52 L61 100M65 60 L70 100"
      stroke="#2a1048" stroke-width="0.8" opacity=".6"/>
    <!-- Flowing dark magic tendrils -->
    <path d="M8 72 C4 60 2 50 8 42" fill="none" stroke="#6020a0" stroke-width="1.5" opacity=".6" filter="url(#wc)"/>
    <path d="M72 72 C76 60 78 50 72 42" fill="none" stroke="#6020a0" stroke-width="1.5" opacity=".6" filter="url(#wc)"/>
    <path d="M14 85 C8 75 5 64 10 56" fill="none" stroke="#6020a0" stroke-width="1.2" opacity=".4"/>
    <path d="M66 85 C72 75 75 64 70 56" fill="none" stroke="#6020a0" stroke-width="1.2" opacity=".4"/>
    <!-- Bodice -->
    <rect x="26" y="42" width="28" height="30" rx="2" fill="#160c2c" stroke="#5030a0" stroke-width="1.5" filter="url(#wc)"/>
    <!-- Bodice star pattern -->
    <text x="40" y="60" text-anchor="middle" font-size="14" fill="#8040c0" opacity=".7">♛</text>
    <!-- Head -->
    <ellipse cx="40" cy="24" rx="16" ry="18" fill="#c0a0c8" stroke="#5030a0" stroke-width="1.8" filter="url(#wc)"/>
    <!-- Dark flowing hair -->
    <path d="M24 18 C18 4 14 32 20 44" fill="#1a0830" stroke="#3a1050" stroke-width="4" stroke-linecap="round" filter="url(#wc)"/>
    <path d="M56 18 C62 4 66 32 60 44" fill="#1a0830" stroke="#3a1050" stroke-width="4" stroke-linecap="round" filter="url(#wc)"/>
    <path d="M30 15 C28 4 52 4 50 15" fill="#1a0830" stroke="#3a1050" stroke-width="3" filter="url(#wc)"/>
    <!-- Pale face lines (woodcut) -->
    <path d="M28 24 L26 28" stroke="#a088b0" stroke-width="0.6"/>
    <path d="M52 24 L54 28" stroke="#a088b0" stroke-width="0.6"/>
    <!-- Eyes (piercing violet) -->
    <ellipse cx="33" cy="24" rx="4" ry="4.5" fill="#0a0418"/>
    <ellipse cx="47" cy="24" rx="4" ry="4.5" fill="#0a0418"/>
    <ellipse cx="33" cy="23.5" rx="2.5" ry="3" fill="#a030e0" opacity=".9"/>
    <ellipse cx="47" cy="23.5" rx="2.5" ry="3" fill="#a030e0" opacity=".9"/>
    <ellipse cx="33.5" cy="23" rx="1" ry="1.2" fill="#f0c0ff" opacity=".8"/>
    <ellipse cx="47.5" cy="23" rx="1" ry="1.2" fill="#f0c0ff" opacity=".8"/>
    <!-- Queen crown (elaborate) -->
    <path d="M20 10 L24 0 L40 7 L56 0 L60 10 L58 17 L22 17Z"
      fill="#180c30" stroke="#a030e0" stroke-width="1.8" filter="url(#wc)"/>
    <circle cx="24" cy="0" r="2.5" fill="#c040f0"/>
    <circle cx="40" cy="7" r="3" fill="#c040f0"/>
    <circle cx="56" cy="0" r="2.5" fill="#c040f0"/>
    <!-- Crown gems -->
    <rect x="36" y="10" width="8" height="6" rx="1" fill="#6010c0" stroke="#c040f0" stroke-width="1"/>
  </svg>`,
};

// Portrait size wrapper for consistent display
export function renderPortrait(id, containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = PORTRAITS[id] || PORTRAITS.wanderer;
}
