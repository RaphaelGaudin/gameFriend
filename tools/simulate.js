// Simule des milliers de parties aléatoires pour vérifier l'arbre narratif.
// Usage : node tools/simulate.js [nombre]
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..');
const ctx = { STORY: {}, ENDINGS: {}, CHAPTERS: [], console };
vm.createContext(ctx);
for (const f of ['ch01-03', 'ch04-06', 'ch07-08', 'ch09-10', 'endings'])
  vm.runInContext(fs.readFileSync(path.join(root, 'story', f + '.js'), 'utf8'), ctx);
const { STORY, ENDINGS } = ctx;
const STATK = ['aff', 'conf', 'fz', 'jal', 'sam', 'nora'];
const CONTACTS = ['ines','sam','lea','max','nora','maman','papa','vasseur','groupe','anniv'];
let errors = 0;
const err = m => { errors++; if (errors < 40) console.error('ERREUR', m); };

// --- vérification statique ---
const visited = new Set();
function walk(steps, where) {
  steps.forEach(s => {
    if (typeof s === 'string') {
      if (!/^(~ |> |# |@ )/.test(s)) {
        const m = s.match(/^([a-z]+)(?:@([a-z]+))?: /);
        if (!m || !CONTACTS.includes(m[1])) err(`ligne non reconnue dans ${where}: ${s.slice(0, 50)}`);
      }
      return;
    }
    const gos = [s.go, s.ego];
    if (s.c) s.c.forEach(o => { gos.push(o.go, o.ego); if (o.then) walk(o.then, where); if (o.erase) walk(o.erase, where); });
    if (s.then) walk(s.then, where); if (s.else) walk(s.else, where);
    gos.filter(Boolean).forEach(g => { if (!STORY[g]) err(`go vers nœud inconnu "${g}" dans ${where}`); visited.add(g); });
    if (s.end && !ENDINGS[s.end]) err(`fin inconnue ${s.end}`);
  });
}
for (const k in STORY) walk(STORY[k], k);
for (const k in STORY) if (k !== 'c1' && !visited.has(k)) err(`nœud jamais référencé : ${k}`);

// --- simulation ---
function clamp(v) { return Math.max(0, Math.min(10, v)); }
function sim(rng) {
  const v = { aff: 3, conf: 4, fz: 2, jal: 0, sam: 4, nora: 0 };
  const fx = f => { if (f) for (const k in f) v[k] = STATK.includes(k) ? clamp((v[k] || 0) + f[k]) : f[k]; };
  const set = s => { if (!s) return; if (typeof s === 'string') v[s] = true; else Object.assign(v, s); };
  let msgs = 0, choices = 0, nodes = [];
  function run(steps) {
    for (const s0 of steps) {
      if (typeof s0 === 'string') { msgs++; continue; }
      const s = s0;
      fx(s.fx); set(s.set);
      if (s.go) return { jump: s.go };
      if (s.end) return { end: s.end };
      if (s.if) { const br = s.if(v) ? s.then : s.else; if (br) { const r = run(br); if (r) return r; } continue; }
      if (s.m || s.me || s.nar) msgs++;
      if (s.c) {
        choices++;
        const opts = s.c.filter(o => !o.req || o.req(v));
        if (!opts.length) { err('aucune option disponible'); continue; }
        let o;
        if (STRAT && rng() < .85) {
          const sc = x => { const f = x.fx || {}; let t = 0; for (const k in STRAT) t += (f[k] || 0) * STRAT[k]; if (x.go && STRAT.go && STRAT.go[x.go] !== undefined) t += STRAT.go[x.go]; return t + rng() * .01; };
          o = opts.slice().sort((a, b) => sc(b) - sc(a))[0];
        } else o = opts[Math.floor(rng() * opts.length)];
        if (o.draft && rng() < .4) {
          fx(o.efx); set(o.eset);
          if (o.erase) { const r = run(o.erase); if (r) return r; }
          if (o.ego) return { jump: o.ego };
          continue;
        }
        fx(o.fx); set(o.set);
        if (o.then) { const r = run(o.then); if (r) return r; }
        if (o.go) return { jump: o.go };
      }
    }
    return null;
  }
  let n = 'c1', guard = 0;
  while (guard++ < 500) {
    nodes.push(n);
    const r = run(STORY[n]);
    if (!r) { err(`nœud ${n} terminé sans suite`); return null; }
    if (r.end) return { end: r.end, msgs, choices, v, nodes };
    n = r.jump;
  }
  err('boucle infinie'); return null;
}
const N = +process.argv[2] || 20000;
const STRATS = { romantic: { aff: 2, conf: 1.5, fz: -1, jal: -3 }, doormat: { fz: 3, aff: -0.5, jal: -3, conf: 0.5 }, jealous: { jal: 3 }, absent: { conf: -3, jal: -1.5 }, nora: { nora: 3, jal: -2, conf: .5 } };
let STRAT = STRATS[process.argv[3]] || null;
let seed = 7; const rng = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const count = {}; let tm = 0, tc = 0, ok = 0;
const nodeHits = {};
for (let i = 0; i < N; i++) {
  const r = sim(rng); if (!r) continue;
  ok++; count[r.end] = (count[r.end] || 0) + 1; tm += r.msgs; tc += r.choices;
  r.nodes.forEach(n => nodeHits[n] = 1);
}
console.log(`${ok}/${N} parties terminées · ${errors} erreurs`);
console.log('Lignes moyennes par partie :', Math.round(tm / ok), '· choix moyens :', Math.round(tc / ok));
Object.keys(ENDINGS).forEach(e => console.log(e, ENDINGS[e].title.padEnd(16), ((count[e] || 0) / ok * 100).toFixed(1) + '%'));
const never = Object.keys(STORY).filter(k => !nodeHits[k]);
if (never.length) console.log('Nœuds jamais atteints :', never.join(', '));
let total = 0; for (const k in STORY) { const c = JSON.stringify(STORY[k], (kk, vv) => typeof vv === 'function' ? 'fn' : vv); total += c.length; }
process.exit(errors ? 1 : 0);
