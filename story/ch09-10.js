'use strict';
CHAPTERS.push(
  { n: 9, node: 'c9', title: 'Le silence', sub: 'Janvier' },
  { n: 10, node: 'c10', title: 'Février', sub: 'Le 14' },
);

/* ==========================================================
   CHAPITRE 9 — Le silence
   ========================================================== */
STORY.c9 = [
  { ch: 9, title: 'Le silence', sub: 'Janvier' },
  { day: 'Lundi 6 janvier', time: '19:20', music: 'happy' },
  { open: 'sam' },
  "sam: frère",
  "sam: faut que je te dise un truc",
  { if: v => v.sam_helped || v.sam_party, then: [
    "sam: Léa et moi on est ensemble",
    "sam: depuis Noël. on a mangé des pâtes toutes les deux semaines de vacances et à un moment elle m'a embrassé au-dessus de la casserole",
    "sam: je suis le plus heureux des ratons laveurs",
    { c: [
      { t: "SAM ! Je suis trop content pour toi !", fx: { sam: 2 } },
      { t: "Attends. Toi t'as réussi et pas moi ??", fx: { sam: 1 }, then: ["sam: moi j'ai PARLÉ, frère. c'est tout le secret", "sam: le secret c'est les mots"] },
    ] },
  ], else: [
    "sam: j'ai acheté un ficus. il s'appelle Gérard",
    "sam: c'était ça mon truc. bonne année",
    "> Bonne année Sam. Et bienvenue à Gérard.",
  ] },
  { if: v => v.nora_film, then: [{ go: 'c9_nora' }] },
  { go: 'c9_branch' },
];

STORY.c9_nora = [
  { day: 'Jeudi 16 janvier', time: '23:40' },
  { scene: 'studio', loc: 'Studio B · 23h40', music: 'studio', amb: 'room' },
  "~ Trois semaines de soirées au studio pour la musique du film de Nora. Son court-métrage parle d'une fille qui enregistre les bruits de la ville pour ne pas oublier sa grand-mère.",
  "~ Ce soir, vous avez fini le thème principal. Vous l'avez écouté trois fois d'affilée sans parler.",
  "nora: C'est parfait. Je déteste dire ça, mais c'est parfait.",
  "~ Elle pivote sur sa chaise pour te faire face.",
  { if: v => v.nora_moment || v.nora >= 6, then: [
    "nora: Bon. Je vais te dire un truc et après on n'en parle plus si tu veux.",
    "nora: Je t'aime bien. Pas comme un binôme. Depuis le céleri, à peu près.",
    "nora: Je sais pour Inès. Je te demande rien. Je voulais juste que ce soit pas un bruitage. Que ça s'entende.",
    { c: [
      { t: "Je crois que moi aussi, Nora.", req: v => !v.together, fx: { nora: 3 }, set: 'nora_love', log: 'Tu as dit à Nora que c’était réciproque.', then: [
        "~ Elle te regarde longtemps. Elle ne sourit pas tout de suite. Puis elle sourit beaucoup.",
        "nora: Ok. Ok ok ok. On va pas tout compliquer ce soir. Mais ok.",
        { if: v => v.needtime, then: ["~ Une petite voix te rappelle qu'Inès réfléchit encore, quelque part dans la ville. Tu ne sais plus ce que tu attends."] },
      ] },
      { t: "Nora… mon cœur est ailleurs. Je suis désolé.", fx: { nora: -1, conf: 1 }, set: 'nora_friend', then: [
        "nora: Je sais. Je voulais l'entendre quand même. C'est plus propre comme ça.",
        "nora: On reste binômes ?",
        "> Toujours.",
      ] },
      { t: "[L'embrasser]", req: v => !v.together, fx: { nora: 3 }, set: { nora_love: true, nora_kiss: true }, log: 'Tu as embrassé Nora au studio B.', then: [
        "~ Elle a le goût du café froid. Le studio est silencieux, vraiment silencieux, pour la première fois.",
        "nora: …Bon. Ça c'est un bruitage que j'ai pas besoin de refaire.",
      ] },
      { t: "Je suis avec Inès, Nora.", req: v => v.together, fx: { conf: 1 }, set: 'nora_friend', then: ["nora: Je sais. Je suis contente pour toi. Vraiment. Ça passera.", "nora: Le thème du film, par contre, il est à moi."] },
    ] },
  ], else: [
    "nora: Merci, binôme. Sans toi, ce film aurait été muet. Littéralement.",
    "nora: Tu viens à la projection, le 14 ? Je veux que tu sois là.",
    "> Je vais essayer.",
  ] },
  { endscene: 'ines', amb: 'none' },
  { go: 'c9_branch' },
];

STORY.c9_branch = [
  { if: v => v.together, then: [{ go: 'c9_together' }] },
  { if: v => v.needtime, then: [{ go: 'c9_wait' }] },
  { if: v => v.rejected_noel, then: [{ go: 'c9_rejected' }] },
  { go: 'c9_silent' },
];

