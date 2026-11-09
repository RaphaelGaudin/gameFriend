'use strict';
/* =========================================================
   Moteur narratif : messagerie, appels, écran verrouillé,
   scènes "vraie vie", choix (minutés / brouillons), stats.
   ========================================================= */
const STORY = {};          // nœuds de l'histoire  { nom: [étapes] }
const ENDINGS = {};        // fins                 { id: {...} }
const CHAPTERS = [];       // liste des chapitres  [{n,node,title,sub}]

const CONTACTS = {
  ines:   { name: 'Inès',   color: '#ff6b8b', emoji: '🌙', photo: 'img/photos/ines.jpg', art: 'img/avatars/ines.svg' },
  sam:    { name: 'Sam',    color: '#3fb6f0', emoji: '🦝', photo: 'img/photos/sam.jpg', art: 'img/avatars/sam.svg' },
  lea:    { name: 'Léa',    color: '#ffb547', emoji: '🌻', photo: 'img/photos/lea.jpg', art: 'img/avatars/lea.svg' },
  max:    { name: 'Maxime', color: '#9d7bff', emoji: '🎧', photo: 'img/photos/max.jpg', art: 'img/avatars/max.svg' },
  nora:   { name: 'Nora',   color: '#62c98a', emoji: '🎞️', photo: 'img/photos/nora.jpg', art: 'img/avatars/nora.svg' },
  maman:  { name: 'Maman',  color: '#f08bb4', emoji: '🏡', photo: 'img/photos/maman.jpg', art: 'img/avatars/maman.svg' },
  papa:   { name: 'M. Moreau', color: '#b0a089', emoji: '🧔', photo: 'img/photos/papa.jpg', art: 'img/avatars/papa.svg' },
  vasseur:{ name: 'M. Vasseur', color: '#8f9bb3', emoji: '🎓', photo: 'img/photos/vasseur.jpg', art: 'img/avatars/vasseur.svg' },
  groupe: { name: 'Crémaillère 🏠', color: '#5b5470', emoji: '🏠', group: true },
  anniv:  { name: 'Anniv Inès 🎂', color: '#5b5470', emoji: '🎂', group: true },
  me:     { name: 'Moi', color: '#7c6cff', emoji: '🙂' },
};

const STATS = {
  aff:  { label: 'Complicité', desc: "Ce qu'il y a entre Inès et toi", color: '#ff5d8f' },
  conf: { label: 'Confiance',  desc: "Est-ce qu'elle peut compter sur toi ?", color: '#5dd6ff' },
  fz:   { label: 'Friendzone', desc: "Plus c'est haut, plus tu es « juste un pote »", color: '#ffb547' },
  jal:  { label: 'Jalousie',   desc: 'Ce qui te ronge (et ce qu’elle remarque)', color: '#ff6b5d' },
  sam:  { label: 'Sam',        desc: 'Ton coloc, ton frère', color: '#3fb6f0' },
  nora: { label: 'Nora',       desc: '???', color: '#62c98a' },
};
const STAT_KEYS = Object.keys(STATS);

const SPEEDS = { lent: 1.5, normal: 1, rapide: .55, instant: .04 };
const SAVE_KEY = 'lu2312_save', META_KEY = 'lu2312_meta';

const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const G = {
  st: null, node: null, mode: 'chat', ff: false, auto: false, advance: null,
  meta: null, running: false, runId: 0, narOpen: false, rng: Math.random,
};

/* ---------------- META / SAUVEGARDES ---------------- */
function loadMeta() {
  let m = null;
  try { m = JSON.parse(localStorage.getItem(META_KEY)); } catch (e) {}
  m = m || {};
  m.endings = m.endings || {};
  m.chapters = m.chapters || {};
  m.settings = Object.assign({ music: .6, sfx: .8, speed: 'normal' }, m.settings || {});
  G.meta = m;
  return m;
}
function saveMeta() { try { localStorage.setItem(META_KEY, JSON.stringify(G.meta)); } catch (e) {} }
function saveGame() {
  const snap = JSON.stringify({ node: G.node, st: G.st });
  try { localStorage.setItem(SAVE_KEY, snap); } catch (e) {}
  return snap;
}
function loadSave() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { return null; } }

function newState(name) {
  return {
    name: name || 'Hugo',
    v: { aff: 3, conf: 4, fz: 2, jal: 0, sam: 4, nora: 0 },
    convos: {}, unread: {}, lastDay: {},
    current: 'ines', time: '23:12', day: '', chapter: 0, decisions: [],
  };
}

/* ---------------- OUTILS ---------------- */
const speedK = () => G.auto ? 0 : (SPEEDS[G.meta.settings.speed] || 1) * (G.ff ? .08 : 1);
const sleepRaw = ms => new Promise(r => setTimeout(r, ms));
function sleep(ms) { const k = speedK(); return sleepRaw(Math.max(0, ms * k)); }
function fmt(t) { return String(t ?? '').replace(/\{nom\}/g, G.st ? G.st.name : 'Hugo'); }
function sfx(n) { if (!G.auto) SND.play(n); }

function guard(id) { if (id !== G.runId) throw new Error('__abort__'); }

function waitAdvance() {
  if (G.auto) return Promise.resolve();
  if (G.ff) return sleepRaw(140);
  return new Promise(res => { G.advance = () => { G.advance = null; res(); }; });
}
function doAdvance() { if (G.advance) { sfx('tap'); G.advance(); } }

