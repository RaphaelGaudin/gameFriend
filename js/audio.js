'use strict';
/* Moteur audio 100% procédural (Web Audio API) : musiques d'ambiance, bruitages, ambiances. */
const SND = (() => {
  let ctx = null, comp, mus, musFilter, sfx, amb, rev;
  const vol = { music: 0.6, sfx: 0.8 };
  let mood = null, moodName = null, timer = null, step = 0, nextT = 0;
  let ambNodes = [], ambName = null, ringTimer = null, hospTimer = null;
  let noiseBuf = null;

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3;
    comp.connect(ctx.destination);
    mus = ctx.createGain(); mus.gain.value = 0;
    musFilter = ctx.createBiquadFilter(); musFilter.type = 'lowpass'; musFilter.frequency.value = 16000;
    mus.connect(musFilter); musFilter.connect(comp);
    sfx = ctx.createGain(); sfx.gain.value = vol.sfx; sfx.connect(comp);
    amb = ctx.createGain(); amb.gain.value = vol.music * 0.7; amb.connect(comp);
    rev = ctx.createConvolver(); rev.buffer = impulse(2.8);
    const rg = ctx.createGain(); rg.gain.value = 0.4; rev.connect(rg); rg.connect(comp);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function impulse(sec) {
    const len = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    return b;
  }

  // Note générique avec enveloppe
  function note(dest, f, t, dur, o = {}) {
    const osc = ctx.createOscillator();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(f, t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, t + (o.slideT || dur));
    if (o.detune) osc.detune.value = o.detune;
    const g = ctx.createGain();
    const a = o.a ?? 0.01, v = o.v ?? 0.2;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + a);
    if (o.sus) { g.gain.setValueAtTime(v, t + Math.max(a, dur - (o.r || 0.5))); }
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = osc;
    if (o.lp) { const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.lp; fl.Q.value = o.q || 0.7; osc.connect(fl); node = fl; }
    node.connect(g); g.connect(dest);
    if (o.rev) { const rs = ctx.createGain(); rs.gain.value = o.rev; g.connect(rs); rs.connect(rev); }
    osc.start(t); osc.stop(t + dur + 0.05);
  }

  function noise(dest, t, dur, o = {}) {
    const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    const fl = ctx.createBiquadFilter(); fl.type = o.ft || 'highpass'; fl.frequency.setValueAtTime(o.f || 6000, t);
    if (o.fTo) fl.frequency.exponentialRampToValueAtTime(o.fTo, t + dur);
    fl.Q.value = o.q || 0.8;
    const g = ctx.createGain(); const v = o.v ?? 0.1, a = o.a ?? 0.002;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(fl); fl.connect(g); g.connect(dest);
    if (o.rev) { const rs = ctx.createGain(); rs.gain.value = o.rev; g.connect(rs); rs.connect(rev); }
    src.start(t, Math.random()); src.stop(t + dur + 0.05);
  }

  // ---------- MUSIQUES ----------
  // accords en notes MIDI ; pat = index dans l'accord (-1 = silence) sur 16 doubles-croches
  const MOODS = {
    menu:  { bpm: 70, bars: 2, chords: [[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]], pad: .045, padType: 'triangle', arp: { pat:[0,-1,2,-1,3,-1,2,-1,1,-1,2,-1,3,-1,-1,-1], v:.05, oct:12, type:'sine' }, bass: { pat:[0,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1], v:.12 }, kick:[0,10], snare:[8], hat:[2,6,10,14], hv:.018, vinyl:true },
    night: { bpm: 64, bars: 2, chords: [[48,55,59,62,64],[45,52,55,59,60],[41,48,52,57,60],[43,50,55,57,62]], pad: .04, padType: 'triangle', arp: { pat:[4,-1,-1,2,-1,-1,3,-1,-1,1,-1,-1,2,-1,-1,-1], v:.045, oct:12, type:'sine' }, bass: { pat:[0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], v:.1 }, kick:[0,9], snare:[8], hat:[4,12], hv:.012, vinyl:true },
    happy: { bpm: 92, bars: 1, chords: [[48,52,55,59],[45,52,55,57],[41,48,53,57],[43,50,55,59]], pad: .035, padType: 'triangle', arp: { pat:[0,1,2,3,2,1,0,1,2,3,2,1,3,2,1,0], v:.035, oct:12, type:'triangle' }, bass: { pat:[0,-1,-1,0,-1,-1,0,-1,0,-1,-1,0,-1,-1,0,-1], v:.12 }, kick:[0,8], snare:[4,12], hat:[2,6,10,14], hv:.02, vinyl:true },
    party: { bpm: 120, bars: 2, chords: [[45,52,57,60],[41,48,53,57],[48,55,60,64],[43,50,55,59]], pad: .03, padType: 'sawtooth', arp: { pat:[0,2,1,2,0,2,1,3,0,2,1,2,0,3,1,2], v:.03, oct:12, type:'square', lp:2200 }, bass: { pat:[0,-1,0,-1,0,-1,0,0,0,-1,0,-1,0,-1,0,0], v:.13, type:'sawtooth', lp:500 }, kick:[0,4,8,12], snare:[4,12], hat:[2,6,10,14], hv:.03, clap:true },
    sad:   { bpm: 58, bars: 2, chords: [[45,52,57,60],[41,48,53,57],[48,52,55,60],[40,47,52,55]], pad: .05, padType: 'sine', arp: { pat:[2,-1,-1,-1,1,-1,-1,-1,3,-1,-1,-1,-1,-1,-1,-1], v:.05, oct:12, type:'triangle' }, bass: { pat:[0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], v:.1 }, vinyl:true },
    tense: { bpm: 84, bars: 2, chords: [[38,45,50,53],[38,45,50,55],[37,44,49,52],[38,45,50,53]], pad: .04, padType: 'sawtooth', padLp: 700, arp: { pat:[0,-1,0,-1,0,-1,0,-1,0,-1,0,-1,0,-1,0,-1], v:.05, oct:0, type:'triangle', lp:800 }, bass: null, kick:[0,3], hv:0 },
    snow:  { bpm: 72, bars: 2, chords: [[51,55,58,62],[46,53,58,62],[48,55,58,63],[44,51,56,60]], pad: .04, padType: 'sine', arp: { pat:[3,-1,2,-1,1,-1,2,-1,0,-1,1,-1,2,-1,3,-1], v:.05, oct:24, type:'sine', bell:true }, bass: { pat:[0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], v:.09 }, vinyl:true },
    love:  { bpm: 76, bars: 2, chords: [[49,56,60,63],[46,53,56,61],[42,49,54,58],[44,51,56,60]], pad: .045, padType: 'triangle', arp: { pat:[0,-1,1,2,-1,3,-1,2,0,-1,1,2,-1,3,2,1], v:.04, oct:12, type:'sine', bell:true }, bass: { pat:[0,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1], v:.11 }, kick:[0,10], snare:[8], hat:[4,12], hv:.012, vinyl:true },
    studio:{ bpm: 86, bars: 1, chords: [[50,57,60,65],[48,55,58,64],[46,53,57,62],[45,52,57,61]], pad: .03, padType: 'triangle', arp: { pat:[0,-1,-1,2,-1,-1,1,-1,3,-1,-1,2,-1,1,-1,-1], v:.04, oct:12, type:'square', lp:1400 }, bass: { pat:[0,-1,-1,-1,-1,-1,0,-1,-1,-1,0,-1,-1,-1,-1,-1], v:.12 }, kick:[0,6,10], snare:[4,12], hat:[0,2,4,6,8,10,12,14], hv:.014, vinyl:true },
    ending:{ bpm: 66, bars: 2, chords: [[48,55,60,64],[43,50,55,59],[45,52,57,60],[41,48,53,57]], pad: .05, padType: 'triangle', arp: { pat:[0,1,2,3,-1,-1,2,-1,1,2,3,-1,-1,-1,-1,-1], v:.045, oct:12, type:'sine', bell:true }, bass: { pat:[0,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1], v:.1 }, vinyl:true },
  };

  function schedStep(t) {
    const m = mood; if (!m) return;
    const spb = 60 / m.bpm / 4; // durée d'une double-croche
    const s = step % 16, bar = Math.floor(step / 16);
    const chord = m.chords[Math.floor(bar / m.bars) % m.chords.length];
    if (s === 0 && bar % m.bars === 0) {
      const dur = spb * 16 * m.bars;
      chord.forEach((n, i) => {
        note(mus, mtof(n), t, dur, { type: m.padType, v: m.pad, a: dur * 0.25, sus: true, r: dur * 0.3, lp: m.padLp || 1800, detune: (i % 2 ? 6 : -6), rev: .3 });
      });
    }
    if (m.arp) {
      const idx = m.arp.pat[s];
      if (idx >= 0 && Math.random() > 0.08) {
        const f = mtof(chord[idx % chord.length] + m.arp.oct);
        note(mus, f, t, m.arp.bell ? 1.4 : spb * 2.2, { type: m.arp.type, v: m.arp.v, a: .005, lp: m.arp.lp, rev: .5 });
        if (m.arp.bell) note(mus, f * 3.01, t, .5, { type: 'sine', v: m.arp.v * .25, a: .002 });
      }
    }
    if (m.bass && m.bass.pat[s] >= 0) {
      note(mus, mtof(chord[0] - 12), t, spb * 3, { type: m.bass.type || 'sine', v: m.bass.v, a: .01, lp: m.bass.lp || 400 });
    }
    if (m.kick && m.kick.includes(s)) note(mus, 120, t, .35, { type: 'sine', v: .35, a: .002, slide: 42, slideT: .12 });
    if (m.snare && m.snare.includes(s)) { noise(mus, t, m.clap ? .16 : .12, { ft: 'bandpass', f: m.clap ? 1500 : 2200, v: m.clap ? .09 : .045, q: 1, rev: .2 }); }
    if (m.hat && m.hv && m.hat.includes(s)) noise(mus, t, .05, { f: 8000, v: m.hv });
    if (m.vinyl && Math.random() < 0.12) noise(mus, t + Math.random() * spb, .02, { f: 3000, v: .012 });
    nextT += spb; step++;
  }

  function loop() {
    if (!ctx || !mood) return;
    if (nextT < ctx.currentTime - 1) nextT = ctx.currentTime + 0.05; // rattrapage après onglet en veille
    while (nextT < ctx.currentTime + 0.15) schedStep(nextT);
  }

  function music(name) {
    if (!ctx && !name) return;
    init(); if (!ctx) return;
    if (name === moodName) return;
    moodName = name;
    const now = ctx.currentTime;
    mus.gain.cancelScheduledValues(now);
    mus.gain.setValueAtTime(mus.gain.value, now);
    mus.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    setTimeout(() => {
      if (moodName !== name) return;
      mood = MOODS[name] || null; step = 0; nextT = ctx.currentTime + 0.05;
      if (mood) {
        const n = ctx.currentTime;
        mus.gain.cancelScheduledValues(n);
        mus.gain.setValueAtTime(0.0001, n);
        mus.gain.linearRampToValueAtTime(vol.music * 0.55, n + 2);
      }
      if (!timer) timer = setInterval(loop, 30);
    }, 850);
  }

  function muffle(on) {
    if (!ctx) return;
    musFilter.frequency.setTargetAtTime(on ? 550 : 16000, ctx.currentTime, 0.4);
  }

  // ---------- AMBIANCES ----------
  function ambience(name) {
    if (!ctx && !name) return;
    init(); if (!ctx) return;
    if (name === ambName) return;
    ambName = name;
    ambNodes.forEach(n => { try { n.g.gain.setTargetAtTime(0.0001, ctx.currentTime, .5); setTimeout(() => { try { n.s.stop(); } catch (e) {} }, 2500); } catch (e) {} });
    ambNodes = [];
    clearInterval(hospTimer); hospTimer = null;
    if (!name || name === 'none') return;
    const mk = (ft, f, v, q = .7, lfo = 0) => {
      const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
      const fl = ctx.createBiquadFilter(); fl.type = ft; fl.frequency.value = f; fl.Q.value = q;
      const g = ctx.createGain(); g.gain.value = 0.0001;
      g.gain.setTargetAtTime(v, ctx.currentTime, 1.2);
      s.connect(fl); fl.connect(g); g.connect(amb);
      if (lfo) {
        const o = ctx.createOscillator(); o.frequency.value = lfo; const og = ctx.createGain(); og.gain.value = f * .5;
        o.connect(og); og.connect(fl.frequency); o.start();
      }
      s.start(); ambNodes.push({ s, g });
    };
    if (name === 'rain') { mk('lowpass', 1400, .12); mk('highpass', 5000, .025); }
    if (name === 'wind') { mk('bandpass', 500, .14, 1.5, .08); mk('lowpass', 200, .06); }
    if (name === 'cafe') { mk('bandpass', 450, .05, .6, .3); mk('bandpass', 1200, .015, 2, .7); }
    if (name === 'street') { mk('lowpass', 300, .08); mk('bandpass', 900, .015, 1, .15); }
    if (name === 'room') { mk('lowpass', 180, .05); }
    if (name === 'hospital') {
      mk('lowpass', 120, .07);
      hospTimer = setInterval(() => { if (ctx) note(amb, 1046, ctx.currentTime, .18, { v: .04, a: .005 }); }, 1400);
    }
  }

  // ---------- BRUITAGES ----------
  const S = {
    notif() { const t = ctx.currentTime; note(sfx, 988, t, .12, { v: .16 }); note(sfx, 1480, t + .09, .2, { v: .14, rev: .2 }); },
    group() { const t = ctx.currentTime; note(sfx, 784, t, .1, { v: .12 }); note(sfx, 988, t + .07, .1, { v: .12 }); note(sfx, 1175, t + .14, .18, { v: .12, rev: .2 }); },
    send() { const t = ctx.currentTime; noise(sfx, t, .22, { ft: 'bandpass', f: 800, fTo: 4000, v: .08, q: 1.5 }); note(sfx, 660, t + .05, .1, { v: .06, slide: 1320 }); },
    receive() { const t = ctx.currentTime; note(sfx, 1318, t, .09, { v: .08 }); note(sfx, 1760, t + .05, .12, { v: .07 }); },
    key() { const t = ctx.currentTime; noise(sfx, t, .025, { ft: 'bandpass', f: 2500 + Math.random() * 1500, v: .05, q: 2 }); },
    erase() { const t = ctx.currentTime; for (let i = 0; i < 4; i++) noise(sfx, t + i * .05, .03, { ft: 'bandpass', f: 1800, v: .05, q: 2 }); },
    tap() { const t = ctx.currentTime; note(sfx, 520, t, .06, { v: .08, type: 'triangle' }); },
    choice() { const t = ctx.currentTime; note(sfx, 660, t, .12, { v: .08, type: 'triangle' }); note(sfx, 990, t + .05, .18, { v: .06, rev: .3 }); },
    vibrate() { const t = ctx.currentTime; [0, .35].forEach(d => note(sfx, 140, t + d, .25, { type: 'square', v: .06, lp: 300, a: .01 })); },
    heart() { const t = ctx.currentTime; note(sfx, 60, t, .15, { v: .35, slide: 40 }); note(sfx, 55, t + .2, .18, { v: .25, slide: 38 }); },
    tick() { const t = ctx.currentTime; note(sfx, 2200, t, .03, { v: .04, type: 'square', lp: 4000 }); },
    mem() { const t = ctx.currentTime; [72, 76, 79].forEach((n, i) => note(sfx, mtof(n + 12), t + i * .06, .9, { v: .05, rev: .6 })); },
    good() { const t = ctx.currentTime; [60, 64, 67, 72].forEach((n, i) => note(sfx, mtof(n + 12), t + i * .08, 1.2, { v: .06, type: 'triangle', rev: .5 })); },
    bad() { const t = ctx.currentTime; [64, 60, 57, 52].forEach((n, i) => note(sfx, mtof(n), t + i * .12, 1, { v: .06, type: 'triangle', rev: .5 })); },
    chapter() { const t = ctx.currentTime; [48, 55, 60, 64, 67].forEach((n, i) => note(sfx, mtof(n), t + i * .03, 3.5, { v: .05, type: 'triangle', a: .8, sus: true, r: 1.5, rev: .6, lp: 2000 })); note(sfx, mtof(84), t + .6, 2.5, { v: .05, rev: .8 }); },
    ending() { const t = ctx.currentTime; [48, 52, 55, 59, 62, 67].forEach((n, i) => note(sfx, mtof(n), t + i * .25, 4, { v: .05, type: 'sine', a: .4, rev: .8 })); },
    hangup() { const t = ctx.currentTime; [0, .25, .5].forEach(d => note(sfx, 480, t + d, .15, { v: .08, type: 'square', lp: 1500 })); },
    door() { const t = ctx.currentTime; note(sfx, 90, t, .3, { v: .2, slide: 60 }); noise(sfx, t, .15, { ft: 'lowpass', f: 600, v: .1 }); },
    whoosh() { const t = ctx.currentTime; noise(sfx, t, .8, { ft: 'bandpass', f: 300, fTo: 3000, v: .07, q: .8, a: .3, rev: .4 }); },
    camera() { const t = ctx.currentTime; noise(sfx, t, .05, { f: 3000, v: .15 }); noise(sfx, t + .09, .08, { f: 2000, v: .1 }); },
    voice() { const t = ctx.currentTime; note(sfx, 880, t, .08, { v: .07 }); },
  };

  function play(name) {
    init(); if (!ctx || !S[name]) return;
    try { S[name](); } catch (e) { /* silencieux */ }
  }

  function ring(on) {
    if (!on) { clearInterval(ringTimer); ringTimer = null; return; }
    init(); if (!ctx) return;
    clearInterval(ringTimer); ringTimer = null;
    if (!on) return;
    const r = () => {
      const t = ctx.currentTime;
      [76, 79, 84, 79, 76, 79, 84, 88].forEach((n, i) => note(sfx, mtof(n), t + i * .14, .2, { v: .07, type: 'triangle', rev: .2 }));
      S.vibrate();
    };
    r(); ringTimer = setInterval(r, 2600);
  }

  function setVolume(kind, v) {
    vol[kind] = v;
    if (!ctx) return;
    if (kind === 'music') { mus.gain.setTargetAtTime(mood ? v * .55 : 0.0001, ctx.currentTime, .2); amb.gain.setTargetAtTime(v * .7, ctx.currentTime, .2); }
    if (kind === 'sfx') sfx.gain.setTargetAtTime(v, ctx.currentTime, .1);
  }

  return { init, music, muffle, ambience, play, ring, setVolume, vol, get mood() { return moodName; } };
})();