/* ---------- Ensemble ---------- */
STORY.c9_together = [
  { open: 'ines', day: 'Samedi 18 janvier', time: '10:12', music: 'love' },
  "ines: bonjour toi",
  "ines: c'est bizarre de t'écrire « bonjour toi »",
  "ines: c'est bizarre et c'est trop bien",
  { c: [
    { t: "Bonjour toi aussi ❤", fx: { aff: 1 } },
    { t: "Je m'y fais pas. Je me réveille et je me souviens et je souris comme un idiot.", fx: { aff: 1 }, then: ["ines: pareil. Léa m'a dit que j'avais « la tête d'une lune contente »"] },
  ] },
  { day: 'Mardi 21 janvier', time: '18:05', music: 'night' },
  "ines: faut que je te dise un truc. je veux pas qu'il y ait de secret entre nous",
  "ines: Max m'a écrit. il veut qu'on prenne un café. pour « parler »",
  "ines: on s'est quittés un peu vite. je crois que je lui dois bien un café",
  "ines: ça te dérange ?",
  { c: [
    { t: "Vas-y. J'ai confiance en toi.", fx: { conf: 2 }, set: 'trusted', log: 'Tu as fait confiance à Inès.' },
    { t: "Un peu. Mais c'est toi qui décides, et je te fais confiance.", fx: { conf: 2, aff: 1 }, set: 'trusted', log: 'Tu as été honnête, et tu lui as fait confiance.' },
    { t: "Si tu y vas, c'est que t'as encore des sentiments pour lui.", fx: { jal: 2, conf: -1 }, log: 'Tu l’as accusée d’avoir encore des sentiments pour Max.', then: [
      "ines: quoi ? non !",
      "ines: c'est justement pour ça que je te le dis. parce que y a rien à cacher",
    ] },
    { t: "Montre-moi ses messages d'abord.", fx: { jal: 3, conf: -2 }, log: 'Tu as voulu lire ses messages.', then: [
      "ines: …",
      "ines: non.",
      "ines: {nom}, je t'ai rien caché. ne fais pas ça.",
      { seen: 'ines' },
    ] },
  ] },
  { day: 'Jeudi 23 janvier', time: '17:30' },
  "~ Jeudi. Elle a rendez-vous avec Max à 17h. Tu essaies de travailler. Tu relis la même ligne de cours depuis vingt minutes.",
  { lock: true, time: '18:10' },
  "~ 18h10. Rien.",
  { c: [
    { t: "[Lui écrire : « ça va ? »]", fx: { jal: 1 }, then: [{ unlock: 'ines' }, "> Ça va ?", { lock: true }] },
    { t: "[Attendre. Elle te fera signe.]", fx: { conf: 1 } },
  ] },
  { time: '18:48' },
  "~ 18h48. Toujours rien.",
  { c: [
    { t: "[Lui écrire : « tu rentres quand ? »]", fx: { jal: 1 }, then: [{ unlock: 'ines' }, "> Tu rentres quand ?", { lock: true }] },
    { t: "[Appeler Sam pour te changer les idées]", fx: { sam: 1, conf: 1 }, then: ["~ Sam te raconte pendant vingt minutes comment Gérard le ficus a perdu une feuille. C'est exactement ce qu'il te fallait."] },
    { t: "[Aller devant le café pour voir]", fx: { jal: 3 }, set: 'spied', log: 'Tu es allé l’espionner.', then: [
      "~ Tu te retrouves de l'autre côté de la rue du café, capuche sur la tête. Tu te sens ridicule. Tu ES ridicule.",
      "~ Par la vitre, tu les vois. Ils parlent calmement. Max a l'air triste. Inès lui tient la main, une seconde, comme on dit au revoir.",
      "~ Puis elle tourne la tête vers la vitre. Et elle te voit.",
    ] },
  ] },
  { time: '19:20' },
  { if: v => v.spied, then: [
    "ines: t'étais devant le café ?",
    "ines: sérieusement ?",
    "ines: tu me fais pas confiance ?",
    { unlock: 'ines' },
    { c: [
      { t: "Pardon. J'ai paniqué. C'était stupide et je le sais.", fx: { jal: -1, conf: 1 }, then: ["ines: oui c'était stupide", "ines: on en parle ce soir. calmement."] },
      { t: "Tu lui tenais la main.", fx: { jal: 2, conf: -1 }, then: ["ines: pour lui dire AU REVOIR. il pleurait, {nom}", "ines: je rentre chez moi. seule. ce soir."] },
    ] },
  ], else: [
    "ines: c'est fait. il s'est excusé. il m'a souhaité d'être heureuse",
    "ines: il a dit « avec lui, j'espère ». il savait, en fait. depuis le début",
    { unlock: 'ines' },
    { if: v => v.trusted && v.jal <= 2, then: [
      "ines: merci de m'avoir fait confiance",
      "ines: je t'aime, tu sais",
      { wait: 500 },
      "ines: pas comme en septembre. je t'aime pour de vrai",
      { mem: 'Elle l’a dit. Pour de vrai.' },
      { c: [
        { t: "Je t'aime aussi. Depuis la place près de la fenêtre.", fx: { aff: 1 } },
        { t: "Je sais 😎", fx: { aff: 1 }, then: ["ines: t'es nul. viens. je t'attends en bas avec des pâtes"] },
      ] },
    ], else: [
      "ines: je rentre",
      { c: [
        { t: "Je suis content que ça se soit bien passé.", fx: { conf: 1 } },
        { t: "Il voulait quoi exactement ?", fx: { jal: 1 }, then: ["ines: je viens de te le dire."] },
      ] },
    ] },
  ] },
  { open: 'sam', day: 'Samedi 1er février', time: '15:00', music: 'happy' },
  "sam: dis",
  "sam: depuis que t'es en couple tu rentres plus. on n'a pas fait de soirée jeux depuis un mois",
  "sam: Gérard se demande si t'habites encore ici",
  { c: [
    { t: "T'as raison. Soirée jeux ce soir. Je ramène les pizzas.", fx: { sam: 2 }, set: 'sam_time', then: ["sam: OUI. je préviens Gérard"] },
    { t: "Je suis occupé en ce moment, tu sais bien.", fx: { sam: -2 }, then: ["sam: ouais. je sais bien."] },
  ] },
  { recap: true },
  { go: 'c10' },
];