async function typeText(node, text) {
  const k = speedK();
  if (k < .2) { node.textContent = text; return; }
  node.textContent = '';
  let skip = false;
  G.advance = () => { skip = true; };
  const step = 16 * k;
  for (let i = 1; i <= text.length; i++) {
    if (skip) break;
    node.textContent = text.slice(0, i);
    if (i % 2 === 0 || step > 20) await sleepRaw(step * 1.5);
  }
  node.textContent = text;
  G.advance = null;
}

function parseStep(s) {
  if (typeof s !== 'string') return s;
  if (s.startsWith('~ ')) return { nar: s.slice(2) };
  if (s.startsWith('> ')) return { me: s.slice(2) };
  if (s.startsWith('# ')) return { sys: s.slice(2) };
  if (s.startsWith('@ ')) return { time: s.slice(2) };
  const m = s.match(/^([a-z]+)(?:@([a-z]+))?: ([\s\S]*)$/);
  if (m && CONTACTS[m[1]]) return { m: m[1], in: m[2], t: m[3] };
  return { nar: s };
}

function V() { return G.st.v; }
function applyFx(fx) {
  if (!fx) return;
  for (const k in fx) {
    if (STAT_KEYS.includes(k)) G.st.v[k] = clamp((G.st.v[k] || 0) + fx[k], 0, 10);
    else G.st.v[k] = fx[k];
  }
  updateRel();
}
function applySet(set) {
  if (!set) return;
  if (typeof set === 'string') G.st.v[set] = true;
  else Object.assign(G.st.v, set);
}

/* ---------------- RELATION ---------------- */
function relLabel() {
  const v = V();
  if (v.together) return 'Ensemble ❤';
  if (v.jal >= 6) return 'Tendue ⚡';
  if (v.conf <= 1) return 'Distante';
  if (v.fz >= 8) return 'Zone ami 🚧';
  if (v.aff >= 8 && v.fz <= 5) return 'Ambiguë 👀';
  if (v.aff >= 6) return 'Très proche';
  if (v.fz >= 6) return 'Meilleur pote';
  if (v.aff <= 2) return 'Un peu froide';
  return 'Amie d’enfance';
}
let lastRel = '';
function updateRel() {
  const r = $('#head-rel');
  if (!G.st) return;
  if (G.st.current !== 'ines') { r.textContent = ''; return; }
  const l = relLabel();
  r.textContent = l;
  if (lastRel && l !== lastRel) { r.classList.remove('flash'); void r.offsetWidth; r.classList.add('flash'); }
  lastRel = l;
}

/* ---------------- RENDU MESSAGES ---------------- */
function avatarEl(id, cls = 'avatar') {
  const a = el('div', cls);
  setAvatar(a, id);
  return a;
}
function setAvatar(node, id) {
  const c = CONTACTS[id] || CONTACTS.me;
  node.style.background = c.color + '33'; node.style.border = `1.5px solid ${c.color}`;
  if (c.photo) {
    node.innerHTML = '';
    const img = new Image(); img.src = c.photo; img.alt = c.name; img.draggable = false;
    // photo absente → portrait illustré → emoji
    img.onerror = () => { if (c.art && img.src.indexOf(c.art) < 0) img.src = c.art; else node.textContent = c.emoji; };
    node.appendChild(img);
  } else node.textContent = c.emoji;
}
/* Les messages reçus sont accompagnés de la photo de l'expéditeur (sur le dernier d'une série). */
function rowEl(msgNode, msg) {
  if (msg.who === 'me' || msg.who === 'sys') return msgNode;
  const row = el('div', 'row');
  row.dataset.who = msg.who;
  row.appendChild(avatarEl(msg.who, 'avatar mini'));
  row.appendChild(msgNode);
  return row;
}
function hidePrevMini(container, who) {
  const last = container.lastElementChild;
  if (last && last.classList.contains('row') && last.dataset.who === who) last.querySelector('.mini').style.visibility = 'hidden';
}
const onlyEmoji = t => /^(\p{Extended_Pictographic}|‍|️|\s){1,10}$/u.test(t);

function msgEl(msg, convId) {
  if (msg.who === 'sys') {
    return el('div', 'msg sys' + (msg.cls ? ' ' + msg.cls : ''), esc(msg.t));
  }
  const mine = msg.who === 'me';
  const d = el('div', 'msg ' + (mine ? 'me' : 'them'));
  const conv = CONTACTS[convId];
  if (!mine && conv && conv.group) {
    const c = CONTACTS[msg.who];
    d.appendChild(el('div', 'who', esc(c.name))).style.color = c.color;
  }
  if (msg.img) {
    const p = el('div', 'photo' + (msg.img.tall ? ' tall' : '')); p.style.background = msg.img.bg || 'linear-gradient(135deg,#444,#222)';
    p.appendChild(document.createTextNode(msg.img.e || '📷'));
    if (msg.img.src) {
      // vraie photo (img/scenes/…) ; si le fichier manque, on garde l'emoji
      const im = new Image(); im.alt = ''; im.draggable = false;
      im.onload = () => { p.textContent = ''; p.classList.add('real'); p.appendChild(im); if (p.closest('#thread')) scrollBottom(); };
      im.src = msg.img.src;
    }
    d.appendChild(p);
    if (msg.t) d.appendChild(el('div', 'photo-cap', esc(msg.t)));
    d.style.padding = '6px 6px 9px';
  } else if (msg.voice) {
    const v = el('div', 'voice');
    v.appendChild(el('button', 'play', '▶'));
    const w = el('div', 'wave');
    let seed = msg.t.length;
    for (let i = 0; i < 26; i++) { seed = (seed * 9301 + 49297) % 233280; const b = el('b'); b.style.height = (20 + (seed / 233280) * 80) + '%'; w.appendChild(b); }
    v.appendChild(w); v.appendChild(el('span', 'dur', esc(msg.voice)));
    d.appendChild(v);
    const tr = el('div', 'voice-tr', '« ' + esc(msg.t) + ' »');
    d.appendChild(tr);
    v.querySelector('.play').onclick = (e) => { e.stopPropagation(); SND.play('voice'); };
  } else {
    d.innerHTML += esc(msg.t);
    if (onlyEmoji(msg.t)) d.classList.add('big');
  }
  return d;
}

