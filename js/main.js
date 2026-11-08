'use strict';
/* Menu, panneaux, options, carnet, liste des conversations. */
(function () {
  loadMeta();
  SND.setVolume('music', G.meta.settings.music);
  SND.setVolume('sfx', G.meta.settings.sfx);

  const params = new URLSearchParams(location.search);
  if (params.get('auto')) {
    G.auto = true;
    let seed = parseInt(params.get('seed') || '1', 10);
    G.rng = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  }

  const menu = $('#menu'), game = $('#game');

  function refreshMenu() {
    $('#btn-continue').disabled = !loadSave();
    $('[data-act="chapters"]').disabled = !Object.keys(G.meta.chapters).length;
    const n = Object.keys(G.meta.endings).length;
    $('#end-count').textContent = n ? `(${n}/${Object.keys(ENDINGS).length})` : '';
  }
  function showMenu() {
    stopGame();
    game.classList.add('hidden'); menu.classList.remove('hidden');
    closePanel();
    refreshMenu();
    SND.ambience(null);
    SND.music('menu');
  }
  function showGame() { menu.classList.add('hidden'); game.classList.remove('hidden'); }

  /* ---------- panneaux ---------- */
  function openPanel(html, onMount) {
    $('#panel-content').innerHTML = html;
    $('#panel').classList.remove('hidden');
    if (onMount) onMount($('#panel-content'));
  }
  function closePanel() { $('#panel').classList.add('hidden'); }
  $('#panel-close').onclick = () => { SND.play('tap'); closePanel(); };
  $('#panel').onclick = e => { if (e.target.id === 'panel') closePanel(); };

  function newGame() {
    openPanel(`<h2>Qui es-tu ?</h2>
      <p>Tu as 19 ans. Tu viens d'emménager à Lyon pour tes études de création sonore. Et ta meilleure amie depuis la 6e, Inès, vient d'arriver dans la même ville.</p>
      <label class="small">Ton prénom</label>
      <input type="text" id="in-name" maxlength="14" value="Hugo" autocomplete="off">
      <p class="small">Ton personnage est écrit au masculin.</p>
      <button class="btn" id="go-new" style="background:linear-gradient(135deg,#ff5d8f,#7c6cff);border:none;font-weight:600">Commencer</button>`, root => {
      const inp = root.querySelector('#in-name'); if (!matchMedia('(pointer: coarse)').matches) { inp.focus(); inp.select(); }
      const go = () => {
        const name = (inp.value || 'Hugo').trim().replace(/[<>]/g, '') || 'Hugo';
        closePanel(); showGame();
        SND.init(); SND.play('choice');
        startFrom('c1', newState(name.charAt(0).toUpperCase() + name.slice(1)));
      };
      root.querySelector('#go-new').onclick = go;
      inp.onkeydown = e => { if (e.key === 'Enter') { inp.blur(); go(); } };
      inp.setAttribute('enterkeyhint', 'go'); inp.setAttribute('autocapitalize', 'words');
    });
  }

  function continueGame() {
    const s = loadSave(); if (!s) return;
    showGame(); SND.init();
    startFrom(s.node, s.st);
  }

  function chaptersPanel() {
    const items = CHAPTERS.map(c => {
      const ok = !!G.meta.chapters[c.n];
      return `<div class="chap-item ${ok ? 'ok' : 'locked'}" data-n="${c.n}"><div class="n">${c.n === 11 ? 'É' : c.n}</div><div class="t"><b>${ok ? esc(c.title) : '???'}</b><span>${ok ? esc(c.sub) : 'Pas encore atteint'}</span></div></div>`;
    }).join('');
    openPanel(`<h2>Chapitres</h2><p class="small">Reprends au début d’un chapitre, avec les choix de ta dernière partie qui l’a atteint.</p>${items}`, root => {
      root.querySelectorAll('.chap-item.ok').forEach(it => it.onclick = () => {
        const snap = JSON.parse(G.meta.chapters[it.dataset.n]);
        closePanel(); showGame(); SND.init(); SND.play('choice');
        startFrom(snap.node, snap.st);
      });
    });
  }

  function endingsPanel() {
    const list = Object.entries(ENDINGS).sort((a, b) => a[1].num - b[1].num).map(([k, e]) => {
      const ok = G.meta.endings[k];
      return `<div class="end-item ${ok ? '' : 'locked'}"><div class="e">${ok ? e.icon : '🔒'}</div><div><b>${ok ? esc(e.title) : '???'}</b><span>${ok ? esc(e.short) : esc(e.hint)}</span></div></div>`;
    }).join('');
    const n = Object.keys(G.meta.endings).length;
    openPanel(`<h2>Fins (${n}/${Object.keys(ENDINGS).length})</h2>${list}`);
  }

  function optionsPanel() {
    const st = G.meta.settings;
    openPanel(`<h2>Options</h2>
      <div class="opt-row"><label>Musique</label><input type="range" id="o-music" min="0" max="1" step="0.05" value="${st.music}"></div>
      <div class="opt-row"><label>Effets sonores</label><input type="range" id="o-sfx" min="0" max="1" step="0.05" value="${st.sfx}"></div>
      <div class="opt-row"><label>Vitesse du texte</label><div class="seg" id="o-speed">
        ${['lent', 'normal', 'rapide', 'instant'].map(s => `<button data-s="${s}" class="${st.speed === s ? 'on' : ''}">${s}</button>`).join('')}
      </div></div>
      <p class="small">Raccourcis : <b>Espace</b> / <b>Entrée</b> pour avancer, <b>1-4</b> pour choisir, <b>F</b> pour l’avance rapide.</p>
      <button class="btn" id="o-reset" style="margin-top:20px;color:#ff8b8b">Effacer toute la progression</button>`, root => {
      root.querySelector('#o-music').oninput = e => { st.music = +e.target.value; SND.setVolume('music', st.music); saveMeta(); };
      root.querySelector('#o-sfx').oninput = e => { st.sfx = +e.target.value; SND.setVolume('sfx', st.sfx); SND.play('notif'); saveMeta(); };
      root.querySelectorAll('#o-speed button').forEach(b => b.onclick = () => {
        st.speed = b.dataset.s; saveMeta();
        root.querySelectorAll('#o-speed button').forEach(x => x.classList.toggle('on', x === b));
      });
      root.querySelector('#o-reset').onclick = () => {
        if (!confirm('Effacer sauvegarde, chapitres et fins débloquées ?')) return;
        localStorage.removeItem(SAVE_KEY); localStorage.removeItem(META_KEY);
        loadMeta(); closePanel(); refreshMenu();
      };
    });
  }

  function creditsPanel() {
    openPanel(`<h2>Crédits</h2>
      <p><b>Lu à 23h12</b> — un jeu narratif par messages.</p>
      <p>Histoire, code, musique et bruitages générés en temps réel dans ton navigateur (Web Audio). Aucun fichier son, aucune dépendance.</p>
      <p>10 chapitres · 7 fins · des dizaines de choix qui comptent.</p>
      <p class="small">Inès, Sam, Léa, Maxime et Nora sont des personnages de fiction.</p>`);
  }

  function carnetPanel() {
    if (!G.st) return;
    const v = G.st.v;
    const rows = STAT_KEYS.filter(k => k !== 'nora' || v.nora_met).map(k => {
      const s = STATS[k];
      return `<div class="stat"><div class="stat-top">${s.label}<span>${s.desc}</span></div><div class="stat-bar"><i style="width:${v[k] * 10}%;background:${s.color}"></i></div></div>`;
    }).join('');
    openPanel(`<h2>Carnet</h2><p>Inès &amp; toi : <b style="color:var(--accent)">${esc(relLabel())}</b></p>${rows}
      <p class="small">Chaque message compte. Certaines choses ne se rattrapent pas.</p>`);
  }

  /* ---------- liste des conversations ---------- */
  function openList() {
    if (!G.st) return;
    SND.play('tap');
    const box = $('#convlist'); box.innerHTML = '';
    const ids = Object.keys(G.st.convos).filter(k => (G.st.convos[k] || []).some(m => m.who !== 'sys'));
    ids.sort((a, b) => (a === G.st.current ? -1 : b === G.st.current ? 1 : 0));
    ids.forEach(id => {
      const msgs = G.st.convos[id]; const last = [...msgs].reverse().find(m => m.who !== 'sys') || msgs[msgs.length - 1];
      const row = el('div', 'conv');
      row.appendChild(avatarEl(id));
      const b = el('div', 'c-body');
      const prev = last ? (last.who === 'me' ? 'Toi : ' : '') + (last.img ? '📷 Photo' : last.voice ? '🎤 Vocal' : last.t) : '';
      b.innerHTML = `<div class="c-name">${esc(CONTACTS[id].name)}</div><div class="c-last">${esc(prev)}</div>`;
      row.appendChild(b);
      const u = id === G.st.current ? 0 : (G.st.unread[id] || 0);
      if (u) row.appendChild(el('div', 'c-badge', u));
      row.onclick = () => openHist(id);
      box.appendChild(row);
    });
    $('#listview').classList.remove('hidden');
    $('#histview').classList.add('hidden');
  }
  function openHist(id) {
    SND.play('tap');
    if (id !== G.st.current) G.st.unread[id] = 0;
    updateUnread();
    $('#hist-name').textContent = CONTACTS[id].name;
    renderThread($('#histthread'), id, false);
    $('#histview').classList.remove('hidden');
  }
  $('#btn-list').onclick = openList;
  $('#btn-closelist').onclick = () => { SND.play('tap'); $('#listview').classList.add('hidden'); };
  $('#btn-closehist').onclick = () => { SND.play('tap'); $('#histview').classList.add('hidden'); };

  /* ---------- barre du haut ---------- */
  $('#tb-menu').onclick = () => {
    SND.play('tap');
    openPanel(`<h2>Pause</h2><p class="small">La partie est sauvegardée automatiquement au début de chaque chapitre.</p>
      <button class="btn" id="p-resume">Reprendre</button>
      <button class="btn" id="p-carnet">Carnet</button>
      <button class="btn" id="p-opts">Options</button>
      <button class="btn" id="p-menu">Menu principal</button>`, root => {
      root.querySelector('#p-resume').onclick = closePanel;
      root.querySelector('#p-carnet').onclick = carnetPanel;
      root.querySelector('#p-opts').onclick = optionsPanel;
      root.querySelector('#p-menu').onclick = showMenu;
    });
  };
  $('#tb-carnet').onclick = () => { SND.play('tap'); carnetPanel(); };
  $('#head-rel').onclick = () => { SND.play('tap'); carnetPanel(); };
  const toggleFF = () => { G.ff = !G.ff; $('#tb-ff').classList.toggle('on', G.ff); $('#hb-ff').classList.toggle('on', G.ff); toast(G.ff ? '⏩ Avance rapide' : '▶ Vitesse normale', 1200); if (G.ff) doAdvance(); };
  $('#tb-ff').onclick = toggleFF;
  $('#hb-ff').onclick = toggleFF;
  $('#hb-menu').onclick = () => $('#tb-menu').click();

  /* ---------- avancer ---------- */
  ['#nar', '#dialog', '#chapcard', '#callview'].forEach(s => $(s).addEventListener('click', doAdvance));
  document.addEventListener('keydown', e => {
    if (!$('#panel').classList.contains('hidden')) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); doAdvance(); }
    if ((e.key === 'f' || e.key === 'F') && !game.classList.contains('hidden')) toggleFF();
  });

  /* ---------- fin ---------- */
  $('#end-menu').onclick = showMenu;
  $('#end-chapters').onclick = () => { showMenu(); chaptersPanel(); };

  /* ---------- menu ---------- */
  menu.addEventListener('click', e => {
    SND.init();
    if (!SND.mood) SND.music('menu');
    const b = e.target.closest('button'); if (!b) return;
    SND.play('tap');
    ({ new: newGame, continue: continueGame, chapters: chaptersPanel, endings: endingsPanel, options: optionsPanel, credits: creditsPanel })[b.dataset.act]?.();
  });

  refreshMenu();

  /* ---------- iPhone ---------- */
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
  if (isIOS && !standalone) $('#ios-hint').classList.add('show');
  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !G.auto) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  // Toucher n'importe où dans le fil fait avancer les cartes de narration / appels
  ['touchstart', 'mousedown'].forEach(ev => document.addEventListener(ev, () => SND.init(), { once: true, passive: true }));

  if (G.auto) {
    showGame();
    window.__autoDone = false;
    const start = params.get('node') || 'c1';
    startFrom(start, newState('Hugo')).then(() => { window.__autoDone = true; window.__ending = G.lastEnding; });
  }
})();