/* ---------- Elle a besoin de temps ---------- */
STORY.c9_wait = [
  { open: 'ines', day: 'Vendredi 3 janvier', time: '21:00', music: 'sad', amb: 'rain' },
  "~ De retour à Lyon. Inès ne t'a pas écrit depuis le jour de l'an. Tu vois son statut « en ligne » apparaître et disparaître.",
  "~ C'est le silence le plus bruyant de ta vie.",
  { set: { spam: 0 } },
  { day: 'Dimanche 5 janvier', time: '22:30' },
  { c: [
    { t: "Coucou. Je pense à toi.", fx: { conf: 0 }, then: [{ seen: 'ines' }] },
    { t: "Tu comptes me répondre un jour ?", fx: { jal: 1, conf: -1, spam: 0 }, set: { spam1: true }, then: [{ seen: 'ines' }] },
    { t: "[Ne rien envoyer. Lui laisser de l'espace.]", fx: { conf: 1 } },
  ], prompt: 'Jour 3 sans nouvelles' },
  { day: 'Mercredi 8 janvier', time: '01:12' },
  "~ 1h12 du matin. Tu n'arrives pas à dormir. Tu vois qu'elle a posté une story.",
  { m: 'ines', t: "Story · « nuit blanche, encore »", img: { e: '📐', bg: 'linear-gradient(135deg,#283048,#859398)' }, in: 'ines' },
  { c: [
    { t: "Toi aussi tu dors pas ?", fx: { jal: 0 }, then: [{ wait: 1500 }, "ines: non. bonne nuit {nom}", "~ Trois mots. C'est déjà ça."] },
    { t: "Tu postes des stories mais tu me réponds pas ?", fx: { jal: 2, conf: -1 }, set: { spam2: true }, then: [{ seen: 'ines' }, { wait: 2000 }, "ines: s'il te plaît. j'ai demandé du temps."] },
    { t: "[Réagir avec un cœur, et c'est tout]", fx: { aff: 1 } },
    { t: "[Poser le téléphone. Dormir.]", fx: { conf: 1 } },
  ], prompt: 'Jour 6' },
  { amb: 'none' },
  { open: 'sam', day: 'Jeudi 9 janvier', time: '12:00', music: 'happy' },
  "sam: frère t'as une tête de fantôme",
  "sam: elle t'a écrit ?",
  { c: [
    { t: "Non. Et je deviens fou.", fx: { sam: 1 }, then: [
      "sam: écoute. le silence c'est pas un non. c'est quelqu'un qui réfléchit",
      "sam: si tu la presses, tu décides à sa place. et tu vas pas aimer ce que tu vas décider",
      "sam: viens, on va au cinéma. un film d'action. rien d'émotionnel. des explosions",
      { fx: { conf: 1 } },
    ] },
    { t: "Je m'en fous, en fait.", fx: { sam: -1 }, then: ["sam: c'est ça. moi aussi je me fous de Gérard"] },
  ] },
  { open: 'ines', day: 'Dimanche 12 janvier', time: '20:40', music: 'sad', amb: 'rain' },
  "~ Jour 10. Tu tapes un message. Long. Très long. Tout ce que tu ressens.",
  { c: [
    { t: "Inès, je comprends pas pourquoi tu me fais ça. Après tout ce que j'ai fait pour toi, tu me dois au moins une réponse.", draft: true, fx: { jal: 3, conf: -2 }, set: { spam3: true }, log: 'Tu lui as reproché tout ce que tu avais fait pour elle.', then: [
      { wait: 1500 },
      { seen: 'ines' },
      { wait: 2500 },
      "ines: je te dois rien, {nom}. personne doit rien à personne.",
      "ines: je pensais que t'avais compris ça.",
    ], erase: [
      "~ Tu effaces tout. Lettre par lettre. Tu poses le téléphone.",
    ], efx: { conf: 1 }, elog: 'Tu as écrit un long message de reproches… et tu l’as effacé.' },
    { t: "[Lui envoyer juste une photo de la pluie sur ta fenêtre]", fx: { aff: 1 }, then: [
      { me: "🌧️" },
      { wait: 2000 },
      "ines: on a la même pluie",
      "ines: ça me fait du bien que tu m'écrives pas de longs messages. merci de pas faire ça",
    ] },
  ] },
  { amb: 'none', day: 'Mercredi 15 janvier', time: '19:30' },
  { if: v => v.spam3 || (v.spam1 && v.spam2), then: [
    "ines: {nom}",
    "ines: j'ai besoin que t'arrêtes de m'écrire comme ça. de me faire sentir que je te dois quelque chose",
    "ines: je t'aime. vraiment. mais là j'étouffe",
    "ines: je te reparlerai quand je pourrai.",
    { fx: { conf: -1 }, set: 'smothered' },
    { c: [
      { t: "Pardon. Tu as raison. Je te laisse tranquille.", fx: { jal: -1, conf: 1 } },
      { t: "Ok.", then: [] },
    ] },
  ], else: [
    "ines: merci",
    "ines: merci de pas avoir insisté. j'en avais besoin",
    "ines: j'ai beaucoup réfléchi. à nous. à moi",
    "ines: le 14 février, c'est le vernissage des projets à mon école. ma médiathèque est exposée",
    "ines: viens. je te donnerai ma réponse là-bas",
    { fx: { conf: 1 }, mem: 'Rendez-vous le 14 février.' },
    { c: [
      { t: "J'y serai.", fx: { conf: 1 } },
      { t: "Le 14 février ? C'est un peu cliché, non ?", fx: { aff: 1 }, then: ["ines: c'est la date de l'expo, idiot. c'est le hasard", "ines: …ou pas. je sais pas. viens."] },
    ] },
  ] },
  { recap: true },
  { go: 'c10' },
];