function renderThread(container, convId, live) {
  container.innerHTML = '';
  const msgs = G.st.convos[convId] || [];
  let prev = null;
  msgs.forEach((m, i) => {
    if (prev && prev.who !== m.who && m.who !== 'sys') container.appendChild(el('div', 'msg-gap'));
    else if (prev) hidePrevMini(container, m.who);
    container.appendChild(rowEl(msgEl(m, convId), m));
    prev = m;
  });
  if (live) renderReceipt();
  container.scrollTop = container.scrollHeight;
}

function renderReceipt() {
  const th = $('#thread');
  th.querySelectorAll('.receipt').forEach(r => r.remove());
  const msgs = G.st.convos[G.st.current] || [];
  const last = msgs[msgs.length - 1];
  if (last && last.who === 'me' && last.rc && !(CONTACTS[G.st.current] || {}).group) {
    th.appendChild(el('div', 'receipt', esc(last.rc)));
  }
}

// Toujours coller en bas du fil, immédiatement, puis une seconde fois après le rendu (images, polices)
function scrollBottom() {
  const th = $('#thread');
  th.scrollTop = th.scrollHeight;
  requestAnimationFrame(() => { th.scrollTop = th.scrollHeight; });
}

function pushMsg(convId, msg) {
  const c = G.st.convos[convId] = G.st.convos[convId] || [];
  if (G.st.day && G.st.lastDay[convId] !== G.st.day) {
    G.st.lastDay[convId] = G.st.day;
    const dm = { who: 'sys', t: G.st.day, cls: 'date' };
    c.push(dm);
    if (convId === G.st.current && G.mode !== 'lock') { $('#thread').appendChild(msgEl(dm, convId)); }
  }
  if (msg.who !== 'me') {
    // l'autre a forcément lu nos messages
    for (let i = c.length - 1; i >= 0; i--) { if (c[i].who === 'me') { if (c[i].rc && !c[i].rc.startsWith('Vu')) c[i].rc = 'Vu à ' + G.st.time; break; } }
  }
  c.push(msg);
  return msg;
}

function appendLive(convId, msg) {
  const th = $('#thread');
  const msgs = G.st.convos[convId];
  const prev = msgs[msgs.length - 2];
  if (prev && prev.who !== msg.who && msg.who !== 'sys' && prev.cls !== 'date') th.appendChild(el('div', 'msg-gap'));
  else hidePrevMini(th, msg.who);
  th.appendChild(rowEl(msgEl(msg, convId), msg));
  if (msg.who !== 'sys') markShown(msg.img ? 30 : msg.who === 'me' ? Math.round((msg.t || '').length / 2) : (msg.t || '').length);
  renderReceipt();
  scrollBottom();
}

function updateHeader() {
  const id = G.st.current, c = CONTACTS[id];
  setAvatar($('#head-avatar'), id);
  $('#head-name').textContent = c.name;
  $('#head-status').textContent = c.group ? 'Groupe' : 'en ligne';
  $('#head-status').className = '';
  updateRel();
  updateUnread();
}
function updateUnread() {
  let n = 0; for (const k in G.st.unread) if (k !== G.st.current) n += G.st.unread[k] || 0;
  $('#unread-total').textContent = n ? n : '';
}

function showBanner(id, text) {
  const b = $('#banner');
  b.innerHTML = '';
  const c = CONTACTS[id];
  b.appendChild(avatarEl(id));
  const body = el('div'); body.appendChild(el('div', 'b-name', esc(c.name))); body.appendChild(el('div', 'b-text', esc(text)));
  b.appendChild(body);
  b.classList.remove('hidden'); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
  clearTimeout(showBanner.t);
  showBanner.t = setTimeout(() => b.classList.add('hidden'), 2600);
}

function setClock(t) {
  G.st.time = t;
  $('#clock').textContent = t; $('#lock-time').textContent = t;
}

function toast(t, ms = 2800) {
  if (G.auto) return;
  const n = $('#toast'); n.textContent = t; n.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => n.classList.remove('show'), ms);
}

/* ---------------- MODES ---------------- */
function setMode(m) {
  G.mode = m;
  $('#game').dataset.mode = m;
  $('#chatview').classList.toggle('hidden', !(m === 'chat'));
  $('#lockview').classList.toggle('hidden', m !== 'lock');
  $('#callview').classList.toggle('hidden', m !== 'call');
  $('#scene').classList.toggle('hidden', m !== 'scene');
  if (m !== 'call') SND.ring(false);
}
function closeNar() {
  if (!G.narOpen) return;
  G.narOpen = false;
  $('#nar').classList.add('hidden');
}

