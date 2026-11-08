'use strict';
CHAPTERS.push(
  { n: 4, node: 'c4', title: 'Appel manqué', sub: 'Fin octobre' },
  { n: 5, node: 'c5', title: 'Les masques', sub: 'Halloween' },
  { n: 6, node: 'c6', title: 'Vingt ans', sub: 'Novembre' },
);

/* ==========================================================
   CHAPITRE 4 — Appel manqué
   ========================================================== */
STORY.c4 = [
  { ch: 4, title: 'Appel manqué', sub: 'Fin octobre' },
  { day: 'Mardi 22 octobre', time: '12:47', music: 'happy' },
  { open: 'maman' },
  "maman: Coucou mon chéri",
  "maman: Ton père a acheté un drone.",
  "maman: Il l'a déjà coincé dans le cerisier.",
  "maman: Est-ce que tu manges des légumes ? Réponds honnêtement.",
  { c: [
    { t: "Oui maman. Des céleris, même.", then: ["maman: Des céleris ?? Qui mange des céleris ??", "> C'est pour la fac. Long story.", "maman: Je ne veux pas savoir."] },
    { t: "Les frites c'est un légume ?", then: ["maman: Je vais t'envoyer un colis de soupe.", "maman: C'est une menace."] },
  ] },
  "maman: Et la petite Inès ? Tu la vois ? Sa mère m'a dit que son papa n'était pas très en forme.",
  "maman: Fais attention à elle, d'accord ? Elle fait la forte mais c'est une sensible.",
  "> Je sais, maman.",
  "maman: Je sais que tu sais. Bisous. Mange une pomme.",
  { open: 'ines' },
  { day: 'Mercredi 23 octobre', time: '19:30' },
  "ines: question de la plus haute importance",
  "ines: on fait quoi en duo pour Halloween cette année ?",
  "ines: on a une TRADITION, je te rappelle. depuis la 6e. on n'a jamais raté une année",
  "ines: Max fait une grosse soirée dans son loft le 31",
  { c: [
    { t: "Le Soleil et la Lune. Toi la Lune, évidemment.", fx: { aff: 1 }, set: { costume: 'lune' }, log: 'Halloween : le Soleil et la Lune.', then: [
      "ines: oh c'est trop beau ça",
      "ines: attends c'est pas un peu... romantique ?",
      { c: [
        { t: "C'est cosmique, nuance.", fx: { aff: 1 }, then: ["ines: cosmique. ok. j'achète des paillettes"] },
        { t: "Un peu. Ça te dérange ?", fx: { aff: 1, fz: -1 }, then: [{ typing: 'ines', ms: 2000 }, "ines: non", "ines: ça me dérange pas du tout"] },
      ] },
    ] },
    { t: "Deux fantômes en drap. Comme en 6e. Retour aux sources.", fx: { conf: 1, fz: 1 }, set: { costume: 'fantomes' }, log: 'Halloween : deux fantômes en drap, comme en 6e.', then: [
      "ines: NOOON les draps troués 😭 avec les yeux mal découpés",
      "ines: t'avais foncé dans un lampadaire",
      "ines: ok c'est parfait. on refait",
    ] },
    { t: "Cette année je crois que je vais pas faire de duo.", fx: { aff: -2 }, set: { costume: 'solo' }, log: 'Tu as brisé la tradition du duo d’Halloween.', then: [
      "ines: ah",
      "ines: ok",
      { wait: 800 },
      "ines: bon bah je demanderai à Léa",
      { mem: 'Tu as brisé une tradition de six ans.' },
    ] },
  ] },
  { go: 'c4_night' },
];

STORY.c4_night = [
  { day: 'Samedi 26 octobre', time: '02:47', music: 'tense', amb: 'room' },
  "~ Samedi 26 octobre. Nuit noire. Tu dors profondément, enfin.",
  "~ Quelque part dans le noir, une vibration.",
  { lock: true },
  { call: 'ines' },
  { c: [
    { t: "[Décrocher]", go: 'c4_call' },
    { t: "[Laisser sonner. Tu dors à moitié.]", timeout: true, go: 'c4_missed' },
  ], timer: 9, prompt: 'Inès t’appelle à 2h47…' },
];

STORY.c4_call = [
  { pickup: true },
  "> ...Allô ? Inès ?",
  "~ D'abord, rien. Une respiration hachée. Puis sa voix, qui ne ressemble pas à sa voix.",
  "ines: {nom}... c'est mon père.",
  "ines: Ma mère vient d'appeler. Il a fait un malaise cardiaque. Ils l'ont emmené au CHU de Grenoble. Ils vont l'opérer.",
  "ines: Je sais pas s'il va... Je suis à Lyon, je peux rien faire, le premier train c'est à 5h42 et...",
  "~ Elle pleure. Tu es complètement réveillé.",
  { c: [
    { t: "Je viens avec toi. Je te rejoins à Part-Dieu à 5h30.", fx: { conf: 2 }, set: 'went_hospital', log: 'Tu as accompagné Inès à Grenoble en pleine nuit.', mem: 'Inès s’en souviendra toute sa vie.', go: 'c4_train' },
    { t: "Je reste au téléphone avec toi. Jusqu'au train. Respire.", fx: { conf: 1, aff: 1 }, set: 'stayed_phone', log: 'Tu es resté au téléphone avec Inès jusqu’à l’aube.', go: 'c4_phone' },
    { t: "Il va s'en sortir, t'inquiète. Les médecins sont forts.", fx: { conf: -1 }, then: [
      "ines: tu sais pas ça.",
      "ines: personne sait.",
      "> Pardon. Pardon, je voulais te rassurer. Tu veux que je vienne avec toi ?",
      "ines: ...oui. s'il te plaît.",
      { fx: { conf: 2 }, set: 'went_hospital', log: 'Tu as accompagné Inès à Grenoble en pleine nuit.' },
    ], go: 'c4_train' },
  ] },
];