/* ---------- Elle a dit non ---------- */
STORY.c9_rejected = [
  { open: 'ines', day: 'Samedi 4 janvier', time: '18:00', music: 'sad' },
  "~ Retour à Lyon. Le « non » d'Inès te suit partout. Dans le tram, au studio, sous la douche.",
  "~ Il faut décider quoi en faire.",
  { c: [
    { t: "[Prendre de la distance. Pour toi.]", fx: { conf: 1 }, set: 'healthy_distance', log: 'Tu as pris de la distance pour guérir.', then: [
      "> Inès, je vais prendre un peu de distance quelques semaines. C'est pas contre toi. C'est pour moi.",
      { wait: 1200 },
      "ines: je comprends. je suis là quand tu veux. vraiment",
      "ines: prends soin de toi ❤",
    ] },
    { t: "[Faire comme si de rien n'était]", fx: { fz: 2 }, log: 'Tu as fait comme si de rien n’était.', then: [
      "> Coucou ! Tu fais quoi ce week-end ? 😄",
      "ines: euh… rien de spécial. ça va toi ?",
      "> Super !",
      "~ Rien ne va. Tout le monde le sait. Vous faites semblant ensemble, ce qui est une forme d'amitié, peut-être.",
    ] },
    { t: "[Lui écrire une longue lettre pour la faire changer d'avis]", fx: { jal: 2, conf: -1 }, log: 'Tu as essayé de la faire changer d’avis.', then: [
      "~ Tu écris trois pages. Tu cites des moments, des dates, des regards. Tu envoies.",
      { wait: 2000 },
      { seen: 'ines' },
      { wait: 3000 },
      "ines: {nom}. j'ai lu. c'est beau",
      "ines: mais on change pas ce qu'on ressent avec des arguments",
      "ines: s'il te plaît, ne fais pas ça.",
    ] },
  ] },
  { open: 'sam', day: 'Vendredi 17 janvier', time: '22:00', music: 'night' },
  "sam: soirée jeux ce soir ?",
  "sam: Gérard le ficus joue aussi. il est nul au Uno",
  { c: [
    { t: "Oui. J'ai besoin de rire.", fx: { sam: 2, conf: 1 }, set: 'sam_time', then: ["~ Tu perds onze parties de Uno. Tu ris tellement que tu en as mal au ventre. Pour la première fois depuis Noël, tu respires."] },
    { t: "Pas ce soir.", fx: { sam: -1 } },
  ] },
  { open: 'ines', day: 'Mardi 4 février', time: '20:00', music: 'night' },
  "ines: hey",
  "ines: tu me manques",
  "ines: le 14 c'est le vernissage des projets à mon école. ma médiathèque est exposée. avec les alcôves",
  "ines: ça compterait beaucoup que tu viennes. en tant que… toi.",
  { c: [
    { t: "J'y serai. En tant que moi.", fx: { conf: 1 } },
    { t: "Je sais pas si je suis prêt.", then: ["ines: je comprends. la porte est ouverte"] },
  ] },
  { recap: true },
  { go: 'c10' },
];

/* ---------- Tu n'as rien dit ---------- */
STORY.c9_silent = [
  { open: 'ines', day: 'Mercredi 15 janvier', time: '21:15', music: 'night' },
  { if: v => v.broke_for_you, then: [
    "ines: j'ai rencontré quelqu'un. enfin, je le connaissais déjà. Adrien, de mon atelier",
    "ines: on se voit un peu. c'est tout doux. je voulais que tu le saches en premier",
    "ines: t'es mon meilleur ami. c'est normal que tu le saches en premier",
    { set: { back_other: true } },
  ], else: [
    "ines: faut que je te dise un truc",
    "ines: Max et moi on se redonne une chance",
    "ines: je sais ce que tu vas dire. mais il a changé. il a arrêté le club du jeudi pour moi",
    "ines: t'es mon meilleur ami. c'est normal que tu le saches en premier",
    { set: { back_other: true, back_max: true } },
  ] },
  { c: [
    { t: "Je suis content pour toi. Sincèrement.", fx: { fz: 2 } },
    { t: "Ok.", fx: { conf: -1 }, then: ["ines: « ok » ?", "ines: c'est tout ?"] },
    { t: "[Ne pas répondre]", fx: { conf: -2 }, then: [{ seen: 'ines' }, { wait: 1500 }, "ines: …", "ines: je t'ai fait quelque chose ?"] },
  ] },
  { open: 'sam', day: 'Jeudi 16 janvier', time: '00:30', music: 'sad' },
  "sam: elle t'a dit, hein",
  "sam: Léa m'a raconté",
  "sam: frère. t'as eu ta chance sous la neige",
  { c: [
    { t: "Je sais. J'ai eu peur. Et maintenant c'est trop tard.", fx: { sam: 1 }, then: [
      "sam: c'est jamais trop tard pour dire la vérité",
      "sam: c'est juste trop tard pour qu'elle change quelque chose. c'est pas pareil",
      "sam: tu veux lui dire, ou tu veux qu'elle choisisse ? parce que c'est deux trucs différents",
    ] },
    { t: "Tu peux pas comprendre.", fx: { sam: -1 }, then: ["sam: j'ai mis six mois à dire à Léa qu'elle avait de la sauce sur le menton, frère. je comprends TRÈS bien"] },
  ] },
  { c: [
    { t: "[Lui avouer tout, maintenant, par message]", go: 'c9_late_confess' },
    { t: "[Accepter. Tourner la page.]", fx: { conf: 1 }, set: 'accepted', log: 'Tu as accepté qu’elle soit avec quelqu’un d’autre.' },
    { t: "[Couper les ponts. Ne plus lui répondre.]", fx: { conf: -3 }, set: 'cut_off', log: 'Tu as coupé les ponts avec Inès.' },
  ], prompt: 'Qu’est-ce que tu fais ?' },
  { if: v => v.cut_off, then: [
    { open: 'ines', day: 'Lundi 27 janvier', time: '18:00' },
    "ines: t'es où ? t'as disparu",
    "ines: {nom} ?",
    "ines: j'ai fait quelque chose de mal ?",
    { seen: 'ines' },
    "~ Tu lis. Tu ne réponds pas. Chaque jour, c'est un peu plus facile, et c'est ça le plus triste.",
  ], else: [
    { open: 'ines', day: 'Mardi 4 février', time: '20:00' },
    "ines: le 14 c'est le vernissage des projets à mon école. tu viens ?",
    "ines: ma médiathèque est exposée. y a les alcôves. tu sais, les fenêtres rondes",
    "> Je viendrai.",
  ] },
  { recap: true },
  { go: 'c10' },
];