function openConv(id) {
  G.st.current = id;
  G.st.unread[id] = 0;
  updateHeader();
  renderThread($('#thread'), id, true);
  scrollBottom();
  const th = $('#thread');
  th.style.animation = 'none'; void th.offsetWidth; th.style.animation = 'fadein .35s both';
}

/* ---------------- CHOIX ---------------- */
function choiceContainer() { return G.mode === 'scene' ? $('#scene-choices') : $('#choices'); }
const isAct = o => (o.act ?? /^\[/.test(o.t));

/* Les choix recouvrent le bas du fil : on réserve la place et on remonte les derniers messages. */
function reserveThread(box) {
  if (G.mode !== 'chat') return;
  requestAnimationFrame(() => {
    const th = $('#thread');
    const overlap = th.getBoundingClientRect().bottom - box.getBoundingClientRect().top;
    th.style.paddingBottom = (12 + Math.max(0, overlap)) + 'px';
    th.scrollTop = th.scrollHeight;
  });
}
function releaseThread() { $('#thread').style.paddingBottom = ''; }

function showChoices(step) {
  return new Promise(resolve => {
    const opts = step.c.filter(o => !o.req || o.req(V()));
    const box = choiceContainer();
    box.innerHTML = '';
    if (step.prompt) box.appendChild(el('div', 'choice-prompt', esc(fmt(step.prompt))));
    let done = false, timerId = null, beatId = null;
    const finish = (o) => {
      if (done) return; done = true;
      clearTimeout(timerId); clearInterval(beatId);
      document.removeEventListener('keydown', keyH);
      box.innerHTML = '';
      releaseThread();
      $('#callview').classList.remove('choosing');
      if (G.mode === 'scene') $('#dialog').classList.remove('lifted');
      sfx('choice');
      resolve(o);
    };
    const keyH = e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= opts.length) finish(opts[n - 1]); };
    if (step.timer) {
      const tb = el('div', 'timerbar'); const bar = el('i'); tb.appendChild(bar); box.appendChild(tb);
      const dur = step.timer * 1000 * (G.ff ? 1 : 1);
      bar.style.transition = `transform ${dur}ms linear`;
      requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transform = 'scaleX(0)'; }));
      sfx('heart');
      beatId = setInterval(() => sfx('heart'), 900);
      const def = opts.find(o => o.timeout) || opts[opts.length - 1];
      timerId = setTimeout(() => finish(def), G.auto ? 0 : dur);
    }
    opts.forEach((o, i) => {
      const b = el('button', 'choice' + (isAct(o) ? ' act' : '') + (o.draft ? ' draft' : ''));
      b.innerHTML = `<span class="k">${i + 1}</span>` + esc(fmt(o.t).replace(/^\[|\]$/g, ''));
      b.style.animationDelay = (i * .06) + 's';
      b.onclick = () => finish(o);
      box.appendChild(b);
    });
    document.addEventListener('keydown', keyH);
    if (G.mode === 'call') $('#callview').classList.add('choosing');
    reserveThread(box);
    if (G.mode === 'scene') {
      requestAnimationFrame(() => {
        $('#dialog').style.setProperty('--lift', (box.offsetHeight + 10) + 'px');
        $('#dialog').classList.add('lifted');
      });
    }
    if (G.auto && !step.timer) setTimeout(() => finish(opts[Math.floor(G.rng() * opts.length)]), 0);
  });
}

function draftButtons(timer) {
  return new Promise(resolve => {
    const box = $('#choices');
    box.innerHTML = '';
    box.classList.add('drafting');
    let done = false, tid = null;
    const finish = v => { if (done) return; done = true; clearTimeout(tid); box.innerHTML = ''; box.classList.remove('drafting'); releaseThread(); resolve(v); };
    if (timer) {
      const tb = el('div', 'timerbar'); const bar = el('i'); tb.appendChild(bar); box.appendChild(tb);
      bar.style.transition = `transform ${timer * 1000}ms linear`;
      requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transform = 'scaleX(0)'; }));
      tid = setTimeout(() => finish(false), G.auto ? 0 : timer * 1000);
    }
    const row = el('div', 'draft-row');
    const er = el('button', 'erase', '⌫ Effacer'); const se = el('button', 'send', 'Envoyer ➤');
    er.onclick = () => finish(false); se.onclick = () => finish(true);
    row.appendChild(er); row.appendChild(se); box.appendChild(row);
    reserveThread(box);
    if (G.auto) setTimeout(() => finish(G.rng() < .5), 0);
  });
}

/* ---------------- SAISIE "MOI" ---------------- */
async function typeInInput(text) {
  const it = $('#inputtext'), sb = $('#sendbtn');
  it.classList.remove('ph');
  const k = speedK();
  if (k < .15) { it.textContent = text; }
  else {
    const per = Math.min(45, 2400 / Math.max(1, text.length)) * k;
    for (let i = 1; i <= text.length; i++) {
      it.innerHTML = esc(text.slice(0, i)) + '<span class="caret"></span>';
      if (i % 2 === 0) sfx('key');
      await sleepRaw(per);
    }
  }
  sb.classList.add('ready');
}
function clearInput() { const it = $('#inputtext'); it.textContent = 'Message'; it.classList.add('ph'); $('#sendbtn').classList.remove('ready'); }