STORY.c4_missed = [
  { missed: 'ines' },
  { fx: { conf: -2 }, set: 'missed_call', log: 'Tu n’as pas décroché quand Inès t’a appelé à 2h47.' },
  "~ Le téléphone se tait. Tu te rendors.",
  { wait: 800 },
  "ines: c'est rien",
  "ines: dors",
  { day: 'Samedi 26 octobre', time: '08:31', music: 'sad', amb: 'none' },
  "~ 8h31. Tu ouvres un œil. Tu vois l'appel manqué. Puis le reste.",
  "ines: je suis dans le train pour Grenoble",
  "ines: mon père a fait un malaise cardiaque cette nuit. ils l'opèrent ce matin",
  "ines: je voulais juste entendre une voix. c'est pas grave",
  { unlock: 'ines' },
  { c: [
    { t: "Inès je suis tellement désolé. Je dormais. Je prends le prochain train.", fx: { conf: 1 }, set: 'went_late', log: 'Tu l’as rejointe à Grenoble, avec quelques heures de retard.', then: [
      "ines: t'es pas obligé",
      "> Je sais. J'arrive.",
      "ines: ...ok. CHU Nord, 4e étage, cardio",
    ], go: 'c4_hosp' },
    { t: "Je suis désolé. Tiens-moi au courant, s'il te plaît. Je pense fort à toi.", go: 'c4_phone_late' },
    { t: "Appelle-moi quand tu peux. Je décroche, cette fois. Toujours.", fx: { conf: 1 }, go: 'c4_phone_late' },
  ] },
];

STORY.c4_train = [
  { hangup: '41 min' },
  { scene: 'station', loc: 'Gare de la Part-Dieu · 5h28', music: 'sad', amb: 'street', time: '05:28' },
  "~ La gare est vide et jaune. Un agent de propreté passe la serpillière en chantonnant.",
  "~ Inès est sous le panneau des départs, emmitouflée dans un manteau trop grand. Quand elle te voit, elle court.",
  "~ Elle ne dit rien. Elle se colle à toi. Elle tremble.",
  { scene: 'train', loc: 'TER Lyon → Grenoble · 6h10', amb: 'street' },
  "~ Dans le train, elle s'endort sur ton épaule au bout de vingt minutes. Sa main serre la manche de ton pull.",
  "~ Par la fenêtre, les montagnes sortent de la nuit, bleues puis roses.",
  "~ Tu n'oses pas bouger. Tu as une crampe dans le bras dès Bourgoin-Jallieu. Tu ne bouges pas.",
  { go: 'c4_hosp' },
];

STORY.c4_hosp = [
  { scene: 'hospital', loc: 'CHU Grenoble Alpes · Cardiologie', amb: 'hospital', music: 'sad', time: '10:15' },
  "~ L'opération a duré trois heures. Le chirurgien est sorti en souriant à moitié : « Il a eu de la chance. Il va falloir qu'il change de vie. »",
  "~ La mère d'Inès pleure de soulagement dans les bras de sa sœur. Inès, elle, est assise devant la machine à café du couloir, immobile.",
  { if: v => v.went_late, then: ["~ Tu es arrivé à midi. Elle t'a vu au bout du couloir et elle a souri, fatiguée. « T'es venu quand même. »"] },
  "ines: Max m'a écrit « courage ❤ ». C'est gentil.",
  "ines: Mais c'est toi qui es là.",
  { c: [
    { t: "[Prendre sa main]", fx: { aff: 1, conf: 1 }, then: ["~ Elle entrelace ses doigts aux tiens. Elle ne lâche plus. Ses mains sont glacées."] },
    { t: "[Lui acheter un chocolat chaud dégueulasse à la machine]", fx: { aff: 1 }, then: [
      "~ La machine rend un liquide brun tiède qui sent le carton.",
      "ines: C'est le pire chocolat chaud de ma vie.",
      "ines: Merci. Vraiment.",
      "~ Elle rit enfin. Juste un peu. C'est assez.",
    ] },
    { t: "Je serai toujours là pour toi. Toujours.", fx: { conf: 1, fz: 1 }, then: ["ines: Je sais. Mon grand frère de cœur.", "~ Elle pose sa tête contre toi. Le mot « frère » reste suspendu dans le couloir."] },
  ] },
  "~ Une infirmière vous fait signe. Il est réveillé. Il demande sa fille. Et, curieusement, « le petit {nom} ».",
  { scene: 'hospital', loc: 'Chambre 412', amb: 'hospital' },
  "papa: Le petit {nom}... T'as grandi, toi. T'as une barbe ?",
  "> C'est un projet en cours, monsieur Moreau.",
  "papa: Hé. Je suis encore là, ma puce. T'inquiète pas.",
  "~ Inès sort chercher sa mère. Tu te retrouves seul avec lui. Il te regarde avec ses yeux fatigués et rusés.",
  "papa: Toujours collé à ma fille, hein ? Depuis la 6e.",
  { c: [
    { t: "C'est plutôt elle qui me supporte.", fx: { aff: 0 }, then: ["papa: Ha. Elle dit pareil de toi."] },
    { t: "Promis, je prends soin d'elle.", fx: { conf: 1 }, then: ["papa: Je sais, mon grand. C'est pour ça que je dors tranquille."] },
    { t: "Monsieur Moreau... Je…", fx: { aff: 1 }, set: 'dad_knows', log: 'Le père d’Inès a deviné tes sentiments.', then: [
      "~ Tu ne finis pas ta phrase. Il sourit.",
      "papa: Je sais, mon grand. Je sais. Tout le monde le sait, sauf elle.",
      "papa: Enfin. Peut-être qu'elle le sait aussi. Les Moreau sont lents, mais pas idiots.",
      { mem: 'Le père d’Inès a tout compris.' },
    ] },
  ] },
  "papa: Et appelle-moi Philippe. J'ai failli mourir, on peut se tutoyer.",
  { endscene: 'ines', amb: 'none', day: 'Dimanche 27 octobre', time: '22:15', music: 'night' },
  "ines: il mange de la purée et il se plaint. c'est bon signe",
  "ines: {nom}",
  "ines: merci. pour tout.",
  "ines: je sais pas ce que j'aurais fait sans toi",
  { c: [
    { t: "Tu aurais été forte. Comme toujours. Mais je suis content d'avoir été là.", fx: { conf: 1 } },
    { t: "Tu n'auras jamais à le savoir.", fx: { aff: 1 } },
  ] },
  { go: 'c4_end' },
];