STORY.c9_late_confess = [
  { open: 'ines', day: 'Jeudi 16 janvier', time: '01:02' },
  { set: 'confessed_late', log: 'Tu lui as tout avoué, par message, trop tard.' },
  "> Inès. J'aurais dû te le dire sous la neige. Je suis amoureux de toi. Depuis toujours.",
  "> Je te demande rien. Je voulais juste que ce soit dit.",
  { wait: 2000 },
  { typing: 'ines', ms: 4000, after: 1000 },
  { typing: 'ines', ms: 3000, after: 800 },
  "ines: pourquoi maintenant ?",
  "ines: je t'ai attendu, {nom}. sous la neige. je t'ai demandé si t'avais quelque chose à me dire",
  "ines: et maintenant je suis avec quelqu'un. et tu me dis ça à 1h du matin par message",
  { c: [
    { t: "Je sais. J'ai eu peur. Pardon.", fx: { conf: 1 } },
    { t: "Tu peux encore le quitter.", fx: { jal: 2, conf: -1 }, then: ["ines: non. je vais pas faire ça. pas comme ça."] },
  ] },
  "ines: laisse-moi un peu de temps. on se voit au vernissage le 14. on parlera",
  { recap: true },
  { go: 'c10' },
];

/* ==========================================================
   CHAPITRE 10 — Février
   ========================================================== */
STORY.c10 = [
  { ch: 10, title: 'Février', sub: 'Le 14' },
  { day: 'Vendredi 14 février', time: '09:00' },
  { if: v => v.jal >= 7, then: [{ go: 'c10_toxic' }] },
  { if: v => v.conf <= 1 || v.cut_off, then: [{ go: 'c10_ghost' }] },
  { music: 'happy' },
  { open: 'sam' },
  "sam: joyeuse Saint-Valentin frérot",
  { if: v => v.sam_helped || v.sam_party, then: ["sam: j'ai acheté 40 roses à Léa. elle m'a dit que c'était « un geste de psychopathe ». elle les a toutes mises dans des pots de confiture"] },
  "sam: tu vas au vernissage ce soir ?",
  { if: v => v.nora_film, then: [
    "sam: attends c'est pas ce soir aussi la projection de ta copine Nora ?",
    "> Si. 19h le vernissage, 20h la projection. À l'autre bout de la ville.",
    "sam: ah. bah t'as un choix à faire, mon grand",
  ] },
  { if: v => v.nora_film, then: [{ go: 'c10_choice' }] },
  { go: 'c10_expo' },
];

STORY.c10_choice = [
  { open: 'nora', time: '17:40', music: 'tense' },
  "nora: Je suis morte de trac.",
  "nora: Tu viens toujours ce soir ? 20h, cinéma Comoedia. Je te garde une place au premier rang.",
  { if: v => v.nora_love, then: ["nora: J'ai envie que tu sois là. Pas comme binôme."] },
  { c: [
    { t: "[Aller au vernissage d'Inès]", log: 'Le 14 février, tu as choisi le vernissage d’Inès.', then: [
      "> Nora, je suis désolé. Je dois aller au vernissage d'Inès. Je vais rater ta projection.",
      { wait: 1200 },
      { if: v => v.nora_love, then: [
        "nora: Ah.",
        "nora: Ok. Je comprends. Je crois que j'ai toujours compris.",
        "nora: Va. Et sois heureux, binôme. C'est un ordre.",
        { set: 'nora_hurt' },
      ], else: [
        "nora: C'est rien ! Je t'enverrai la vidéo. Bonne chance là-bas. Vraiment.",
      ] },
    ], go: 'c10_expo' },
    { t: "[Aller à la projection de Nora]", log: 'Le 14 février, tu as choisi la projection de Nora.', go: 'c10_nora' },
  ], prompt: 'Le vernissage ou la projection ?' },
];