async function eraseInput() {
  const it = $('#inputtext'); const t = it.textContent;
  sfx('erase');
  const k = speedK();
  if (k >= .15) for (let i = t.length; i >= 0; i -= 3) { it.textContent = t.slice(0, i); await sleepRaw(12 * k); }
  clearInput();
}

async function sendMe(text) {
  const conv = G.st.current;
  const msg = pushMsg(conv, { who: 'me', t: text, rc: 'Distribué' });
  clearInput();
  sfx('send');
  appendLive(conv, msg);
  await sleep(700);
}

/* ---------------- EXÉCUTION ---------------- */
async function runSteps(steps, id) {
  for (let i = 0; i < steps.length; i++) {
    guard(id);
    const r = await exec(parseStep(steps[i]), id);
    if (r && (r.jump || r.stop)) return r;
  }
  return null;
}

async function play(node, id) {
  let n = node;
  while (n) {
    if (!STORY[n]) { console.error('Nœud introuvable :', n); return; }
    G.node = n;
    const r = await runSteps(STORY[n], id);
    if (!r) { console.warn('Nœud terminé sans suite :', n); return; }
    if (r.stop) return;
    n = r.jump;
  }
}

const MAIN = ['go','if','ch','recap','end','open','lock','unlock','call','pickup','hangup','missed','scene','endscene','seen','typing','sys','m','me','c'];
/* Pause de lecture : avant une transition (autre conversation, scène, narration, fin de chapitre…),
   on laisse le temps de lire le dernier message affiché, selon sa longueur. */
function markShown(len) { G.lastShown = { at: performance.now(), len: len || 0 }; }
async function readPause(s) {
  if (!G.lastShown || G.auto) return;
  const isTransition = (s.open && s.open !== G.st.current) || s.scene || s.ch || s.recap || s.lock || s.call || s.end
    || (s.unlock && G.mode !== 'lock') || ('nar' in s && !G.narOpen && (G.mode === 'chat' || G.mode === 'lock'));
  if (!isTransition) return;
  const need = clamp(1300 + G.lastShown.len * 45, 1600, 5000) * speedK();
  const elapsed = performance.now() - G.lastShown.at;
  G.lastShown = null;
  if (need > elapsed) await sleepRaw(need - elapsed);
}