STORY.c4_phone = [
  "~ Tu ne raccroches pas. Tu lui parles de tout et de rien. Du drone de ton père coincé dans le cerisier. De Sam qui ronfle. De la 6e.",
  "ines: tu te souviens du jour où on s'est rencontrés ?",
  { c: [
    { t: "Tu m'avais piqué ma place près de la fenêtre. Et t'avais refusé de bouger.", fx: { aff: 1 }, then: ["ines: c'était MA place. j'étais arrivée la première", "> T'avais posé ta trousse dessus depuis le couloir.", "ines: ça compte", "~ Pour la première fois de la nuit, elle rit."] },
    { t: "Bien sûr. Tu pleurais parce que t'avais perdu ton cartable.", fx: { conf: 1 }, then: ["ines: et tu l'avais retrouvé dans les toilettes des garçons. héros national"] },
  ] },
  { time: '05:20' },
  "ines: le taxi est là. je vais à la gare",
  "ines: merci d'être resté. toute la nuit.",
  { hangup: '2 h 33 min' },
  { day: 'Samedi 26 octobre', time: '13:40', music: 'sad' },
  "ines: il est sorti du bloc. ça s'est bien passé",
  { m: 'ines', voice: '0:19', t: "Il a demandé de tes nouvelles en se réveillant, je te jure. Il a dit « et le petit, il a toujours sa barbe ridicule ? ». Je t'embrasse. Merci d'avoir été là cette nuit." },
  { c: [
    { t: "Dis-lui que la barbe évolue bien.", fx: { aff: 1 } },
    { t: "Je suis tellement soulagé. Repose-toi.", fx: { conf: 1 } },
  ] },
  { go: 'c4_end' },
];

STORY.c4_phone_late = [
  { seen: 'ines' },
  { day: 'Samedi 26 octobre', time: '15:20' },
  "~ Elle ne répond pas avant le milieu de l'après-midi.",
  "ines: opération réussie",
  "ines: Max est venu. il a pris sa voiture et il a roulé jusqu'à Grenoble. il a ramené des fleurs",
  "~ Max est venu. Toi, tu dormais.",
  { fx: { jal: 1 }, set: 'max_came' },
  { c: [
    { t: "C'est cool de sa part. Je suis content que t'aies pas été seule.", fx: { conf: 1, fz: 1 } },
    { t: "Ah. Super. 👍", fx: { jal: 1, conf: -1 }, then: ["ines: ?", "ines: t'es fâché ?", "> Non. Fatigué."] },
    { t: "J'aurais dû être là. Je m'en veux.", fx: { conf: 1 }, then: ["ines: t'étais là au début de l'année. pour le reste. c'est pas grave", "~ Ça a l'air grave quand même."] },
  ] },
  { go: 'c4_end' },
];

STORY.c4_end = [
  { day: 'Lundi 28 octobre', time: '20:00', music: 'happy' },
  { open: 'sam' },
  { if: v => v.went_hospital || v.went_late, then: [
    "sam: t'es rentré ? comment va son père ?",
    "> Opéré. Il va bien. Il m'a demandé de le tutoyer.",
    "sam: frère t'as été adopté par le beau-père avant même d'être avec la fille",
    "sam: c'est soit génial soit le pire scénario de la friendzone. je sais pas encore",
  ], else: [
    "sam: t'as l'air bizarre depuis samedi",
    { c: [
      { t: "J'ai raté un appel important. Je m'en veux.", fx: { sam: 1 }, then: ["sam: ça arrive mec. ce qui compte c'est ce que tu fais après"] },
      { t: "Rien. Ça va.", then: ["sam: ok « rien »"] },
    ] },
  ] },
  "sam: au fait, t'es en quoi pour Halloween ?",
  { if: v => v.costume === 'lune', then: ["> En soleil.", "sam: en soleil. et Inès en lune ? oh la la. vous êtes des bébés"] },
  { if: v => v.costume === 'fantomes', then: ["> En fantôme. Drap troué.", "sam: comme en 6e ? c'est mignon et un peu triste à la fois"] },
  { if: v => v.costume === 'solo', then: ["> Aucune idée. Peut-être pas de déguisement.", "sam: t'as pas fait le duo avec Inès ?? la TRADITION ?", "> Long story.", "sam: aïe"] },
  { recap: true },
  { go: 'c5' },
];

/* ==========================================================
   CHAPITRE 5 — Les masques
   ========================================================== */
STORY.c5 = [
  { ch: 5, title: 'Les masques', sub: 'Halloween' },
  { day: 'Jeudi 31 octobre', time: '22:30' },
  { scene: 'loft', loc: 'Le loft de Max · Vaise', music: 'party', particles: 'lights' },
  "~ Le loft de Max est immense. Briques rouges, plantes géantes, une boule à facettes en forme de crâne. Deux cents personnes déguisées.",
  { if: v => v.costume === 'lune', then: [
    "~ Inès est en Lune : robe argentée, paillettes sur les pommettes, un croissant doré dans les cheveux. Tu es en Soleil, avec une couronne en carton qui perd ses rayons.",
    "ines: On est les plus beaux. C'est objectif.",
    "lea: Vous êtes ridicules. Ridiculement mignons. Je vais vomir.",
  ] },
  { if: v => v.costume === 'fantomes', then: [
    "~ Deux draps blancs troués. Vous êtes les seuls à ne pas avoir fait d'effort, et les seuls à être morts de rire.",
    "ines: Hé. Fais gaffe aux lampadaires.",
    "> Il n'y a pas de lampadaire dans un loft.",
    "~ Tu te prends un poteau. Elle s'effondre de rire sous son drap.",
  ] },
  { if: v => v.costume === 'solo', then: [
    "~ Tu es venu sans déguisement. Inès est en sorcière, avec Léa. Elle te fait un petit signe, poli. Comme à un ancien camarade de classe.",
    { fx: { aff: -1 } },
  ] },
  "~ Max est en vampire. Évidemment. Il est même crédible. Il passe derrière les platines et la salle hurle.",
  "~ Vers minuit, Inès t'attrape par le bras et t'emmène sur le toit-terrasse.",
  { go: 'c5_roof' },
];

