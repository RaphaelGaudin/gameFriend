// Génère les portraits illustrés des personnages (img/avatars/*.svg).
// Usage : node tools/make-avatars.js
// Pour utiliser tes propres photos, remplace simplement les fichiers dans img/avatars/
// (en gardant le même nom, ou en changeant le champ `photo` dans js/engine.js).
const fs = require('fs'), path = require('path');
const out = path.join(__dirname, '..', 'img', 'avatars');
fs.mkdirSync(out, { recursive: true });

const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * k))));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
};

// Cheveux bouclés : un nuage de cercles
function curls(cx, cy, rx, ry, r, n, color, from = 0, to = Math.PI * 2, jitter = 3) {
  let s = '', seed = n * 7 + r;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) {
    const a = from + (to - from) * (i / (n - 1 || 1));
    const x = cx + Math.cos(a) * rx + (rnd() - .5) * jitter, y = cy + Math.sin(a) * ry + (rnd() - .5) * jitter;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * (.85 + rnd() * .3)).toFixed(1)}" fill="${color}"/>`;
  }
  return s;
}

function face(o) {
  const skin = o.skin, skinD = shade(skin, .86), hair = o.hair, hairD = shade(hair, .8);
  const bg1 = o.bg, bg2 = shade(o.bg, .55);
  const eye = o.eye || '#2a1f1a';
  let back = '', front = '', extra = '', beard = '';

  switch (o.style) {
    case 'bob': // Inès : carré court, frange de côté
      back = `<path d="M33 52 C31 25 49 16 61 16 C75 16 90 26 87 52 L89 80 C83 85 76 83 74 78 L46 78 C44 83 37 85 31 80 Z" fill="${hair}"/>`;
      front = `<path d="M37 52 C35 28 52 19 63 20 C77 21 86 32 84 52 C80 41 69 34 57 38 C50 41 43 46 37 52 Z" fill="${hair}"/>
               <path d="M57 38 C64 35 74 37 80 44" stroke="${hairD}" stroke-width="1.5" fill="none" opacity=".6"/>`;
      break;
    case 'curlyBig': // Nora : grosse chevelure bouclée
      back = curls(60, 50, 28, 30, 11, 22, hair) + `<ellipse cx="60" cy="58" rx="30" ry="28" fill="${hair}"/>`;
      front = curls(60, 33, 20, 9, 8, 9, hair, Math.PI, Math.PI * 2, 2) + curls(60, 30, 14, 6, 7, 5, hairD, Math.PI * 1.1, Math.PI * 1.9, 2);
      break;
    case 'beanie': // Sam : bonnet + boucles qui dépassent
      back = curls(60, 54, 25, 18, 6, 10, hair, Math.PI * .85, Math.PI * 2.15, 2);
      front = `<path d="M35 47 C34 20 86 20 85 47 Z" fill="${o.hat}"/>
               <rect x="33" y="42" width="54" height="9" rx="4.5" fill="${shade(o.hat, .82)}"/>
               <circle cx="60" cy="20" r="6" fill="${shade(o.hat, 1.15)}"/>`;
      break;
    case 'pixie': // Léa : court décoloré, mèches en pointe
      back = `<path d="M36 54 C33 30 48 20 60 20 C74 20 88 30 84 54 Z" fill="${hair}"/>`;
      front = `<path d="M37 50 C35 26 52 18 62 19 C78 20 86 30 84 48 L79 40 L76 46 L71 36 L66 43 L61 33 L56 42 L51 34 L46 43 L42 37 Z" fill="${hair}"/>
               <path d="M48 24 C56 20 70 21 78 28" stroke="${shade(hair, .85)}" stroke-width="2" fill="none" opacity=".5"/>`;
      break;
    case 'quiff': // Max : banane coiffée
      back = `<path d="M37 50 C35 30 48 22 60 22 C74 22 86 30 83 50 Z" fill="${hair}"/>`;
      front = `<path d="M37 49 C36 33 44 26 52 25 C50 16 66 10 79 18 C86 22 87 32 83 46 C80 37 74 33 66 33 C56 33 44 38 37 49 Z" fill="${hair}"/>
               <path d="M54 24 C60 17 72 16 80 22" stroke="${hairD}" stroke-width="2" fill="none" opacity=".55"/>`;
      break;
    case 'long': // Maman : mi-longs ondulés
      back = `<path d="M32 54 C29 24 48 15 60 15 C74 15 92 24 88 54 C90 70 94 84 88 96 C80 100 74 94 72 86 L48 86 C46 94 40 100 32 96 C26 84 30 70 32 54 Z" fill="${hair}"/>`;
      front = `<path d="M37 52 C36 28 50 20 60 20 C72 20 86 28 84 52 C78 40 72 33 60 32 C50 33 42 40 37 52 Z" fill="${hair}"/>`;
      break;
    case 'shortGrey': // M. Moreau
      back = `<path d="M37 48 C36 28 48 22 60 22 C73 22 85 28 83 48 Z" fill="${hair}"/>`;
      front = `<path d="M38 46 C38 30 50 24 60 24 C72 24 82 30 82 46 C77 38 70 35 60 35 C50 35 43 38 38 46 Z" fill="${hair}"/>`;
      break;
    case 'bald': // M. Vasseur
      back = `<path d="M37 56 C36 48 38 44 41 42 L41 60 Z M83 56 C84 48 82 44 79 42 L79 60 Z" fill="${hair}"/>`;
      front = `<ellipse cx="54" cy="31" rx="9" ry="4" fill="#fff" opacity=".18"/>`;
      break;
  }

  if (o.beard === 'stubble') beard = `<path d="M40 60 C42 78 52 84 60 84 C68 84 78 78 80 60 C76 70 70 74 60 74 C50 74 44 70 40 60 Z" fill="${hair}" opacity=".35"/>`;
  if (o.beard === 'full') beard = `<path d="M38 56 C38 80 50 88 60 88 C70 88 82 80 82 56 C78 68 72 70 66 70 C63 67 57 67 54 70 C48 70 42 68 38 56 Z" fill="${o.beardColor || hair}"/>`;

  // accessoires
  if (o.glasses) extra += `<g fill="none" stroke="${o.glasses}" stroke-width="2"><circle cx="51" cy="55" r="6.5"/><circle cx="69" cy="55" r="6.5"/><path d="M57.5 55 h5 M44.5 54 l-6 -2 M75.5 54 l6 -2"/></g>`;
  if (o.earring) extra += `<path d="M37.5 62 a4 4 0 1 0 3 4" stroke="${o.earring}" stroke-width="2" fill="none"/>`;
  if (o.piercing) extra += `<circle cx="64.5" cy="63" r="1.3" fill="#e8e8f0"/>`;
  if (o.headphones) extra += `<path d="M38 96 C40 104 80 104 82 96" stroke="#222" stroke-width="4" fill="none"/><ellipse cx="38" cy="93" rx="6" ry="7.5" fill="${o.headphones}"/><ellipse cx="82" cy="93" rx="6" ry="7.5" fill="${o.headphones}"/><ellipse cx="38" cy="93" rx="3" ry="4.5" fill="#222"/><ellipse cx="82" cy="93" rx="3" ry="4.5" fill="#222"/>`;

  const mouth = o.mouth || '#b5545c';
  const smile = o.smile === 'open'
    ? `<path d="M53 68 Q60 75 67 68 Z" fill="${mouth}"/><path d="M54.5 68.3 Q60 70 65.5 68.3" stroke="#fff" stroke-width="1.4" fill="none" opacity=".85"/>`
    : o.smile === 'small'
      ? `<path d="M55 68 Q60 71 65 68" stroke="${mouth}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
      : `<path d="M53 67 Q60 73 67 67" stroke="${mouth}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const brows = o.brows || hairD;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="14 10 92 92">
<defs><radialGradient id="g" cx="35%" cy="25%" r="85%"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></radialGradient></defs>
<rect x="0" y="0" width="120" height="120" fill="url(#g)"/>
${back}
<path d="M12 122 C15 96 36 86 60 86 C84 86 105 96 108 122 Z" fill="${o.shirt}"/>
${o.collar || ''}
<path d="M50 70 L50 88 C54 92 66 92 70 88 L70 70 Z" fill="${skinD}"/>
<ellipse cx="38.5" cy="56" rx="4" ry="6" fill="${skinD}"/><ellipse cx="81.5" cy="56" rx="4" ry="6" fill="${skinD}"/>
<ellipse cx="60" cy="53" rx="22" ry="26" fill="${skin}"/>
${beard}
<ellipse cx="49" cy="63" rx="4.5" ry="2.6" fill="#ff7a8a" opacity=".22"/><ellipse cx="71" cy="63" rx="4.5" ry="2.6" fill="#ff7a8a" opacity=".22"/>
<path d="M45 47 Q51 ${o.browUp ? 42 : 44} 56 46" stroke="${brows}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<path d="M64 46 Q69 ${o.browUp ? 42 : 44} 75 47" stroke="${brows}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<ellipse cx="51" cy="55" rx="2.6" ry="3.1" fill="${eye}"/><ellipse cx="69" cy="55" rx="2.6" ry="3.1" fill="${eye}"/>
<circle cx="52" cy="54" r=".9" fill="#fff"/><circle cx="70" cy="54" r=".9" fill="#fff"/>
${o.lashes ? `<path d="M48 51.6 Q51 50.6 54 51.8 M66 51.8 Q69 50.6 72 51.6" stroke="${eye}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` : ''}
<path d="M60 57 Q58 63 61 64" stroke="${skinD}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
${smile}
${front}
${extra}
</svg>`;
}

const PEOPLE = {
  ines:    { bg: '#ff8fa8', skin: '#e0ac86', hair: '#2b1b17', style: 'bob', shirt: '#e8b33a', collar: '<path d="M46 88 Q60 100 74 88" stroke="#c8932a" stroke-width="3" fill="none"/>', earring: '#f5d76e', mouth: '#c0394f', lashes: true, smile: 'open' },
  sam:     { bg: '#6cc7f5', skin: '#f1c7a5', hair: '#6b4428', style: 'beanie', hat: '#4a5566', shirt: '#2f6fb0', beard: 'stubble', smile: 'open', browUp: true },
  lea:     { bg: '#ffc768', skin: '#f6d6c4', hair: '#efe6cf', style: 'pixie', shirt: '#1c1a22', brows: '#9a8466', piercing: true, mouth: '#a8475f', lashes: true, smile: 'small' },
  max:     { bg: '#b39dff', skin: '#efc4a0', hair: '#5a3a22', style: 'quiff', shirt: '#f2f0ec', headphones: '#9d7bff', smile: 'open' },
  nora:    { bg: '#7fd6a2', skin: '#c99772', hair: '#1f1512', style: 'curlyBig', shirt: '#6b4a2e', collar: '<path d="M40 92 L60 112 L80 92" stroke="#4e3420" stroke-width="4" fill="none"/>', glasses: '#3a2a20', lashes: true, smile: 'small' },
  maman:   { bg: '#f6a8c8', skin: '#f3cdb2', hair: '#8a3f22', style: 'long', shirt: '#e98bb0', collar: '<circle cx="60" cy="96" r="2" fill="#fff"/><circle cx="60" cy="106" r="2" fill="#fff"/>', lashes: true, smile: 'open' },
  papa:    { bg: '#cdbd9f', skin: '#e6b994', hair: '#a7a39c', style: 'shortGrey', shirt: '#55647a', beard: 'full', beardColor: '#bdb8b0', glasses: '#4a4a4a', smile: 'small' },
  vasseur: { bg: '#a9b4c9', skin: '#ecc3a3', hair: '#8b8781', style: 'bald', shirt: '#7a6a52', beard: 'full', beardColor: '#9a958d', glasses: '#2a2a2a', collar: '<path d="M50 88 L60 100 L70 88" fill="#e8e2d6"/>', smile: 'small' },
};

for (const [id, o] of Object.entries(PEOPLE)) {
  fs.writeFileSync(path.join(out, id + '.svg'), face(o));
}
console.log('Portraits générés :', Object.keys(PEOPLE).join(', '));