async function exec(s, id) {
  await readPause(s);
  guard(id);
  if (G.narOpen && MAIN.some(k => k in s) && !('nar' in s)) closeNar();

  // ---- effets de bord (combinables avec une étape principale) ----
  applyFx(s.fx); applySet(s.set);
  if (s.log) G.st.decisions.push(fmt(s.log));
  if (s.mem) { toast('🧠 ' + fmt(s.mem)); sfx('mem'); }
  if ('music' in s && !G.auto) SND.music(s.music);
  if ('amb' in s && !G.auto) SND.ambience(s.amb);
  if ('muffle' in s && !G.auto) SND.muffle(s.muffle);
  if (s.sfx) sfx(s.sfx);
  if (s.time) setClock(s.time);
  if (s.day) { G.st.day = s.day; $('#lock-date').textContent = s.day; }

  // ---- logique ----
  if (s.go) return { jump: s.go };
  if (s.if) {
    const ok = s.if(V());
    const br = ok ? s.then : s.else;
    if (br) return await runSteps(br, id);
    return null;
  }
  if (s.wait) { await sleep(s.wait); return null; }

  // ---- narration ----
  if ('nar' in s) {
    const text = fmt(s.nar);
    if (G.mode === 'scene') {
      $('#speaker').textContent = '';
      showPortrait(null);
      const ln = $('#line'); ln.className = 'narr';
      await typeText(ln, text);
      await waitAdvance();
      return null;
    }
    const box = $('#nar-text');
    if (!G.narOpen) { box.innerHTML = ''; $('#nar').classList.remove('hidden'); G.narOpen = true; }
    box.querySelectorAll('p').forEach(p => p.classList.add('old'));
    const ps = box.querySelectorAll('p'); if (ps.length >= 3) ps[0].remove();
    const p = el('p'); box.appendChild(p);
    await typeText(p, text);
    await waitAdvance();
    return null;
  }

  // ---- chapitre ----
  if (s.ch) {
    closeNar();
    G.st.chapter = s.ch; G.st.decisions = [];
    $('#tb-chapter').textContent = `Chapitre ${s.ch} · ${s.title}`;
    G.meta.chapters[s.ch] = saveGame();
    G.meta.maxChapter = Math.max(G.meta.maxChapter || 0, s.ch);
    saveMeta();
    if (!G.auto) {
      $('#cc-num').textContent = s.ch === 11 ? 'Épilogue' : `Chapitre ${s.ch}`;
      $('#cc-title').textContent = s.title; $('#cc-sub').textContent = s.sub || '';
      const cc = $('#chapcard'); cc.classList.remove('hidden');
      cc.querySelectorAll('*').forEach(n => { n.style.animation = 'none'; void n.offsetWidth; n.style.animation = ''; });
      SND.music(null); SND.ambience(null);
      sfx('chapter');
      await sleepRaw(G.ff ? 300 : 1400);
      await waitAdvance();
      cc.classList.add('hidden');
    }
    return null;
  }

  if (s.recap) {
    if (G.auto) return null;
    $('#recap-title').textContent = `Fin du chapitre ${G.st.chapter}`;
    const ul = $('#recap-list'); ul.innerHTML = '';
    if (!G.st.decisions.length) ul.appendChild(el('li', 'none', 'Tu as laissé les choses suivre leur cours.'));
    G.st.decisions.forEach((d, i) => { const li = el('li', '', esc(d)); li.style.animationDelay = (i * .15) + 's'; ul.appendChild(li); });
    $('#recap-rel').innerHTML = `Inès &amp; toi : <b>${esc(relLabel())}</b>`;
    $('#recap').classList.remove('hidden');
    sfx('mem');
    await new Promise(r => { $('#recap-go').onclick = () => { sfx('choice'); r(); }; });
    $('#recap').classList.add('hidden');
    return null;
  }

  if (s.end) { await showEnding(s.end); return { stop: true }; }

  // ---- changements de vue ----
  if (s.open) {
    $('#banner').classList.add('hidden');
    setMode('chat'); openConv(s.open); await sleep(400); return null;
  }
  if (s.lock) {
    setMode('lock'); $('#notifs').innerHTML = ''; await sleep(500); return null;
  }
  if (s.unlock) {
    sfx('tap'); setMode('chat'); openConv(s.unlock); await sleep(300); return null;
  }
  if (s.call) {
    setMode('call');
    const cv = $('#callview'); cv.className = 'view ' + (s.out ? 'outgoing' : 'ringing');
    setAvatar($('#call-avatar'), s.call);
    $('#call-name').textContent = CONTACTS[s.call].name;
    $('#call-state').textContent = s.out ? 'Appel en cours…' : 'Appel entrant…';
    $('#callsubs').innerHTML = '';
    G.callWith = s.call; G.callStart = Date.now();
    if (!G.auto) { if (s.out) sfx('voice'); else SND.ring(true); }
    await sleep(s.out ? 2200 : 900);
    return null;
  }
  if (s.pickup) {
    SND.ring(false);
    const cv = $('#callview'); cv.className = 'view live';
    $('#call-state').textContent = s.pickup === true ? 'En ligne' : s.pickup;
    await sleep(500);
    return null;
  }
  if (s.hangup) {
    SND.ring(false); sfx('hangup');
    $('#call-state').textContent = 'Appel terminé';
    $('#callview').className = 'view';
    await sleep(900);
    const conv = G.callWith || G.st.current;
    pushMsg(conv, { who: 'sys', t: `📞 Appel vocal · ${s.hangup === true ? 'terminé' : s.hangup}` });
    setMode('chat'); openConv(conv);
    return null;
  }
  if (s.missed) {
    SND.ring(false);
    const conv = s.missed;
    pushMsg(conv, { who: 'sys', t: `📞 Appel manqué · ${G.st.time}`, cls: 'alert' });
    if (G.mode === 'lock' || G.mode === 'call') {
      setMode('lock');
      addNotif(conv, 'Appel manqué', true);
    }
    G.st.unread[conv] = (G.st.unread[conv] || 0) + 1;
    await sleep(800);
    return null;
  }
  if (s.scene) {
    setMode('scene');
    const bg = $('#scene-bg'); bg.className = 'bg-' + s.scene;
    $('#scene-loc').textContent = s.loc || '';
    $('#scene-loc').style.display = s.loc ? '' : 'none';
    $('#speaker').textContent = ''; $('#line').textContent = ''; $('#line').className = '';
    showPortrait(null); $('#portrait').dataset.who = '';
    particles(s.fx2 || s.particles);
    $('#scene').style.animation = 'none'; void $('#scene').offsetWidth; $('#scene').style.animation = '';
    await sleep(900);
    return null;
  }
  if (s.endscene) {
    setMode('chat'); particles(null); openConv(s.endscene === true ? G.st.current : s.endscene); await sleep(300); return null;
  }
  if (s.seen) {
    const c = G.st.convos[s.seen] || [];
    for (let i = c.length - 1; i >= 0; i--) if (c[i].who === 'me') { c[i].rc = 'Vu à ' + G.st.time; break; }
    if (G.st.current === s.seen) renderReceipt();
    await sleep(600);
    return null;
  }
  if (s.typing) {
    // "… est en train d'écrire" puis rien
    if (G.mode === 'chat' && G.st.current === s.typing) {
      const tb = showTyping(s.typing);
      await sleep(s.ms || 2500);
      hideTyping(tb);
      await sleep(s.after || 900);
    }
    return null;
  }

  // ---- messages ----
  if (s.sys) {
    const conv = s.in || G.st.current;
    const msg = pushMsg(conv, { who: 'sys', t: fmt(s.sys), cls: s.cls });
    if (conv === G.st.current && G.mode === 'chat') appendLive(conv, msg);
    await sleep(500);
    return null;
  }
  if (s.m) return await execMsg(s, id);
  if (s.me) return await execMe(fmt(s.me));
  if (s.c) return await execChoice(s, id);

  return null;
}