STORY.c5_roof = [
  { scene: 'rooftop', loc: 'Le toit · 23h52', music: 'night', muffle: true, time: '23:52' },
  "~ La ville est orange et froide. En bas, la soirée gronde comme un orage enfermé.",
  "ines: Faut que je te parle d'un truc. Et je veux ton avis. Ton vrai avis.",
  "ines: Max m'a demandé de sortir avec lui. Genre, officiellement. Ce soir.",
  "ines: Il est gentil. Il est drôle. Il est venu me chercher des fleurs quand…",
  "~ Elle s'arrête. Elle tire sur une paillette collée à sa joue.",
  "ines: Tu en penses quoi ?",
  { c: [
    { t: "S'il te rend heureuse, fonce. Tu le mérites.", fx: { fz: 2, conf: 1 }, set: { max_op: 'support', ines_max: true }, log: 'Tu lui as dit de foncer avec Max.', then: [
      "ines: ...Ouais. T'as raison.",
      "ines: Merci. T'es vraiment le meilleur ami du monde.",
      "~ Elle te serre dans ses bras. Tu regardes par-dessus son épaule la ville qui s'en fiche.",
    ] },
    { t: "Honnêtement ? Ça me fait un truc que tu me demandes ça.", fx: { aff: 1 }, then: [
      "ines: Un truc ?",
      "ines: Quel genre de truc ?",
      { c: [
        { t: "[Tout lui dire]", go: 'c5_confess' },
        { t: "Rien. Laisse tomber. C'est la fatigue.", fx: { fz: 1 }, set: { ines_max: true, c5_ambig: true }, log: 'Tu as failli lui dire, sur le toit. Tu as reculé.', then: [
          "ines: ...D'accord.",
          "~ Elle te regarde comme si elle avait vu une porte s'entrouvrir, puis se refermer.",
        ] },
      ], timer: 10, prompt: 'Elle attend. Le vent souffle.' },
    ] },
    { t: "Max ? Il drague tout ce qui bouge, tu le sais pas ?", fx: { jal: 2, conf: -1 }, set: { max_op: 'sabotage', sabotage: true, ines_max: true }, log: 'Tu as menti sur Max pour la décourager.', then: [
      "ines: Quoi ? Qui t'a dit ça ?",
      { c: [
        { t: "Des gens. Je dis ça pour toi.", fx: { jal: 1 } },
        { t: "...Personne. Pardon. J'ai dit n'importe quoi.", fx: { jal: -2, conf: 1 }, set: { sabotage: false }, then: ["ines: Ok. Bizarre, mais ok."] },
      ] },
      "~ Elle te dévisage. Elle n'est pas idiote. Elle sent quelque chose, mais pas ce que tu voudrais.",
    ] },
    { t: "Pourquoi tu me demandes ça, à moi ?", fx: { aff: 1 }, then: [
      "ines: Parce que ton avis compte plus que celui des autres. Voilà. Pourquoi tu demandes pourquoi ?",
      { c: [
        { t: "Alors mon avis, c'est que je préférerais que tu dises non.", fx: { aff: 1, fz: -1 }, then: [
          "~ Silence. Elle te fixe.",
          "ines: ...Pourquoi ?",
          { c: [
            { t: "[Tout lui dire]", go: 'c5_confess' },
            { t: "Parce qu'il a mis la Macarena à ta crémaillère.", fx: { aff: 1 }, set: { ines_max: true, c5_ambig: true }, then: [
              "~ Elle éclate de rire, mais quelque chose dans ses yeux ne rit pas.",
              "ines: T'es con. Tu sais que t'es con ?",
            ] },
          ] },
        ] },
        { t: "Mon avis, c'est que tu dois faire ce que tu veux, toi.", fx: { fz: 1, conf: 1 }, set: { ines_max: true }, then: ["ines: Ce que je veux. Ouais. Si seulement je savais."] },
      ] },
    ] },
  ] },
  { go: 'c5_midnight' },
];

STORY.c5_confess = [
  { set: { confessed_early: true }, log: 'Tu lui as dit que tu l’aimais, sur le toit, le soir d’Halloween.' },
  "~ Tu respires. Le vent emporte un rayon de ta couronne, ou un pan de ton drap, ou rien du tout.",
  "> Inès. Je suis amoureux de toi.",
  "> Depuis longtemps. Peut-être depuis la place près de la fenêtre. Je voulais pas te le dire comme ça, un soir d'Halloween, sur un toit. Mais tu m'as demandé mon vrai avis.",
  { if: v => v.confessed_drunk, then: [
    "> Et tu m'avais dit de te le redire quand tu serais pas bourrée. T'as bu qu'un verre. Ça compte.",
  ] },
  "~ Elle ne bouge pas. En bas, la musique s'arrête puis repart.",
  { if: v => v.aff >= 8 && v.conf >= 6 && v.jal <= 2, then: [
    "ines: Je… Je savais. Enfin, je crois que je savais. Je faisais semblant de pas savoir.",
    "ines: Je vais dire non à Max. Pas que pour toi. Enfin… pas que.",
    "ines: Mais j'ai besoin de temps, {nom}. T'es la personne la plus importante de ma vie. Si on se trompe, je perds tout.",
    { c: [
      { t: "Prends tout le temps qu'il te faut. Je bouge pas.", fx: { conf: 2 }, set: { slowburn: true, ines_max: false }, mem: 'Inès a besoin de temps. Tu as dit que tu attendrais.' },
      { t: "Du temps ? Ça fait six ans que j'attends.", fx: { jal: 1, aff: -1 }, set: { slowburn: true, ines_max: false }, then: ["ines: Je sais. Pardon. Je… pardon.", "~ Tu regrettes aussitôt. Elle aussi, on dirait."] },
    ] },
  ], else: [
    { if: v => v.aff >= 6, then: [
      "ines: {nom}…",
      "ines: Je sais pas quoi te dire. Je t'aime. Mais je sais pas comment. Je sais pas si c'est… ça.",
      "ines: Et Max est là, et il est simple, et toi t'es… toi. T'es compliqué parce que t'es tout.",
      "ines: J'ai besoin de savoir. Je crois que je vais lui dire oui. Pour savoir. C'est horrible, hein ?",
      { c: [
        { t: "C'est pas horrible. C'est honnête. Je préfère ça.", fx: { conf: 2 }, set: { ines_max: true, confess_mid: true } },
        { t: "Ouais. C'est horrible.", fx: { jal: 1, conf: -1 }, set: { ines_max: true, confess_mid: true }, then: ["~ Elle baisse les yeux. Tu as dit la vérité. Ça ne fait de bien à personne."] },
      ] },
    ], else: [
      "ines: Oh, {nom}…",
      "ines: Je t'aime fort. Tellement fort. Mais pas… pas comme ça. Je crois.",
      "ines: Pardon. Je veux pas te perdre. S'il te plaît, dis-moi que je te perds pas.",
      { c: [
        { t: "Tu me perds pas. Jamais.", fx: { fz: 2, conf: 1 }, set: { ines_max: true, rejected_early: true } },
        { t: "J'ai besoin d'un peu de temps. Mais tu me perds pas.", fx: { conf: 1 }, set: { ines_max: true, rejected_early: true, healthy_distance: true }, mem: 'Tu as pris soin de toi.' },
      ] },
    ] },
  ] },
  { go: 'c5_midnight' },
];

