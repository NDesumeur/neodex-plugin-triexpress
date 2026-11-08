// Tri express : Centre de tri : les colis descendent le tapis, envoie chacun dans le bac de sa couleur. Les bacs changent de place, les bombes ne se trient pas.
// Jeu NeoDex : police, cadres et boutons propres au jeu. Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Tri express</span><span class="hint">← ↓ → : bac de gauche, du milieu, de droite · bombe : ne rien faire · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="txCanvas" width="216" height="288"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="txStats"></div></div>
      <div class="row"><button class="btn main" id="txNew">NOUVELLE JOURNÉE</button></div>
      <div class="hint">Rouge cœur, bleu goutte, vert feuille. Les bombes passent la ligne toutes seules : si tu en tries une, c'est une erreur.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{max-width:460px;aspect-ratio:216/288}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'TRI EXPRESS', T: { k: '#140a04', k2: '#22140a', fill: '#2e1c0e', fillOn: '#3c2612', hl: '#4a3018', line: '#6a4624', acc: '#ffd84a', accL: '#fff4a8', accS: '#c8a020', accD: '#4a3a06',
  rivet: '#fff4d0', btn: '#4a3018', btnHi: '#7a5430', btnLo: '#22140a', btnHov: '#5c3c1e', btnHovHi: '#946a3c', text: '#fff4e0', muted: '#d0b08a', acc2: '#5ec8ff', gold: '#ffd84a',
  orange: '#ffa030', red: '#ff4a5a', green: '#7ee07a', green2: '#2f8a3a', bg: '#180e06', bgDot: '#2e1c0e', bgDot2: '#22140a', spark: '#6a4624', spark2: '#ffd84a',
  tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................',
    '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] },
  emblem: ['............', '.kkkkkkkkkk.', '.kbbbybbbbk.', '.kbbbybbbbk.', '.kyyyyyyyyk.', '.kbbbybkkbk.', '.kbbbybkrkk.', '.kbbbybkkbk.', '.kkkkkkkkkk.', '............'],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