STORY.c10_nora = [
  { scene: 'cinema', loc: 'Cinéma Comoedia · Festival Court-Circuit', music: null, amb: 'room', time: '19:55' },
  "~ La salle est pleine. Nora est au premier rang, raide comme un piquet, les mains écrasées entre ses genoux. Quand elle te voit arriver, tout son corps se détend d'un coup.",
  "nora: T'es venu. T'avais l'autre truc, et t'es venu.",
  { music: 'love' },
  "~ Le film commence. Treize minutes. Une fille enregistre la ville. Ta musique monte quand elle trouve enfin le bon son : celui de la voix de sa grand-mère, sur une vieille cassette.",
  "~ Dans le noir, Nora cherche ta main. Elle la trouve.",
  "~ Les lumières se rallument. Les applaudissements durent longtemps.",
  { if: v => v.nora >= 6, then: [
    "nora: Alors ? Pas bien. Excellent ?",
    { c: [
      { t: "Excellent. Toi, surtout.", fx: { nora: 1 }, then: [
        "~ Elle rit, ce rire grave et contagieux du studio B.",
        "nora: Viens. On va manger des frites. Et après on rentre à pied, et je te fais écouter la ville.",
      ] },
      { t: "Nora… je crois que je suis venu pour toi. Pas que pour le film.", fx: { nora: 2 }, then: [
        "nora: Je sais, idiot. Ça s'entendait.",
        "~ Elle t'embrasse devant tout le monde, sous l'affiche du festival.",
      ] },
    ] },
    { go: 'end_nora' },
  ] },
  "nora: Merci d'être venu. Vraiment.",
  "nora: Mais t'as regardé ton téléphone six fois. Comme au studio B, tu te souviens ?",
  "nora: Va la voir. T'as encore le temps. C'est pas un bruitage, ce que t'as pour elle. Ça se voit.",
  { fx: { nora: 0, conf: -1 }, set: 'late_expo' },
  { endscene: 'ines', amb: 'none' },
  { go: 'c10_expo' },
];

STORY.c10_expo = [
  { day: 'Vendredi 14 février', time: '19:10' },
  { if: v => v.late_expo, then: [{ time: '21:05' }] },
  { scene: 'gallery', loc: 'École d’architecture · Vernissage', music: 'night', amb: 'cafe' },
  { if: v => v.late_expo, then: ["~ Tu arrives en courant, à bout de souffle. Le vernissage touche à sa fin. Les gens rangent les gobelets."], else: ["~ Une grande halle blanche, des maquettes sur des socles, des étudiants en chemise qui expliquent leur projet à des parents émus."] },
  "~ La médiathèque d'Inès est au fond, sous une verrière. Petite, lumineuse, posée comme un bateau.",
  { if: v => v.idea_window, then: [
    "~ Sur un côté, des alcôves rondes. Des fenêtres rondes. Et sur le cartel, en petit :",
    "~ « Alcôves d'écoute. Idée originale de {nom}, qui écoute des vinyles en cachette. »",
  ] },
  { if: v => v.helped_ines || v.finished_alone, then: ["~ Tu reconnais le niveau 2. Celui que vous avez recollé ensemble à 5h du matin. Il tient toujours."] },
  "~ Inès te voit. Elle traverse la salle.",
  { if: v => v.together, then: [{ go: 'c10_together' }] },
  { if: v => v.needtime && !v.smothered, then: [{ go: 'c10_answer' }] },
  { if: v => v.needtime && v.smothered, then: [{ go: 'c10_friend' }] },
  { if: v => v.rejected_noel, then: [{ go: 'c10_friend' }] },
  { go: 'c10_lastchance' },
];

STORY.c10_together = [
  "ines: T'es là.",
  { if: v => v.late_expo, then: ["ines: T'es en retard. Deux heures. Tu sens le pop-corn.", "> J'étais à la projection de Nora. Je t'expliquerai.", "ines: Tu m'expliqueras. Mais t'es là."] },
  "ines: Viens. Je veux te montrer un truc que personne n'a vu.",
  "~ Elle t'entraîne vers la maquette. Elle soulève délicatement le toit de l'alcôve du fond.",
  "~ À l'intérieur, minuscules, deux figurines en carton sont assises côte à côte, devant une fenêtre ronde. L'une a une barbe dessinée au feutre.",
  "ines: C'est nous. Dans quarante ans. On écoute tes vinyles.",
  { c: [
    { t: "Dans quarante ans j'aurai enfin fini ma barbe.", fx: { aff: 1 }, then: ["ines: Le projet en cours. J'ai hâte de voir le résultat."] },
    { t: "[L'embrasser, au milieu du vernissage]", fx: { aff: 1 }, then: ["~ Un prof d'archi toussote. Léa siffle depuis l'autre bout de la salle. Vous vous en fichez complètement."] },
    { t: "Je t'aime, Inès. Merci d'avoir attendu que je sois moins lent.", fx: { aff: 1 } },
  ] },
  { go: 'end_love' },
];

STORY.c10_answer = [
  "ines: T'es venu.",
  { if: v => v.late_expo, then: ["ines: Tard. Mais t'es venu.", { fx: { aff: -1 } }] },
  "ines: J'ai beaucoup réfléchi. Six semaines. J'ai fait des listes. Léa a fait des listes. Même Sam a fait une liste.",
  "~ Elle prend une grande inspiration, comme avant de plonger.",
  { if: v => v.conf >= 6 && v.aff >= 7 && v.jal <= 2 && !v.nora_kiss, then: [
    "ines: Et à la fin, toutes les listes disaient la même chose.",
    "ines: Que t'étais là. À chaque fois. Au Comptoir, sur le balcon, à l'hôpital, sous la neige. Et même quand je t'ai demandé de pas être là, tu l'as été. En silence. Sans m'étouffer.",
    "ines: Alors c'est oui, {nom}. C'est oui.",
    { music: 'love', sfx: 'good' },
    "~ Elle t'embrasse sous la verrière, à côté des alcôves rondes. Quelque part, quelqu'un applaudit une maquette. Ou vous. Ça n'a pas d'importance.",
    { set: 'together' },
    { go: 'end_love' },
  ] },
  { if: v => v.nora_kiss, then: [
    "ines: Et puis Léa m'a dit qu'elle t'avait vu. Avec une fille. Nora, c'est ça ?",
    "ines: Je t'en veux pas. Je t'avais demandé du temps, t'avais le droit de vivre.",
    "ines: Mais ça m'a aidée à comprendre ce que je ressentais. Et ce que je ressens, c'est… de la tendresse. Pas de la jalousie.",
  ] },
  "ines: Et à la fin, je me suis rendu compte que je t'aime plus que tout. Mais comme on aime sa maison. Pas comme on tombe.",
  "ines: Je suis tellement désolée. Je voulais que ce soit l'autre réponse. J'ai essayé de me convaincre.",
  { go: 'c10_friend_choice' },
];