STORY.c5_midnight = [
  { muffle: false, music: 'party', scene: 'loft', loc: 'Le loft · Minuit', particles: 'lights', time: '00:04' },
  { if: v => v.slowburn, then: [
    "~ Vous redescendez. Elle évite Max, puis lui parle dans un coin. Il hoche la tête, il sourit tristement. Il est classe, même pour ça.",
    "~ Puis elle revient vers toi et prend ta main.",
    "ines: On s'en va ? J'ai envie de marcher.",
    { scene: 'street', loc: 'Quais de Saône · 1h', amb: 'street', music: 'night', time: '01:00' },
    "~ Vous marchez le long de la Saône, toi en soleil défraîchi ou en fantôme froissé, elle en tenant ta main sans rien dire.",
    "~ Devant sa porte, elle hésite. Elle t'embrasse sur la joue. Très près du coin de la bouche.",
    "ines: Merci d'avoir eu le courage. Moi je l'ai pas encore.",
    { mem: 'Ce soir, quelque chose a commencé.' },
    { go: 'c5_end' },
  ] },
  "~ Le compte à rebours de minuit est passé. Max fait monter la musique. Les gens hurlent.",
  "~ Et à travers la foule, tu les vois. Inès et Max, près des platines. Il dit quelque chose à son oreille. Elle rit. Il l'embrasse.",
  "~ Elle l'embrasse en retour.",
  { fx: { jal: 1 } },
  { if: v => v.sam_party || v.sam >= 6, then: ["~ Sam, déguisé en hot-dog, apparaît à côté de toi. Il ne dit rien. Il te tend une bière. C'est exactement ce qu'il fallait."] },
  { c: [
    { t: "[Partir sans rien dire]", fx: { conf: -1 }, set: 'left_halloween', then: [
      "~ Tu prends ton manteau. Tu descends les escaliers en sautant les marches. Dehors, il fait froid et c'est bien.",
    ] },
    { t: "[Rester. Sourire. Faire semblant.]", fx: { fz: 1 }, then: [
      "~ Tu restes jusqu'à 3h. Tu souris sur toutes les photos. Tu danses même avec Léa.",
      "~ Quand Inès vient te voir, rayonnante, tu lui dis « je suis content pour toi ». Tu as presque l'air de le penser.",
    ] },
    { t: "[Écrire à Nora]", req: v => v.nora >= 3, fx: { nora: 1 }, go: 'c5_nora' },
    { t: "[Aller voir Max et lui dire deux mots]", fx: { jal: 2 }, then: [
      "~ Tu traverses la foule. Max te voit arriver et te sourit. « Hé, le Soleil ! Ça va ? »",
      { c: [
        { t: "Fais-lui du mal et je te tue.", fx: { jal: 1 }, then: ["max: Woh. Ok. Message reçu, grand frère.", "~ Inès a tout entendu. Elle te regarde comme un inconnu.", { fx: { conf: -1 } }] },
        { t: "...Prends soin d'elle. C'est tout.", fx: { jal: -2, conf: 1 }, then: ["max: Promis, mec. Elle me parle tout le temps de toi, tu sais.", "~ Il te tape sur l'épaule. Tu n'arrives même pas à le détester. C'est le pire."] },
      ] },
    ] },
  ] },
  { go: 'c5_end' },
];

STORY.c5_nora = [
  { endscene: 'nora', time: '00:21' },
  "> T'es où ce soir ?",
  "nora: Chez moi. Marathon de films d'horreur italiens. Je suis à mon troisième Argento.",
  "nora: Pourquoi ? T'es pas à une soirée de gens beaux et déguisés ?",
  "> Si. C'est ça le problème.",
  { wait: 800 },
  "nora: Viens. J'ai du pop-corn et un canapé qui sent le chat.",
  "nora: Et je pose aucune question. Sauf si tu veux.",
  { scene: 'bedroom', loc: 'Chez Nora · Guillotière', music: 'night', amb: 'rain', particles: 'rain', time: '01:02' },
  "~ Nora habite un studio rempli de VHS, de plantes mortes et d'un chat obèse nommé Fulci.",
  "~ Vous regardez Suspiria sous un plaid. Elle te passe le pop-corn sans détacher les yeux de l'écran.",
  "nora: T'as le droit d'être triste, tu sais. C'est pas un bruitage, ça se remarque.",
  { c: [
    { t: "Elle a embrassé quelqu'un. Devant moi. Et j'ai rien dit pendant six ans.", fx: { nora: 1 }, then: ["nora: Ah. Le bruitage de l'amitié.", "nora: Je suis désolée, binôme. Vraiment.", "~ Elle pose sa tête sur ton épaule. Juste comme ça. Fulci ronronne."] },
    { t: "Je préfère regarder le film.", then: ["nora: Bon choix. Regarde, là, elle va se faire tuer par du fil barbelé. Ça remonte le moral."] },
  ] },
  { set: 'nora_halloween', log: 'Tu as fini la nuit d’Halloween chez Nora.' },
  { go: 'c5_end' },
];

