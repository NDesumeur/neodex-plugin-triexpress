// lancé par le test « local » de NeoDex : une journée commence, une bombe en tête de file est jetée avec ↑ (elle ne bloque plus le jeu),
// un colis double part en deux fois, puis le plein écran et la place prise par le jeu (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('txCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'triexpress-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const X = js => pj(`(() => { const X = document.getElementById('txCanvas').__tx, t = X.st(); ${js} })()`);
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await sleep(600); await key(' '); await sleep(300);
  if (await X(`return t.mode;`) !== 'play') throw new Error('la journée devait commencer');
  // une bombe en tête, un colis derrière : ↑ la jette, le colis devient le premier
  const r = await X(`t.spawn = 1e9; t.q = [{c: -1, y: 60}, {c: 1, y: 36, k: 'double', n: 2}, {c: 0, y: 12, k: 'fragile'}]; return 0;`);
  await sleep(200); await shot('1-bombe');
  await key('ArrowUp'); await sleep(100);
  const after = await X(`return t.q.length + ',' + t.q[0].c + ',' + t.bombs;`);
  if (after !== '2,1,1') throw new Error('la bombe devait partir avec ↑ : ' + after);
  await sleep(1000); await shot('2-double');
  const b = await X(`return t.bins.indexOf(1);`), k = ['ArrowLeft', 'ArrowDown', 'ArrowRight'][b];
  await key(k); await sleep(80);
  const d1 = await X(`return t.q.length + ',' + t.q[0].n;`); if (d1 !== '2,1') throw new Error('le colis double devait rester une fois : ' + d1);
  await key(k); await sleep(900);
  const d2 = await X(`return t.q.length + ',' + t.sorted + ',' + t.lives;`); if (d2 !== '1,2,3') throw new Error('le colis double devait partir en deux fois : ' + d2);
  await shot('3-fragile');
  await pj(`document.getElementById('txFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('txCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l’écran');
  const L = await pj(`(() => { const r = document.getElementById('txCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('txCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  return 'bombe jetée avec ↑ · colis double en deux fois · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