/* ---------- Tri express : file de colis sur un tapis vertical, le plus bas est celui qu'on trie ---------- */
const TX = {W: 216, H: 288, CX: 108, GATE: 196, BINS: [38, 108, 178], BINY: 252};
const TX_COL = [['rouge', '#ff4a5a', '#a81a2a', ['.k.k.', 'kwkrk', 'krrrk', '.krk.', '..k..']], ['bleu', '#4a8aff', '#1a4aa8', ['..k..', '.kwk.', 'kbbbk', 'kbbbk', '.kkk.']], ['vert', '#5ad05a', '#1a8a2a', ['...kk', '..kgk', '.kggk', 'kggk.', 'kk...']]];
const txs = gstore('triexpress', {days: 0, sorted: 0, bombs: 0});
let tx = null;
const txCanvas = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; fn(c.getContext('2d')); return c; };
function txBox(ci) {  // un colis 18 × 14 : carton, scotch, étiquette avec le symbole de la couleur ; ou une bombe
  return txCanvas(18, 16, g => {
    if (ci < 0) { px(g, '#140a04', 4, 3, 10, 12); px(g, '#140a04', 3, 5, 12, 8); px(g, '#2a2a3a', 5, 4, 8, 10); px(g, '#2a2a3a', 4, 6, 10, 6); px(g, '#5a5a6a', 6, 5, 2, 2); px(g, '#8a6a3a', 8, 1, 2, 3); px(g, '#ffd84a', 10, 0, 2, 2); px(g, '#ff8a2a', 11, 1, 1, 1); return; }
    const [, c, d, icon] = TX_COL[ci];
    px(g, '#140a04', 0, 2, 18, 14); px(g, '#c8925a', 1, 3, 16, 12); px(g, '#a8723a', 1, 12, 16, 3); px(g, '#e0b07a', 1, 3, 16, 1); px(g, '#e8d8a0', 7, 3, 3, 12);
    px(g, '#140a04', 10, 6, 7, 7); px(g, '#fff4e0', 11, 7, 5, 5); sprite(g, icon, 11, 7, {k: d, w: '#ffffff', r: c, b: c, g: c});
  });
}
const TX_BOX = [0, 1, 2].map(txBox), TX_BOMB = txBox(-1);
function txNew() { tx = Object.assign(tx || {tick: 0, raf: 0}, {seen: tx ? tx.tick : 0, mode: 'ready', q: [], fly: [], bins: [0, 1, 2], shuffle: 0, lives: 3, score: 0, combo: 0, sorted: 0, spawn: 0, fx: [], record: false, dead: 0, binsFrom: null, bombs: 0}); }
const txSpeed = () => .45 + Math.min(1.1, tx.sorted / 120);
let txac = null;
function txBeep(f, d, type = 'square', slide = 0) { try { txac ??= new AudioContext(); const o = txac.createOscillator(), g = txac.createGain(), t = txac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(.045, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(txac.destination); o.start(t); o.stop(t + d + .02); } catch {} }
function txSend(b) {
  if (tx.mode === 'ready') { tx.mode = 'play'; txs.days++; saveGames(); return; }
  if (tx.mode === 'pause') { tx.mode = 'play'; return; }
  if (tx.mode === 'over') { if (tx.dead > 40) txNew(); return; }
  if (tx.shuffle > 0) return;  // pendant le mélange, les bacs bougent : on attend
  const p = tx.q.find(p => p.y > -8); if (!p) return;
  tx.q.splice(tx.q.indexOf(p), 1); tx.fly.push({...p, b, t: 0, x0: TX.CX, y0: p.y}); txBeep(300, .05);
}
function txLose(x, y, why) { tx.lives--; tx.combo = 0; tx.fx.push({x, y, t: 0, txt: why, c: '#ff4a5a'}); txBeep(140, .3, 'sawtooth', 70); if (tx.lives <= 0) { tx.mode = 'over'; tx.dead = 0; tx.record = best('triexpress', tx.score); txs.sorted += tx.sorted; txs.bombs += tx.bombs; saveGames(); txInfo(); } }
function txUpdate() {
  for (const f of tx.fx) f.t++; tx.fx = tx.fx.filter(f => f.t < 40);
  if (tx.mode === 'over') { tx.dead++; return; }
  if (tx.mode !== 'play') return;
  const v = txSpeed();
  // nouveaux colis en haut du tapis, de plus en plus serrés ; une bombe de temps en temps
  if (--tx.spawn <= 0) { const bomb = tx.sorted > 8 && Math.random() < .14; tx.q.push({c: bomb ? -1 : Math.floor(Math.random() * 3), y: -20}); tx.spawn = Math.max(26, 62 - tx.sorted / 3) * (.8 + Math.random() * .4) / (v / .45) * 1.6; }
  for (let i = 0; i < tx.q.length; i++) { const p = tx.q[i], prev = tx.q[i - 1], stop = prev ? prev.y - 17 : 999; p.y = Math.min(p.y + v, stop); }
  const front = tx.q[0];
  if (front && front.y >= TX.GATE) { tx.q.shift(); if (front.c < 0) { tx.bombs++; tx.score += 5; tx.fx.push({x: TX.CX, y: TX.GATE, t: 0, txt: '+5', c: '#ffd84a'}); txBeep(90, .25, 'triangle', 50); } else txLose(TX.CX, TX.GATE, 'RATÉ'); }
  for (const f of tx.fly) {
    f.t += .07; if (f.t < 1) continue; f.done = true;
    const bx = TX.BINS[f.b];
    if (f.c < 0) txLose(bx, TX.BINY - 20, 'BOUM');
    else if (tx.bins[f.b] !== f.c) txLose(bx, TX.BINY - 20, 'MAUVAIS BAC');
    else { tx.combo++; tx.sorted++; const pts = 10 * Math.min(5, 1 + Math.floor(tx.combo / 5)); tx.score += pts; tx.fx.push({x: bx, y: TX.BINY - 20, t: 0, txt: '+' + pts, c: '#7ee07a'}); txBeep(660 + Math.min(8, tx.combo) * 60, .07, 'square', 990);
      if (tx.sorted % 15 === 0) { tx.shuffle = 70; tx.binsFrom = [...tx.bins]; let n; do n = [...tx.bins].sort(() => Math.random() - .5); while (n.every((c, i) => c === tx.bins[i])); tx.bins = n; txBeep(440, .5, 'triangle', 880); } }
  }
  tx.fly = tx.fly.filter(f => !f.done);
  if (tx.shuffle > 0) tx.shuffle--;
}
function txBinX(i) {  // pendant le mélange, chaque bac glisse de son ancienne place à la nouvelle
  if (!tx.shuffle || !tx.binsFrom) return TX.BINS[i];
  const c = tx.bins[i], from = tx.binsFrom.indexOf(c), k = 1 - tx.shuffle / 70, e = k < .5 ? 2 * k * k : 1 - 2 * (1 - k) ** 2;
  return TX.BINS[from] + (TX.BINS[i] - TX.BINS[from]) * e;
}
function txDraw() {
  const g = tx.g, {W, H, CX, GATE, BINY} = TX;
  for (; tx.seen < tx.tick; tx.seen++) if (tx.mode !== 'play') txUpdate();
  g.imageSmoothingEnabled = false;
  // le mur en briques, le sol
  px(g, '#3a2414', 0, 0, W, H);
  for (let y = 0; y < 230; y += 8) for (let x = (y / 8 % 2) * 8 - 8; x < W; x += 16) { px(g, '#4a2e1a', x + 1, y + 1, 14, 6); px(g, '#5a3a22', x + 1, y + 1, 14, 1); }
  px(g, '#22140a', 0, 230, W, H - 230); px(g, '#2e1c0e', 0, 230, W, 2);
  // le tapis vertical : bords, lattes qui défilent
  px(g, '#140a04', CX - 14, 0, 28, GATE + 4); px(g, '#4a4a5a', CX - 12, 0, 24, GATE + 2);
  const sl = Math.floor(tx.tick * (tx.mode === 'play' ? txSpeed() : .2)) % 8; for (let y = -8 + sl; y < GATE; y += 8) px(g, '#3a3a48', CX - 12, y, 24, 2);
  px(g, '#8a8a9a', CX - 13, 0, 1, GATE + 2); px(g, '#8a8a9a', CX + 12, 0, 1, GATE + 2);
  // la ligne de tri, avec ses lampes
  for (let x = CX - 22; x < CX + 22; x += 4) px(g, Math.floor(tx.tick / 10) % 2 ? '#ffd84a' : '#c8a020', x, GATE + 4, 2, 2);
  px(g, '#140a04', CX - 26, GATE + 6, 52, 4); px(g, '#1a0e05', CX - 10, GATE + 10, 20, 20);  // le trou pour les bombes
  // les bacs : caisse, étiquette couleur + symbole, numéro de touche
  for (let i = 0; i < 3; i++) {
    const c = tx.bins[i], [, col, dk, icon] = TX_COL[c], x = Math.round(txBinX(i)) - 26, y = BINY - 16;
    px(g, '#140a04', x, y, 52, 34); px(g, '#8a5a2a', x + 1, y + 1, 50, 32); px(g, '#6a4220', x + 1, y + 10, 50, 2); px(g, '#6a4220', x + 1, y + 22, 50, 2); px(g, '#a87038', x + 1, y + 1, 50, 1);
    px(g, '#140a04', x + 14, y - 8, 24, 14); px(g, col, x + 15, y - 7, 22, 12); px(g, dk, x + 15, y + 3, 22, 2);
    const ic = txCanvas(5, 5, h => sprite(h, icon, 0, 0, {k: '#140a04', w: '#ffffff', r: '#fff4e0', b: '#fff4e0', g: '#fff4e0'})); g.drawImage(ic, x + 18, y - 5, 10, 10);
    PXK.fill(g, ['←', '↓', '→'][i], x + 33, y - 3, '#140a04', PXK.scale(8), 'center');
  }
  // les colis : la file sur le tapis, ceux qui volent vers un bac (en arc)
  tx.q.forEach((p, i) => { g.drawImage(p.c < 0 ? TX_BOMB : TX_BOX[p.c], CX - 9, Math.round(p.y - 8)); if (i === 0 && p.y > -8) { px(g, '#ffffff', CX - 12, Math.round(p.y - 9), 2, 2); px(g, '#ffffff', CX + 10, Math.round(p.y - 9), 2, 2); } });
  for (const f of tx.fly) { const tx1 = txBinX(f.b), x = f.x0 + (tx1 - f.x0) * f.t, y = f.y0 + (BINY - 14 - f.y0) * f.t - Math.sin(f.t * Math.PI) * 40; g.drawImage(f.c < 0 ? TX_BOMB : TX_BOX[f.c], Math.round(x - 9), Math.round(y - 8)); }
  for (const f of tx.fx) PXK.fill(g, f.txt, f.x, f.y - f.t / 2, f.c, PXK.scale(8), 'center');
  // score, cœurs, multiplicateur
  pxFont(g, String(tx.score), 6, 14, '#ffffff', 12);
  for (let i = 0; i < 3; i++) sprite(g, ['.kk.kk.', 'krrkrrk', 'krrrrrk', '.krrrk.', '..krk..', '...k...'], W - 26 + i * 8 - 8, 6, {k: '#140a04', r: i < tx.lives ? '#ff4a5a' : '#4a3018'});
  const mult = Math.min(5, 1 + Math.floor(tx.combo / 5)); if (mult > 1) pxFont(g, 'x' + mult, W - 6, 28, '#7ee07a', 8, 'right');
  if (tx.shuffle > 0) PXK.fill(g, 'MÉLANGE !', W / 2, 30, Math.floor(tx.tick / 6) % 2 ? '#ffd84a' : '#ffffff', PXK.scale(12), 'center');
  if (tx.mode === 'ready') gameText(g, W, [['TRI EXPRESS', '#ffd84a', 16], ['← ↓ → : choisir le bac', '#ffffff'], ['Bombe : ne rien faire', '#d0b08a'], ['Record ' + (games.best.triexpress || 0), '#7ee07a']], 100);
  if (tx.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Une touche pour reprendre', '#d0b08a']], 110);
  if (tx.mode === 'over' && tx.dead > 20) gameText(g, W, [['FIN DE LA JOURNÉE', '#ff4a5a', 12], ['Score ' + tx.score, '#ffffff'], [tx.sorted + ' colis triés', '#d0b08a'], [tx.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.triexpress || 0), '#7ee07a'], [tx.dead > 40 ? 'Une touche pour recommencer' : '', '#d0b08a']], 96);
}
function txInfo() {
  $('txStats').replaceChildren(...[['Meilleur score', games.best.triexpress || 0], ['Journées', txs.days], ['Colis triés', txs.sorted], ['Bombes évitées', txs.bombs]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !tx || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.repeat) return;
  const b = {ArrowLeft: 0, a: 0, q: 0, ArrowDown: 1, s: 1, ArrowRight: 2, d: 2}[e.key];
  if (b !== undefined) { e.preventDefault(); txSend(b); }
  else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (tx.mode !== 'play') txSend(1); }
  if (e.key.toLowerCase() === 'p' && tx.mode === 'play') tx.mode = 'pause';
});
$('txCanvas').onpointerdown = e => { e.preventDefault(); if (!tx) return; const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * TX.W; txSend(x < 73 ? 0 : x < 143 ? 1 : 2); };
$('txNew').onclick = () => { txNew(); $('txNew').blur(); };
{  // vérification : bon bac = points, mauvais bac = une vie, une bombe qui passe la ligne = des points
  const keep = tx, realBest = games.best.triexpress, realStats = {...txs}; tx = null;
  txNew(); tx.mode = 'play'; tx.spawn = 1e9; tx.q = [{c: 1, y: 100}]; txSend(tx.bins.indexOf(1)); for (let i = 0; i < 20; i++) txUpdate(); const good = tx.score > 0 && tx.lives === 3;
  tx.q = [{c: 2, y: 100}]; txSend(tx.bins.indexOf(0)); for (let i = 0; i < 20; i++) txUpdate(); const bad = tx.lives === 2;
  const s0 = tx.score; tx.q = [{c: -1, y: TX.GATE - 1}]; for (let i = 0; i < 5; i++) txUpdate(); const bomb = tx.score === s0 + 5 && tx.lives === 2;
  console.assert(good && bad && bomb, 'triexpress', {good, bad, bomb});
  if (realBest === undefined) delete games.best.triexpress; else games.best.triexpress = realBest; Object.assign(txs, realStats);
  tx = keep;
}
ctx.onOpen(() => {
  if (!tx || !tx.g) { txNew(); tx.g = $('txCanvas').getContext('2d'); }
  gameLoop(tx, 'triexpress', txUpdate, txDraw); txInfo();
});
}