STORY.c5_end = [
  { endscene: 'ines', amb: 'none', day: 'Vendredi 1er novembre', time: '14:20', music: 'night' },
  { if: v => v.slowburn, then: [
    "ines: j'ai pas dormi",
    "ines: je fais que penser",
    "ines: c'est pas une mauvaise chose. c'est juste beaucoup",
    "> Je sais. Pas de pression.",
    "ines: merci. on peut continuer comme avant pour l'instant ? juste un peu ?",
    { c: [
      { t: "Comme avant. Avec un petit bonus.", fx: { aff: 1 }, then: ["ines: un petit bonus 🙈"] },
      { t: "Comme avant. Promis.", fx: { conf: 1 } },
    ] },
  ], else: [
    { if: v => v.sabotage, then: [
      "ines: Max m'a dit qu'il avait eu une seule copine en 3 ans",
      "ines: Léa le connaît depuis le lycée. elle confirme",
      "ines: pourquoi t'as dit ça ?",
      { c: [
        { t: "J'étais jaloux. Pardon. C'était nul.", fx: { conf: 1, jal: -1, aff: 1 }, set: 'admitted_jealous', then: [
          "ines: ...jaloux",
          { typing: 'ines', ms: 3000 },
          "ines: ok. merci de le dire. ne refais jamais ça",
        ] },
        { t: "On m'avait dit ça. Je voulais te protéger.", fx: { conf: -2, jal: 1 }, set: 'lied_again', then: ["ines: arrête. t'as pas besoin de me protéger de mes choix", { seen: 'ines' }] },
      ] },
    ] },
    { if: v => v.confessed_early && !v.slowburn, then: [
      "ines: est-ce qu'on est toujours nous ?",
      "ines: après hier",
      { c: [
        { t: "Toujours. Ça change rien.", fx: { fz: 1 }, then: ["ines: ok. ok. tant mieux ❤"] },
        { t: "Ça change un peu. Mais on va trouver comment.", fx: { conf: 1 }, then: ["ines: oui. on va trouver."] },
      ] },
    ] },
    { if: v => !v.confessed_early && !v.sabotage, then: [
      "ines: t'es parti tôt hier ?",
      "ines: je t'ai cherché pour la photo de groupe",
      { m: 'ines', t: "on dirait une pub pour un dentifrice gothique 😂", img: { e: '🧛', bg: 'linear-gradient(135deg,#2b1640,#7c1d3a)' } },
      { c: [
        { t: "Bravo pour Max. Vraiment.", fx: { fz: 1 }, then: ["ines: merci ❤ ça compte que tu le dises"] },
        { t: "J'étais crevé. Tu étais très belle en tout cas.", fx: { aff: 1 }, then: ["ines: arrête 🙈"] },
        { t: "[Laisser en vu]", fx: { conf: -1 }, then: [{ seen: 'ines' }, { wait: 800 }, "ines: ok…"] },
      ] },
    ] },
  ] },
  { recap: true },
  { go: 'c6' },
];

/* ==========================================================
   CHAPITRE 6 — Vingt ans
   ========================================================== */
STORY.c6 = [
  { ch: 6, title: 'Vingt ans', sub: 'Fin novembre' },
  { day: 'Mardi 12 novembre', time: '18:45', music: 'studio' },
  { open: 'nora' },
  { if: v => v.nora >= 3, then: [
    "nora: Binôme. J'ai une question sérieuse.",
    "nora: Mon court-métrage perso a été retenu en présélection pour Court-Circuit. Le festival de février.",
    "nora: Il me faut une musique originale. Et je veux que ce soit toi.",
    { if: v => v.nora_debt, then: ["nora: Tu as une dette, je te rappelle. Mais je te demande quand même. Je veux que tu dises oui parce que t'en as envie."] },
    "nora: Ça va demander du temps. Des soirées. Tu dis quoi ?",
    { c: [
      { t: "Oui. Évidemment oui.", fx: { nora: 2 }, set: 'nora_film', log: 'Tu composes la musique du film de Nora pour le festival.', then: ["nora: !!!!!", "nora: Pardon. Je suis calme. Je suis très calme. Merci.", "nora: Projection le 14 février à 20h. Note-le."] },
      { t: "Je suis pas sûr d'avoir le temps…", fx: { nora: -1 }, then: ["nora: Ok. Je comprends. Je demanderai à quelqu'un d'autre.", "~ Elle ne dit pas que ça la déçoit. Elle n'a pas besoin."] },
    ] },
  ], else: [
    "nora: Vasseur nous met encore ensemble pour le projet de décembre.",
    "nora: Essaie de pas disparaître cette fois.",
    "> Promis.",
  ] },
  { day: 'Jeudi 21 novembre', time: '21:10', music: 'happy' },
  { if: v => v.ines_max, then: [{ go: 'c6_max' }], else: [{ go: 'c6_slow' }] },
];

STORY.c6_max = [
  { sys: 'Maxime a créé le groupe « Anniv Inès 🎂 »', in: 'anniv' },
  { open: 'anniv' },
  "max@anniv: Salut la team ! 28 novembre = les 20 ans de ma chérie ❤",
  "max@anniv: Soirée surprise au Bistrot du Lavoir. Elle se doute de rien. CHUT",
  "lea@anniv: J'ai déjà réservé le gâteau. Framboise-pistache. Elle va pleurer",
  "max@anniv: {nom} tu viens hein ? Elle me tuerait si t'étais pas là",
  "~ « Ma chérie. » Ça fait trois semaines qu'ils sont ensemble. Tu les as vus quatre fois. Ils se tiennent la main sous la table.",
  { c: [
    { t: "Évidemment, je serai là.", fx: { conf: 1 } },
    { t: "Je vais essayer.", fx: { conf: -1 }, then: ["lea@anniv: « essayer ». {nom}. Tu viens.", "> Je viens."] },
  ] },
  { open: 'max' },
  "max: Hé mec, en privé",
  "max: Je panique un peu. Tu la connais mieux que personne",
  "max: Je lui offre quoi ? Je pensais à un week-end à Paris mais c'est peut-être too much ?",
  { c: [
    { t: "Elle rêve de voir la Fondation Cartier. Fais Paris, avec ça dedans.", fx: { fz: 1, conf: 1 }, set: 'helped_max', then: ["max: Mec t'es un génie. Merci. Sérieux. Je te dois un verre. Dix verres."] },
    { t: "Un week-end à Paris ? Elle déteste Paris. Offre-lui un truc simple.", fx: { jal: 2 }, set: 'lied_max', then: ["max: Ah bon ?? Elle m'avait dit l'inverse… Ok, merci de me prévenir !", "~ C'est faux. Elle adore Paris. Tu le sais. Tu te sens minable une seconde, puis tu verrouilles l'écran."] },
    { t: "Je sais pas, mec. C'est ta copine.", then: ["max: Ouais. T'as raison. Je vais me débrouiller."] },
  ] },
  { go: 'c6_gift' },
];