function showTyping(who) {
  const th = $('#thread');
  const tb = el('div', 'row typing-row');
  tb.appendChild(avatarEl(who, 'avatar mini'));
  tb.appendChild(el('div', 'typing-bubble', '<i></i><i></i><i></i>'));
  th.appendChild(tb); scrollBottom();
  const hs = $('#head-status'); hs.textContent = 'écrit…'; hs.className = 'typing';
  return tb;
}
function hideTyping(tb) {
  if (tb) tb.remove();
  const hs = $('#head-status'); hs.textContent = 'en ligne'; hs.className = '';
}

function addNotif(conv, text, missed) {
  const n = el('div', 'notif' + (missed ? ' missed' : ''));
  n.appendChild(avatarEl(conv));
  const b = el('div'); b.style.flex = '1';
  b.innerHTML = `<div class="n-top">${esc(CONTACTS[conv].name)}<span>${esc(G.st.time)}</span></div><div class="n-text">${esc(text)}</div>`;
  n.appendChild(b);
  const box = $('#notifs'); box.appendChild(n);
  markShown(text.length);
  while (box.children.length > 5) box.firstChild.remove();
}

async function execMsg(s) {
  const who = s.m, conv = s.in || who, text = fmt(s.t || '');
  const msg = { who, t: text };
  if (s.img) msg.img = s.img;
  if (s.voice) msg.voice = s.voice;

  if (G.mode === 'scene') {
    const c = CONTACTS[who];
    const sp = $('#speaker'); sp.textContent = c.name; sp.style.color = c.color;
    showPortrait(who);
    const ln = $('#line'); ln.className = '';
    await typeText(ln, text);
    await waitAdvance();
    return null;
  }
  if (G.mode === 'call') {
    const subs = $('#callsubs');
    subs.querySelectorAll('.sub').forEach(x => x.classList.add('old'));
    while (subs.children.length > 3) subs.firstChild.remove();
    const c = CONTACTS[who];
    const d = el('div', 'sub', `<b style="color:${c.color}">${esc(c.name)}</b>`);
    const sp = el('span'); d.appendChild(sp); subs.appendChild(d);
    await typeText(sp, text);
    await waitAdvance();
    return null;
  }
  if (G.mode === 'lock') {
    pushMsg(conv, msg);
    G.st.unread[conv] = (G.st.unread[conv] || 0) + 1;
    sfx(CONTACTS[conv].group ? 'group' : 'vibrate');
    addNotif(conv, msg.img ? '📷 Photo' : msg.voice ? '🎤 Message vocal' : text);
    await sleep(1100 + text.length * 12);
    return null;
  }
  // mode chat
  if (conv !== G.st.current) {
    pushMsg(conv, msg);
    G.st.unread[conv] = (G.st.unread[conv] || 0) + 1;
    updateUnread();
    sfx(CONTACTS[conv].group ? 'group' : 'notif');
    showBanner(CONTACTS[conv].group ? who : conv, (CONTACTS[conv].group ? CONTACTS[who].name + ' : ' : '') + (msg.img ? '📷 Photo' : msg.voice ? '🎤 Message vocal' : text));
    await sleep(900);
    return null;
  }
  // Rythme naturel :
  // 1) l'autre lit / réfléchit avant de commencer à écrire (plus long s'il répond à un de nos messages),
  // 2) "écrit…" dure en fonction de la longueur du message (~13 caractères par seconde), avec un peu d'aléatoire,
  // 3) une pause après l'affichage, le temps que le joueur lise.
  const jitter = () => 0.85 + Math.random() * 0.3;
  const prevMsgs = G.st.convos[conv] || [];
  const prev = prevMsgs[prevMsgs.length - 1];
  const replying = prev && prev.who === 'me';
  const sameSender = prev && prev.who === who;
  let think = s.fast ? 150 : replying ? 900 + Math.min(1400, (prev.t || '').length * 18) : sameSender ? 350 : 650;
  let typeMs = s.fast ? 450 : clamp(700 + text.length * 75, 1100, 6500);
  if (msg.img) typeMs = s.fast ? 450 : 1600;
  if (msg.voice) typeMs = 2200 + text.length * 30;
  if (s.slow) typeMs += 1800;
  await sleep(think * jitter());
  const tb = showTyping(who);
  await sleep(typeMs * jitter());
  hideTyping(tb);
  pushMsg(conv, msg);
  sfx('receive');
  appendLive(conv, msg);
  await sleep(clamp(500 + text.length * 22, 700, 2600));
  return null;
}

function showPortrait(who) {
  const p = $('#portrait');
  if (!who || !CONTACTS[who] || !CONTACTS[who].photo) { p.classList.add('gone'); return; }
  const wasHidden = p.classList.contains('gone');
  if (p.dataset.who !== who) { setAvatar(p, who); p.dataset.who = who; }
  if (wasHidden || p.dataset.shown !== who) { p.style.animation = 'none'; void p.offsetWidth; p.style.animation = ''; }
  p.dataset.shown = who;
  p.style.setProperty('--pc', CONTACTS[who].color);
  p.classList.remove('gone');
}

async function execMe(text) {
  if (G.mode === 'scene') {
    showPortrait(null);
    const sp = $('#speaker'); sp.textContent = G.st.name; sp.style.color = '#a99cff';
    const ln = $('#line'); ln.className = 'me';
    await typeText(ln, text);
    await waitAdvance();
    return null;
  }
  if (G.mode === 'call') {
    const subs = $('#callsubs');
    subs.querySelectorAll('.sub').forEach(x => x.classList.add('old'));
    while (subs.children.length > 3) subs.firstChild.remove();
    const d = el('div', 'sub me', `<b>${esc(G.st.name)}</b>${esc(text)}`); subs.appendChild(d);
    await sleep(900 + text.length * 25);
    return null;
  }
  if (G.mode !== 'chat') { setMode('chat'); openConv(G.st.current); }
  await typeInInput(text);
  await sleep(200);
  await sendMe(text);
  return null;
}