STORY.c10_friend = [
  "ines: T'es venu.",
  "ines: Ça me fait tellement plaisir. J'avais peur que tu viennes pas.",
  "~ Elle te montre chaque détail de la maquette. Elle parle vite, elle rit. Elle est heureuse que tu sois là. Heureuse comme une amie.",
  "ines: Je sais que c'est pas facile pour toi. Moi je veux juste te garder. Si tu veux bien.",
  { go: 'c10_friend_choice' },
];

STORY.c10_friend_choice = [
  "~ Tu regardes les petites fenêtres rondes. Ton idée, dans sa maquette, pour toujours.",
  { c: [
    { t: "Je veux bien. Tu m'as gardé une place près de la fenêtre. Ça me suffit.", req: v => (v.conf >= 5 || v.healthy_distance || v.sam_time) && v.fz < 8, then: [
      "~ Et pour la première fois, ce n'est pas un mensonge. Ça fait mal, et ça suffit quand même.",
      "ines: Toujours. C'est ta place. Enfin, c'est MA place. Mais je te la prête.",
    ], go: 'end_friends' },
    { t: "Je veux bien… je crois.", then: [
      "~ Tu souris. Elle sourit. Vous trinquez avec des gobelets de mauvais champagne.",
      "~ Tu rentres seul sous la pluie, en te demandant combien de temps on peut rester le meilleur ami de quelqu'un qu'on aime.",
    ], go: 'end_fz' },
    { t: "J'ai besoin de partir un moment. Pour vraiment guérir. Je reviendrai.", req: v => v.nora >= 6 && !v.nora_hurt, then: [
      "ines: Je comprends. Prends soin de toi. Vraiment.",
      "~ Tu sors dans la nuit. Ton téléphone vibre. « Nora : Alors ? Moi je mange des frites. Seule. C'est triste. Viens. »",
      "~ Tu souris. Pour la première fois depuis longtemps, tu as envie d'aller quelque part.",
    ], go: 'end_nora' },
  ] },
];

STORY.c10_lastchance = [
  "ines: T'es venu !",
  { if: v => v.back_max, then: ["~ Max est là, un peu en retrait, une coupe à la main. Il te fait un signe de tête. Tu le lui rends."], else: [
    { if: v => v.back_other, then: ["~ Un garçon brun aux lunettes rondes la suit des yeux. Adrien, sûrement. Il a l'air gentil. Évidemment."] },
  ] },
  "~ Elle te montre la maquette, les alcôves, la verrière. Elle te parle de lumière, de gens, de choses à vivre dedans.",
  { if: v => v.confessed_late, then: [
    "ines: Pour ton message… J'y ai beaucoup pensé.",
    "ines: Si tu me l'avais dit sous la neige, je crois… je crois que tout aurait été différent.",
    "ines: Mais on n'était pas prêts au même moment. C'est tout. C'est bête, hein ?",
    { go: 'end_late' },
  ] },
  "~ Tu regardes son visage éclairé par la verrière. C'est maintenant ou jamais. Encore une fois.",
  { c: [
    { t: "[Lui dire. Enfin. Ici.]", log: 'Tu lui as tout dit, le 14 février. Trop tard.', then: [
      "> Inès. Je suis amoureux de toi. Depuis toujours. J'aurais dû te le dire sous la neige.",
      "~ Elle se fige. Elle regarde vers l'autre bout de la salle, vers celui qui l'attend. Puis vers toi.",
      "ines: Oh, {nom}… Pourquoi tu me le dis maintenant ?",
      "ines: Je t'ai attendu. Tu sais combien de temps je t'ai attendu ?",
    ], go: 'end_late' },
    { t: "[Garder ça pour toi. La laisser être heureuse.]", then: [
      { if: v => (v.accepted || v.healthy_distance || v.sam_time) && v.fz < 8, then: [
        "~ Tu lui dis que sa maquette est la plus belle de l'école. C'est vrai. Elle te serre dans ses bras.",
        "~ Et en la regardant rejoindre l'autre, tu découvres que tu peux être heureux pour elle. Vraiment. Ça te surprend toi-même.",
        { go: 'end_friends' },
      ] },
      "~ Tu lui dis que sa maquette est la plus belle de l'école. Elle te serre dans ses bras. Tu serres les dents.",
    ], go: 'end_fz' },
  ] },
];