STORY.c6_slow = [
  { open: 'ines' },
  "ines: tu sais quel jour on est dans une semaine ?",
  "> Le jour où tu deviens vieille.",
  "ines: VINGT ANS. je veux pas de soirée. je veux un truc simple. avec les gens que j'aime",
  "ines: Léa, Sam, toi",
  "ines: surtout toi",
  { wait: 400 },
  "ines: c'est bizarre qu'on se parle comme ça maintenant hein ?",
  { c: [
    { t: "C'est bizarre. Mais c'est bien bizarre.", fx: { aff: 1 } },
    { t: "On se parle comme d'habitude, non ?", fx: { fz: 1 }, then: ["ines: non. pas du tout comme d'habitude. et tu le sais"] },
  ] },
  { go: 'c6_gift' },
];

STORY.c6_gift = [
  { open: 'sam', day: 'Mardi 26 novembre', time: '23:30', music: 'night' },
  "sam: alors. le cadeau. t'as deux jours",
  "sam: et je te préviens, si tu lui offres une carte cadeau Fnac je déménage",
  { c: [
    { t: "Je vais finir le morceau. Celui sur elle.", fx: { aff: 2, fz: -1 }, set: { gift: 'song' }, log: 'Tu lui as offert le morceau que tu as composé pour elle.', then: [
      "sam: le dossier « ines_demos » ???",
      "sam: frère c'est la chose la plus courageuse ou la plus suicidaire que t'aies jamais faite",
      { if: v => v.ines_max, then: ["sam: elle a un mec. tu le sais ça ?", "> Je sais. C'est pas pour la récupérer. C'est parce que c'est vrai."] },
      "sam: ...ok. je suis ému. je vais aller dormir avant de pleurer",
      "~ Tu passes deux nuits dessus. Piano, une nappe de cordes, le bruit d'une pluie de septembre sur une vitre, et, très loin dans le mix, une voix enregistrée en cachette : son rire, au Comptoir Bleu.",
    ] },
    { t: "Le livre sur Lina Bo Bardi. Celui à 80 balles qu'elle regarde depuis des mois.", fx: { aff: 1, fz: 1 }, set: { gift: 'book' }, log: 'Tu lui as offert le livre d’architecture qu’elle convoitait.', then: [
      "sam: 80 balles ?? pour un livre ??",
      "sam: t'es pas son banquier, je te rappelle",
      "> C'est son architecte préférée. Elle le regarde à chaque fois qu'on passe devant la librairie.",
      "sam: ok c'est mignon. mais t'es quand même pas son banquier",
    ] },
    { t: "Une photo encadrée de nous deux en fantômes, en 6e. Et un mug « meilleure archi du monde ».", fx: { aff: 1, conf: 1 }, set: { gift: 'photo' }, log: 'Tu lui as offert un souvenir de vos 11 ans.', then: [
      "sam: ok ça c'est fort. c'est drôle ET c'est vous",
      "sam: le mug est de trop mais je respecte",
    ] },
    { t: "Rien de spécial. Un message à minuit, ça suffit.", fx: { aff: -1, conf: -1 }, set: { gift: 'none' }, log: 'Tu ne lui as rien offert pour ses 20 ans.', then: [
      "sam: ...pour ses VINGT ANS ?",
      "sam: t'as un problème, frère. je sais pas lequel, mais t'en as un",
    ] },
  ] },
  { go: 'c6_party' },
];

STORY.c6_party = [
  { day: 'Jeudi 28 novembre', time: '20:30' },
  { scene: 'bar', loc: 'Le Bistrot du Lavoir · Pentes de la Croix-Rousse', music: 'happy', amb: 'cafe', particles: 'lights' },
  { if: v => v.ines_max, then: [
    "~ « SURPRIIISE ! » Inès porte les mains à sa bouche. Elle pleure. Elle rit. Elle embrasse Max, puis Léa, puis toi, puis Sam, puis un inconnu qui passait par là.",
    { if: v => v.lied_max, then: [
      "~ Max lui offre un bouquet et une boîte de chocolats. « Un truc simple. » Elle sourit poliment. Léa te jette un regard en coin.",
      "lea: Bizarre, Max m'avait parlé d'un week-end à Paris. Il a changé d'avis au dernier moment.",
      "~ Tu bois ton verre très lentement.",
    ], else: [
      "~ Max lui tend une enveloppe : deux billets de train pour Paris. Et un ticket pour la Fondation Cartier.",
      "ines: QUOI ?! Comment t'as su ?!",
      { if: v => v.helped_max, then: ["max: J'ai des sources. 😏", "~ Il te fait un clin d'œil. Elle te regarde. Elle a compris. Elle te sourit, et quelque chose dans ce sourire t'est adressé à toi seul."] },
    ] },
  ], else: [
    "~ Un coin de table, des bougies, Léa, Sam et toi. Inès arrive et voit la banderole « VIEILLE » écrite par Sam au feutre.",
    "ines: Vous êtes les pires. Je vous aime.",
  ] },
  "~ Le gâteau framboise-pistache arrive. Vingt bougies. Elle souffle tout d'un coup et fait un vœu en fermant très fort les yeux.",
  "~ Puis vient ton tour.",
  { if: v => v.gift === 'song', then: [{ go: 'c6_song' }] },
  { if: v => v.gift === 'book', then: [
    "~ Elle déchire le papier. Elle voit la couverture. Elle se fige.",
    "ines: T'as pas fait ça.",
    "ines: {nom}, c'est beaucoup trop. Tu peux pas dépenser autant pour moi.",
    "ines: …Mais je le garde. Je le garde pour toujours.",
    "~ Elle te serre si fort que tu entends tes côtes craquer. Un bruitage parfait.",
  ] },
  { if: v => v.gift === 'photo', then: [
    "~ Elle découvre la photo. Deux fantômes de onze ans, devant un lampadaire. On voit qu'un des deux vient de se prendre le poteau.",
    "~ Elle rit tellement qu'elle doit s'asseoir. Puis elle pleure. Puis elle rit encore.",
    "ines: C'est le meilleur cadeau. Le meilleur. Max, désolée, mais c'est le meilleur.",
    { if: v => v.ines_max, then: ["max: Je m'incline. Je peux pas lutter contre un fantôme."] },
  ] },
  { if: v => v.gift === 'none', then: [
    "~ Tu n'as rien. Tu lui fais une bise et un « joyeux anniversaire » qui sonne creux.",
    "~ Elle dit « c'est pas grave », et elle a l'air de le penser. C'est peut-être pire.",
  ] },
  { go: 'c6_smoke' },
];