async function execChoice(s, id) {
  const o = await showChoices(s);
  guard(id);
  const say = fmt(o.say || o.t);
  let sent = true;

  if (o.draft && G.mode === 'chat') {
    await typeInInput(say);
    const send = await draftButtons(o.dtimer);
    guard(id);
    if (!send) {
      await eraseInput();
      if (o.efx) applyFx(o.efx);
      if (o.eset) applySet(o.eset);
      if (o.emem) { toast('🧠 ' + fmt(o.emem)); sfx('mem'); }
      if (o.elog) G.st.decisions.push(fmt(o.elog));
      if (o.erase) { const r = await runSteps(o.erase, id); if (r) return r; }
      if (o.ego) return { jump: o.ego };
      return null;
    }
    await sendMe(say);
  } else if (!isAct(o) && !o.silent) {
    if (G.mode === 'chat') { await typeInInput(say); await sleep(150); await sendMe(say); }
    else if (G.mode === 'scene') {
      showPortrait(null);
      const sp = $('#speaker'); sp.textContent = G.st.name; sp.style.color = '#a99cff';
      const ln = $('#line'); ln.className = 'me'; ln.textContent = say;
      await sleep(700 + say.length * 22);
    } else if (G.mode === 'call') { await execMe(say); }
  } else sent = false;

  applyFx(o.fx); applySet(o.set);
  if (o.log) G.st.decisions.push(fmt(o.log));
  if (o.mem) { toast('🧠 ' + fmt(o.mem)); sfx('mem'); }
  if (o.then) { const r = await runSteps(o.then, id); if (r) return r; }
  if (o.go) return { jump: o.go };
  return null;
}

/* ---------------- PARTICULES ---------------- */
function particles(kind) {
  const box = $('#scene-particles'); box.innerHTML = '';
  if (!kind || G.auto) return;
  const n = kind === 'rain' ? 70 : kind === 'lights' ? 18 : 60;
  for (let i = 0; i < n; i++) {
    const p = el('div', 'p ' + kind);
    p.style.left = (Math.random() * 100) + '%';
    if (kind === 'snow') { const s = 2 + Math.random() * 4; p.style.width = p.style.height = s + 'px'; p.style.animationDuration = (6 + Math.random() * 8) + 's'; p.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px'); }
    if (kind === 'rain') { p.style.animationDuration = (.5 + Math.random() * .4) + 's'; p.style.setProperty('--dx', '-30px'); }
    if (kind === 'lights') { const s = 20 + Math.random() * 50; p.style.width = p.style.height = s + 'px'; p.style.bottom = (Math.random() * 70) + '%'; p.style.animationDuration = (3 + Math.random() * 4) + 's'; }
    p.style.animationDelay = (-Math.random() * 10) + 's';
    box.appendChild(p);
  }
}

/* ---------------- FIN ---------------- */
async function showEnding(idE) {
  const e = ENDINGS[idE];
  G.meta.endings[idE] = true; saveMeta();
  try { localStorage.removeItem(SAVE_KEY); } catch (er) {}
  G.lastEnding = idE;
  if (G.auto) return;
  closeNar(); setMode('chat');
  SND.ambience(null); SND.music('ending'); sfx('ending');
  $('#end-num').textContent = `${e.num} / ${Object.keys(ENDINGS).length}`;
  $('#end-title').textContent = e.title;
  const tx = $('#end-text'); tx.innerHTML = '';
  e.text.forEach((p, i) => { const pe = el('p', '', esc(fmt(p))); pe.style.animationDelay = (i * .8) + 's'; tx.appendChild(pe); });
  const v = V();
  $('#end-stats').innerHTML = STAT_KEYS.map(k => `<div>${STATS[k].label}<b>${v[k]}/10</b></div>`).join('');
  const got = Object.keys(G.meta.endings).length, tot = Object.keys(ENDINGS).length;
  $('#end-progress').textContent = `Fins débloquées : ${got} / ${tot}` + (got < tot ? ' — d’autres chemins existent.' : ' — tu as tout vu. Merci ❤');
  $('#endscreen').classList.remove('hidden');
}

/* ---------------- DÉMARRAGE D'UNE PARTIE ---------------- */
function startFrom(node, st) {
  G.runId++;
  const id = G.runId;
  G.st = st;
  G.lastShown = null;
  G.ff = false; $('#tb-ff').classList.remove('on'); $('#hb-ff').classList.remove('on');
  $('#endscreen').classList.add('hidden'); $('#recap').classList.add('hidden'); $('#chapcard').classList.add('hidden');
  $('#choices').innerHTML = ''; $('#scene-choices').innerHTML = '';
  closeNar(); setMode('chat');
  setClock(st.time || '23:12');
  $('#lock-date').textContent = st.day || '';
  lastRel = '';
  openConv(st.current || 'ines');
  clearInput();
  G.running = true;
  return play(node, id).catch(e => { if (e.message !== '__abort__') console.error(e); });
}
function stopGame() { G.runId++; G.advance = null; SND.ring(false); }