/* ---------- Fins sombres ---------- */
STORY.c10_ghost = [
  { music: 'sad', amb: 'rain' },
  { day: 'Vendredi 14 février', time: '21:40' },
  "~ 14 février. Tu n'as pas reçu d'invitation. Tu l'apprends en faisant défiler les stories, au fond de ton lit.",
  { open: 'ines' },
  { m: 'ines', t: "Story · « vernissage 🥂 merci à tous ceux qui étaient là »", img: { e: '🏛️', bg: 'linear-gradient(135deg,#efe4cf,#9b8a6b)' }, fast: true },
  "~ Sur la photo, Léa, Sam, des gens de son école. Sa maquette, avec les fenêtres rondes.",
  "~ Tu n'es pas sur la photo. Tu n'étais pas là. Elle ne t'a pas demandé d'y être.",
  { c: [
    { t: "Bravo pour ton expo. Elle a l'air magnifique.", then: [{ wait: 1500 }, "~ « Distribué. » Pas « Vu ». Juste « Distribué »."] },
    { t: "[Écrire un long message pour t'excuser de tout]", then: [
      "> Inès, je sais que j'ai disparu. Que je n'ai pas été là. Je voulais te dire pardon…",
      { wait: 2000 },
      "~ « Distribué. »",
    ] },
    { t: "[Ne rien écrire]", then: ["~ Tu poses le téléphone sur ta poitrine. Il ne vibre pas."] },
  ] },
  { go: 'end_ghost' },
];

STORY.c10_toxic = [
  { music: 'tense', amb: 'rain' },
  { open: 'ines' },
  "ines: faut qu'on parle",
  "ines: je peux t'appeler ?",
  { c: [
    { t: "Oui.", then: [] },
    { t: "Encore ?", fx: { jal: 1 }, then: [] },
  ] },
  { call: 'ines', out: true },
  { pickup: true },
  "ines: {nom}. J'ai réfléchi longtemps avant de t'appeler.",
  "ines: Les mensonges sur Max. Les questions. Les messages. Le café. Les reproches. Les regards.",
  "ines: Je sais que tu m'aimes. Je le sais. Mais ce que tu fais, c'est pas de l'amour. C'est de la peur qui crie.",
  "ines: Et j'arrive plus à respirer à côté de toi.",
  { c: [
    { t: "Je peux changer. S'il te plaît.", then: ["ines: Peut-être. Je l'espère. Vraiment. Mais pas avec moi à côté pour le vérifier."] },
    { t: "C'est toi qui m'as rendu comme ça.", fx: { jal: 1 }, then: ["ines: Non. Ça, c'est exactement ce que je veux plus entendre."] },
    { t: "[Ne rien dire]", then: ["~ Tu entends sa respiration. Elle pleure. Toi aussi."] },
  ] },
  "ines: Je vais prendre de la distance. Longtemps. Ne m'écris pas, s'il te plaît.",
  "ines: Prends soin de toi. Je le pense.",
  { hangup: '6 min' },
  { go: 'end_toxic' },
];

/* ---------- Épilogues ---------- */
STORY.end_love = [
  { endscene: 'ines', amb: 'none', music: 'love', day: 'Six mois plus tard', time: '23:12' },
  "~ Six mois plus tard.",
  { lock: true },
  "ines: t'es réveillé ?",
  { unlock: 'ines' },
  "> Tu es à côté de moi, Inès.",
  "ines: je sais. je voulais juste t'écrire ça. à 23h12. pour la tradition",
  { m: 'ines', t: "", img: { e: '🌙', bg: 'linear-gradient(135deg,#1c1640,#ff6b8b)' } },
  { end: 'E1' },
];

STORY.end_friends = [
  { endscene: 'ines', amb: 'none', music: 'happy', day: 'Six mois plus tard', time: '19:30' },
  "~ Six mois plus tard.",
  { open: 'ines' },
  "ines: soirée jeux chez toi ce soir ? Sam a dit que Gérard voulait sa revanche au Uno",
  "> Gérard est un tricheur. Mais oui.",
  "ines: et ramène la fille dont tu me parles tout le temps. je veux la rencontrer. c'est un ORDRE de meilleure amie",
  "~ Tu souris. Elle a raison. Il y a quelqu'un, peut-être. Et pour la première fois, tu as envie de le lui raconter.",
  { end: 'E2' },
];

STORY.end_fz = [
  { endscene: 'ines', amb: 'rain', music: 'sad', day: 'Six mois plus tard', time: '23:12' },
  "~ Six mois plus tard.",
  { lock: true },
  "ines: t'es réveillé ?",
  "ines: question sérieuse. est-ce que c'est normal de stresser avant un premier week-end en amoureux ?",
  "ines: t'es le seul à qui je peux demander ça. t'es mon meilleur ami ❤",
  { unlock: 'ines' },
  { c: [
    { t: "C'est normal. Ça va être super. ❤", then: [] },
  ] },
  "~ Tu poses le téléphone. Tu fixes le plafond. Six ans. Sept, maintenant.",
  { end: 'E3' },
];

STORY.end_late = [
  { endscene: 'ines', amb: 'street', music: 'sad', time: '23:12' },
  "~ Tu rentres à pied, le long de la Saône. Tout ce que tu n'as pas dit à temps marche à côté de toi.",
  { lock: true },
  "ines: je suis contente que tu l'aies dit. même tard",
  "ines: ça compte. ça comptera toujours",
  "ines: on reste nous ?",
  { unlock: 'ines' },
  "> On reste nous.",
  { end: 'E5' },
];

STORY.end_nora = [
  { endscene: 'nora', amb: 'none', music: 'love', day: 'Six mois plus tard', time: '02:14' },
  "~ Six mois plus tard.",
  "nora: Réveille-toi. Il pleut.",
  "nora: Prends le micro. On va enregistrer la pluie sur les quais, c'est la meilleure de l'année.",
  "> Il est 2h du matin, Nora.",
  "nora: Les meilleurs sons arrivent à 2h du matin. Et les meilleures personnes aussi. Je t'attends en bas.",
  { end: 'E6' },
];

STORY.end_ghost = [
  { end: 'E4' },
];

STORY.end_toxic = [
  "~ Le silence, après. Un vrai silence, cette fois. Aucune vibration.",
  { end: 'E7' },
];