STORY.c6_song = [
  "~ Tu lui tends ton téléphone et un vieux casque.",
  "> C'est le morceau. Celui que je t'avais promis. Va l'écouter dehors, au calme.",
  { scene: 'street', loc: 'Devant le bistrot · 22h14', amb: 'street', music: null, time: '22:14' },
  { music: 'love' },
  "~ Elle s'assoit sur les marches. Tu restes à distance, appuyé contre un réverbère.",
  "~ Tu la regardes écouter. Quatre minutes et douze secondes. Tu connais chaque seconde par cœur.",
  "~ À 1'40, quand le piano arrive, elle porte la main à sa bouche. À 3'05, quand son propre rire passe très loin dans le mix, elle ferme les yeux.",
  "~ À la fin, elle enlève le casque. Elle ne se retourne pas tout de suite.",
  "ines: C'est moi ?",
  "ines: C'est… comme ça que tu me vois ?",
  { c: [
    { t: "C'est comme ça que tu es.", fx: { aff: 2 }, then: [
      "~ Elle se lève. Elle vient vers toi. Elle s'arrête à vingt centimètres.",
      { if: v => v.ines_max, then: [
        "ines: Je peux pas… Max est à l'intérieur. Je peux pas.",
        "ines: Mais je l'écouterai tous les soirs. Je te préviens.",
      ], else: [
        "~ Elle pose son front contre ton torse. Elle reste là. Tu sens son cœur battre aussi vite que le tien.",
        "ines: T'es injuste. Comment je suis censée prendre mon temps avec ça ?",
      ] },
      { mem: 'Elle n’oubliera jamais ce morceau.' },
    ] },
    { t: "C'est juste un morceau. T'emballe pas.", fx: { fz: 2, aff: -1 }, then: [
      "ines: Juste un morceau.",
      "ines: D'accord. C'est juste un morceau.",
      "~ Elle te rend le casque. Elle a l'air presque blessée. Tu as eu peur au dernier moment, et elle l'a entendu.",
    ] },
    { t: "[Ne rien dire. La regarder.]", fx: { aff: 1 }, then: [
      "~ Vous vous regardez. Une voiture passe. Le moment est trop grand pour être dit.",
      "ines: Merci. C'est le plus beau cadeau qu'on m'ait jamais fait.",
    ] },
  ] },
  { if: v => v.song_promise, then: [{ mem: 'Tu as tenu ta promesse du Comptoir Bleu.' }, { fx: { conf: 1 } }] },
  { scene: 'bar', loc: 'Le Bistrot du Lavoir', amb: 'cafe', music: 'happy', particles: 'lights' },
  { go: 'c6_smoke' },
];

STORY.c6_smoke = [
  { if: v => v.ines_max, then: [
    "~ Plus tard. Tu sors prendre l'air. Max est là, une cigarette qu'il ne fume pas entre les doigts. Il a un peu trop bu.",
    "max: Hé. Le meilleur ami.",
    "max: Je peux te dire un truc ? Elle parle de toi tout le temps, mec. Tout le temps.",
    { if: v => v.gift === 'song', then: ["max: Et ce soir elle est revenue avec les yeux rouges. Après ton cadeau. Tu lui as offert quoi, sérieux ?"] },
    "max: Des fois je me demande…",
    { c: [
      { t: "Tu te demandes rien du tout. On est amis depuis la 6e, c'est tout.", fx: { fz: 2 }, then: ["max: Ouais. Ouais, t'as raison. Désolé, j'ai trop bu.", "~ Tu viens de mentir au copain de la fille que tu aimes, pour le rassurer. Tu ne sais même plus qui tu protèges."] },
      { t: "Tu te demandes quoi ?", fx: { aff: 0 }, then: ["max: Rien. Si elle serait pas mieux avec quelqu'un qui la connaît comme toi.", "max: Laisse tomber. Je suis bourré.", "~ Il rentre. Tu restes dehors, dans le froid, avec cette phrase."] },
      { t: "Tu devrais te demander, oui.", fx: { jal: 2 }, set: 'threat_max', then: ["max: …Ok. Wow.", "~ Il écrase sa cigarette. Il rentre sans un mot. Plus tard, Inès te demande ce que tu as dit à Max. Tu dis « rien »."] },
    ] },
  ], else: [
    "~ Plus tard, Sam et Léa se disputent pour la dernière part de gâteau. Inès vient s'asseoir à côté de toi sur la banquette.",
    "ines: J'y pense, tu sais. À ce que tu m'as dit sur le toit.",
    "ines: Tout le temps. En cours, dans le tram, sous la douche.",
    { c: [
      { t: "Sous la douche, où tu chantes ? Léa m'a dit.", fx: { aff: 1 }, then: ["ines: JE VAIS TUER LÉA."] },
      { t: "Et tu penses quoi ?", fx: { aff: 1 }, then: ["ines: Je pense que j'ai peur. Et que j'ai moins peur qu'avant.", "~ Elle pose sa main sur la tienne, sous la table. Personne ne voit. C'est encore mieux."] },
    ] },
  ] },
  { endscene: 'ines', amb: 'none', day: 'Vendredi 29 novembre', time: '01:45', music: 'night' },
  "ines: meilleur anniversaire de ma vie",
  "ines: merci d'exister. sérieusement",
  { if: v => v.gift === 'song', then: ["ines: je l'écoute encore. 4e fois. j'arrête pas"] },
  { c: [
    { t: "Joyeux anniversaire, Inès. Vingt ans, ça te va bien.", fx: { aff: 1 } },
    { t: "Merci à toi d'exister aussi. Bonne nuit ❤", fx: { conf: 1 } },
  ] },
  { recap: true },
  { go: 'c7' },
];
