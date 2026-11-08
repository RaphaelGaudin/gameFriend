'use strict';
/* ==========================================================
   CHAPITRE 1 — Vu à 23h12
   ========================================================== */
CHAPTERS.push(
  { n: 1, node: 'c1', title: 'Vu à 23h12', sub: 'Septembre' },
  { n: 2, node: 'c2', title: 'La crémaillère', sub: 'Septembre' },
  { n: 3, node: 'c3', title: 'Nuit blanche', sub: 'Octobre' },
);

STORY.c1 = [
  { ch: 1, title: 'Vu à 23h12', sub: 'Septembre' },
  { music: 'night', amb: 'room', day: 'Vendredi 13 septembre', time: '23:09' },
  "~ Lyon. Ta première semaine dans la coloc de la Croix-Rousse.",
  "~ Les cartons ne sont pas déballés. Le matelas est par terre. À travers la cloison, Sam, ton coloc, ronfle comme un tracteur.",
  "~ Tu fixes le plafond en te demandant si tu as fait le bon choix. Nouvelle ville, nouvelle fac, personne à qui parler.",
  "~ Et puis ton téléphone vibre.",
  { lock: true, time: '23:12' },
  "ines: t'es réveillé ?",
  { c: [
    { t: "[Ouvrir tout de suite]", then: [{ set: 'c1_fast' }] },
    { t: "[Attendre un peu. Ne pas avoir l'air désespéré.]", then: [
      "~ Tu poses le téléphone face contre le matelas. Tu comptes jusqu'à soixante.",
      "~ Tu arrives à douze.",
      { time: '23:14' },
    ] },
    { t: "[Laisser en « vu » jusqu'à demain]", go: 'c1_vu' },
  ] },
  { unlock: 'ines' },
  { go: 'c1_talk' },
];

STORY.c1_vu = [
  { sfx: 'tap', time: '23:13' },
  "~ Tu ouvres le message. Tu le lis. Tu verrouilles l'écran.",
  "~ « Vu à 23h12. » Elle le sait. Tu le sais.",
  "~ Tu te retournes sur ton matelas en te disant que tu répondras demain, à tête reposée.",
  { fx: { conf: -1, aff: -1 }, set: 'c1_leftseen', log: 'Tu as laissé Inès en « vu » le premier soir.' },
  { day: 'Samedi 14 septembre', time: '08:47' },
  { lock: true },
  "ines: ok j'ai compris tu dormais 😅",
  "ines: ou tu m'ignores. on va dire que tu dormais.",
  { unlock: 'ines' },
  { c: [
    { t: "Je dormais ! Désolé 😴", fx: { conf: 0 } },
    { t: "J'étais mort de fatigue, pardon. Ça va ?", fx: { conf: 1 } },
    { t: "Je t'ignore jamais. Je réfléchis juste longtemps.", fx: { aff: 1 } },
  ] },
  "ines: mdr t'inquiète",
  "ines: c'était juste un petit moment de solitude hier soir",
  "ines: je suis arrivée à Lyon. mon appart est minuscule, ma coloc Léa est partie en soirée et j'ai pleuré devant un carton de vaisselle",
  "ines: bref la grande classe",
  { go: 'c1_lyon' },
];

STORY.c1_talk = [
  "ines: question sérieuse",
  "ines: est-ce que c'est normal de pleurer devant un carton de vaisselle",
  { c: [
    { t: "Ça dépend de la vaisselle.", fx: { aff: 1 }, then: [
      "ines: MDR",
      "ines: des assiettes Ikea. les blanches. les plus tristes du monde",
      "> Alors oui c'est normal. Pleure, c'est sain.",
    ] },
    { t: "Qu'est-ce qui se passe ? T'es où ?", fx: { conf: 1 }, then: [
      "ines: rien de grave t'inquiète pas",
      "ines: je suis juste... arrivée",
    ] },
    { t: "lol", fx: { aff: -1, fz: 1 }, then: [
      "ines: wow. merci pour ton soutien émotionnel 🙃",
      "> Pardon ! Je suis à moitié endormi. Qu'est-ce qui se passe ?",
    ] },
  ] },
  "ines: je suis à Lyon. ENFIN. j'ai signé le bail ce matin",
  "ines: l'appart est minuscule, Léa ma coloc est déjà partie en soirée, et je réalise que je connais personne ici",
  { wait: 400 },
  "ines: sauf toi 🙃",
  { go: 'c1_lyon' },
];

STORY.c1_lyon = [
  { c: [
    { t: "Bienvenue à Lyon ! Je suis à 15 minutes de chez toi.", fx: { conf: 1 } },
    { t: "Tu connais personne... mais tu connais le meilleur.", fx: { aff: 1 } },
    { t: "Ah ouais t'es à Lyon toi aussi ? 😶", fx: { aff: -1 }, then: [
      "ines: {nom}. on en parle depuis le mois de MARS",
      "> Je rigole 😄 Bienvenue !",
      "ines: t'es bête",
    ] },
  ] },
  "ines: tu te rends compte ? après le lycée je pensais qu'on allait se perdre de vue",
  "ines: genre on se serait envoyé un message par an à nos anniversaires",
  "ines: et là on habite dans la même ville",
  { c: [
    { t: "Je t'aurais jamais laissée te perdre de vue.", fx: { conf: 1, fz: 1 } },
    { t: "Le destin. Ou le Parcoursup.", fx: { aff: 1 } },
    { t: "Avoue t'as choisi Lyon pour moi.", draft: true, fx: { aff: 1 }, log: 'Tu l’as taquinée : « Avoue, t’as choisi Lyon pour moi. »', efx: {}, emem: 'Tu as effacé ton message.', then: [
      "ines: pfff",
      "ines: pour l'école d'archi, monsieur",
      "ines: ...et un peu pour toi. un tout petit peu.",
      { mem: 'Inès a souri en écrivant ça.' },
    ], erase: [
      "> C'est trop bien.",
    ] },
  ] },
  "ines: on se voit demain ? y a un café trop mignon en bas de chez moi apparemment, le Comptoir Bleu",
  "ines: 10h ?",
  { c: [
    { t: "10h c'est parfait.", fx: { conf: 1 } },
    { t: "10h un samedi ?? T'es un monstre. 11h.", fx: { aff: 1 }, then: [
      "ines: 10h30 et je t'offre le croissant",
      "> Marché conclu.",
    ] },
    { t: "Je t'attends depuis la fin du lycée, je peux bien attendre jusqu'à 10h.", draft: true, fx: { aff: 1, fz: -1 }, set: 'c1_bold',
      then: [
        "ines: oh",
        { wait: 600 },
        "ines: c'est mignon ça",
        "ines: t'es devenu mignon à Lyon ?",
        { mem: 'Inès s’en souviendra.' },
      ],
      erase: ["> 10h ça marche !"],
      elog: 'Tu as effacé un message trop sincère.' },
  ] },
  "ines: trop bien",
  "ines: bonne nuit {nom} 🌙",
  { wait: 500 },
  "ines: merci d'être là. comme d'hab.",
  { wait: 800 },
  "~ « Comme d'hab. »",
  "~ Deux mots. Tu les relis quatre fois avant de t'endormir.",
  { go: 'c1_sam' },
];

STORY.c1_sam = [
  { day: 'Samedi 14 septembre', time: '09:02', music: 'happy', amb: 'none' },
  { open: 'sam' },
  "sam: frérot",
  "sam: j'ai entendu ton téléphone vibrer à minuit à travers le mur",
  "sam: les murs de cet appart sont en papier, je te préviens, je sais tout",
  "sam: c'était ELLE ?",
  { c: [
    { t: "Oui. On se voit ce matin.", fx: { sam: 1 } },
    { t: "C'était ma mère.", fx: { sam: -1 }, then: [
      "sam: ta mère t'écrit « t'es réveillé ? » à 23h12",
      "sam: j'ai entendu la vibration ET ton petit rire niais",
      "> ...Bon. Oui. C'était Inès.",
    ] },
    { t: "Occupe-toi de ton café.", then: [
      "sam: c'est donc un oui",
    ] },
  ] },
  "sam: écoute-moi bien",
  "sam: ça fait six ans que t'es amoureux de cette fille, et six ans que tu lui portes ses sacs",
  "sam: si tu veux pas finir « meilleur ami pour la vie », faut changer un truc",
  { c: [
    { t: "Je suis pas amoureux d'elle.", then: [
      "sam: lol",
      "sam: LOL",
      "sam: tu as un dossier sur ton ordi qui s'appelle « ines_demos »",
      "> C'est des morceaux. C'est pas pareil.",
      "sam: c'est EXACTEMENT pareil",
    ] },
    { t: "Je sais. Mais j'ai peur de tout gâcher.", fx: { sam: 1 }, set: 'honest_sam', log: 'Tu as avoué à Sam que tu avais peur de tout gâcher.', then: [
      "sam: je sais mec",
      "sam: mais tu sais ce qui gâche tout ? attendre que ça pourrisse",
      "sam: sois toi-même. le vrai toi. pas le toi qui dit oui à tout",
      { mem: 'Sam a raison. Peut-être.' },
    ] },
    { t: "T'as des conseils, Casanova ?", fx: { sam: 1 }, then: [
      "sam: 1. pas de tote bag",
      "sam: 2. tu poses des questions sur ELLE",
      "sam: 3. tu payes pas tout. t'es pas son banquier, t'es pas son grand frère",
      "sam: 4. pas de tote bag (je le redis parce que je te connais)",
      "> Je range le tote bag.",
    ] },
  ] },
  "sam: allez file. et ramène-moi un pain au chocolat",
  { go: 'c1_cafe' },
];

STORY.c1_cafe = [
  { scene: 'cafe', loc: 'Le Comptoir Bleu · Croix-Rousse', amb: 'cafe', music: 'menu', particles: 'lights', time: '10:04' },
  "~ Elle est déjà là, assise près de la vitre, les deux mains autour d'une tasse trop grande.",
  "~ Ses cheveux sont plus courts que dans ton souvenir. Elle te voit, et son visage s'allume.",
  "ines: {nom} ! Viens là.",
  "~ Elle te serre fort. Elle sent toujours la fleur d'oranger. Certaines choses ne changent pas.",
  "ines: T'as changé, toi. T'as... une barbe ? C'est une barbe, ça ?",
  { c: [
    { t: "C'est un projet en cours. Sois indulgente.", fx: { aff: 1 }, then: ["ines: Je valide le projet. Continue les travaux."] },
    { t: "Toi t'as coupé tes cheveux. Ça te va trop bien.", fx: { aff: 1, fz: -1 }, then: [
      "~ Elle passe une main dans sa nuque, un peu gênée.",
      "ines: Arrête... Léa a dit que je ressemblais à un champignon.",
      "> Un très joli champignon.",
      "ines: T'es nul. Merci.",
    ] },
    { t: "On commande ? Je meurs de faim.", then: ["ines: Toujours aussi romantique. Je t'ai pris un croissant."] },
  ] },
  "~ Vous parlez pendant une heure qui passe en dix minutes. Ta licence de création sonore. Son école d'archi qui fait peur. Les profs, les gens, la ville.",
  "ines: Et toi, tu fais toujours des morceaux la nuit dans ta chambre ? Avec ton casque énorme ?",
  { c: [
    { t: "Toujours. J'en ai même un sur toi.", fx: { aff: 2, fz: -1 }, set: 'song_tease', log: 'Tu lui as avoué composer un morceau sur elle.', then: [
      "ines: Quoi ?? Sur moi ?",
      "ines: Fais écouter. Tout de suite.",
      "> Il est pas fini.",
      "ines: Je veux l'écouter quand il sera fini. Promis ?",
      { c: [
        { t: "Promis.", set: 'song_promise', mem: 'Tu as promis de lui faire écouter le morceau.' },
        { t: "On verra. Il faut le mériter.", fx: { aff: 1 }, then: ["ines: Oh, le mystère. Je vais le mériter, tu vas voir."] },
      ] },
    ] },
    { t: "Moins qu'avant. La fac me prend du temps.", fx: { fz: 1 } },
    { t: "Oui, mais parle-moi de toi plutôt. Comment tu te sens, vraiment ?", fx: { conf: 1 }, then: [
      "~ Elle te regarde un instant, surprise qu'on lui pose la vraie question.",
    ] },
  ] },
  "ines: Honnêtement ? J'ai un peu peur. Mon père voulait que je reste à Grenoble.",
  "ines: Il dit que c'est rien, mais il a pas l'air en forme en ce moment. Il est tout gris, il se fatigue vite.",
  "ines: Et moi je suis partie. Je me sens coupable.",
  { c: [
    { t: "T'as le droit de vivre ta vie. Il est fier de toi, j'en suis sûr.", fx: { conf: 1 } },
    { t: "Tu veux qu'on aille le voir ensemble à la Toussaint ?", fx: { conf: 1, aff: 1 }, set: 'c1_offer_dad', log: 'Tu as proposé d’aller voir son père avec elle.', then: ["ines: ...T'es sérieux ? Ça lui ferait plaisir. Il t'adore, tu sais."] },
    { t: "T'inquiète, il doit juste être fatigué.", fx: { fz: 1 } },
  ] },
  "~ L'addition arrive. Deux cafés, deux croissants, un chocolat chaud. Onze euros quarante.",
  { c: [
    { t: "[Payer tout, sans discuter]", fx: { fz: 1 }, log: 'Tu as tout payé. « Merci, grand frère. »', then: ["ines: Hé ! C'est moi qui devais t'inviter !", "> Trop tard.", "ines: T'es toujours comme ça. Merci, grand frère."] },
    { t: "[Proposer de partager]", fx: { conf: 1 } },
    { t: "C'est toi qui paies. T'as promis le croissant.", fx: { aff: 1 }, then: ["ines: J'ai dit le croissant, pas le chocolat chaud ! Escroc.", "~ Elle paie quand même, en riant."] },
  ] },
  "ines: Au fait ! Léa organise une crémaillère samedi prochain. Tu viens, hein ?",
  "ines: Y aura plein de gens de mon école. Tu vas me sauver de la gêne sociale.",
  "> Je serai là.",
  "ines: Je sais. Tu es toujours là.",
  "~ Elle dit ça comme une évidence. Comme on dit que le ciel est bleu.",
  "~ Tu ne sais pas si c'est la plus belle chose qu'on t'ait dite, ou la plus inquiétante.",
  { endscene: 'sam', amb: 'none' },
  "sam: alors ??? et mon pain au chocolat ???",
  { c: [
    { t: "C'était génial. Comme si on s'était jamais quittés.", fx: { sam: 1 } },
    { t: "Elle m'a appelé « grand frère ».", req: v => v.fz >= 3, fx: { sam: 1 }, then: ["sam: aïe", "sam: AÏE", "sam: bon on a du boulot"] },
    { t: "J'ai oublié ton pain au chocolat.", then: ["sam: je te renie", "sam: raconte quand même"] },
  ] },
  { recap: true },
  { go: 'c2' },
];

/* ==========================================================
   CHAPITRE 2 — La crémaillère
   ========================================================== */
STORY.c2 = [
  { ch: 2, title: 'La crémaillère', sub: 'Septembre' },
  { day: 'Mercredi 18 septembre', time: '18:20', music: 'studio' },
  "~ Mercredi. Premier vrai TD de création sonore. Le prof, M. Vasseur, distribue les binômes pour le projet du semestre : sonoriser un court-métrage muet.",
  "~ Ton nom est à côté de celui d'une fille au fond de la salle. Cheveux bouclés, veste en velours, carnet couvert de stickers de films d'horreur. Elle n'a pas levé les yeux une seule fois.",
  { open: 'nora' },
  { set: 'nora_met' },
  "nora: Salut, c'est Nora. Du TD de Vasseur.",
  "nora: On est en binôme pour le projet apparemment 😬",
  "nora: Je préfère te prévenir : je suis maniaque du bruitage. Je vais te faire enregistrer des pas dans du gravier pendant des heures.",
  { c: [
    { t: "Parfait, j'adore le gravier.", fx: { nora: 1 }, then: ["nora: Enfin quelqu'un de sérieux. Tu as une préférence ? Gravier fin, gros gravier ?", "> Gravier émotionnel.", "nora: ...Ok tu vas me plaire toi."] },
    { t: "Salut ! Ça me va, j'ai hâte de bosser avec toi.", fx: { nora: 1 } },
    { t: "Ok.", then: ["nora: Très bavard. Ça me va, je parle pour deux."] },
  ] },
  "nora: Le rendu c'est le 17 octobre à 9h. Vasseur rigole pas avec les retards.",
  "nora: On se cale des sessions au studio B ? Lundi et jeudi soir ?",
  "> Ça marche.",
  "nora: Top. À lundi, binôme. Ramène des chaussures qui font du bruit.",
  { day: 'Jeudi 19 septembre', time: '21:30', music: 'happy' },
  { sys: 'Léa a créé le groupe « Crémaillère 🏠 »', in: 'groupe' },
  { open: 'groupe' },
  "lea@groupe: Bienvenue à tous !! 🎉",
  "lea@groupe: Samedi 21h, 14 rue d'Austerlitz, 4e SANS ascenseur",
  "lea@groupe: Ramenez à boire et pas vos ex",
  "max@groupe: Je ramène les enceintes 🔊 et ma playlist secrète",
  "lea@groupe: Max si tu passes encore 40 min de David Guetta je te jette par la fenêtre",
  "max@groupe: c'était IRONIQUE",
  "ines@groupe: {nom} tu ramènes ta guitare ? 🎸",
  { c: [
    { t: "Seulement si tu chantes.", fx: { aff: 1 }, then: ["ines@groupe: jamais de la vie", "lea@groupe: ELLE CHANTE SOUS LA DOUCHE, JE L'AI ENTENDUE", "ines@groupe: LÉA"] },
    { t: "Je ramène des chips, c'est déjà pas mal.", then: ["max@groupe: un homme de goût"] },
    { t: "[Ne rien répondre dans le groupe]", fx: { aff: -1 }, then: [
      { open: 'ines' },
      "ines: tu m'ignores dans le groupe ? 😤",
      "> J'ai pas vu ! Désolé.",
      "ines: ouais ouais. viens quand même hein",
    ] },
  ] },
  { open: 'sam' },
  "sam: j'ai vu que t'étais invité à la crémaillère",
  "sam: je sais parce que tu fais ton sourire de crémaillère depuis une heure",
  "sam: je viens ?",
  "sam: faut quelqu'un pour te surveiller. et pour manger les chips",
  { c: [
    { t: "Viens, ça me rassure.", fx: { sam: 1 }, set: 'sam_party' },
    { t: "Non, c'est mon truc. Je gère.", then: ["sam: ok champion. envoie-moi un SOS si besoin. code : « les pâtes sont cuites »"] },
  ] },
  { go: 'c2_party' },
];

STORY.c2_party = [
  { day: 'Samedi 21 septembre', time: '21:47' },
  "~ Samedi. Rue d'Austerlitz. Quatre étages à pied, et la musique qui grossit à chaque palier.",
  { music: 'party', muffle: true, amb: 'street' },
  { if: v => v.sam_party, then: ["~ Sam, derrière toi, souffle comme un phoque. « Pourquoi les gens drôles habitent toujours au 4e ? »"] },
  { scene: 'party', loc: "Rue d'Austerlitz · 4e étage", particles: 'lights', amb: 'none' },
  { sfx: 'door', muffle: false },
  "~ La porte s'ouvre. Chaleur, rires, guirlandes lumineuses. Et Inès, robe noire, rouge à lèvres, un verre dans chaque main.",
  "ines: Tu es là ! Tiens, c'est pour toi. Ne demande pas ce qu'il y a dedans.",
  "~ Derrière elle, une fille aux cheveux blond cendré te détaille de haut en bas.",
  "lea: Ah. C'est toi, le fameux {nom}.",
  "lea: Inès parle de toi tout le temps. Genre TOUT le temps.",
  "ines: LÉA.",
  { c: [
    { t: "Ah ouais ? Elle dit quoi ?", fx: { aff: 1 }, then: ["lea: Que t'es le seul mec qui l'a jamais déçue. Pas de pression.", "~ Inès devient écarlate et file vers la cuisine."] },
    { t: "En bien, j'espère.", then: ["lea: Ça dépend. Tu sais cuisiner ?"] },
    { t: "Normal, je suis passionnant.", fx: { aff: 1 }, then: ["lea: Ok il me plaît. Inès, il me plaît.", "ines: Personne t'a demandé."] },
  ] },
  "~ Un grand type traverse la foule, casque autour du cou, sourire de pub pour dentifrice.",
  "max: C'est lui ? Le fameux meilleur ami ?",
  "ines: {nom}, voici Max. Max, voici {nom}, mon meilleur ami depuis la 6e.",
  "~ « Meilleur ami. » Elle le dit avec fierté. Ça te pique quand même un peu.",
  "max: Enchanté mec ! Inès m'a dit que tu faisais du son. Tu mixes ?",
  { c: [
    { t: "Un peu. Plutôt des trucs ambient, des textures.", set: 'max_friendly', then: [
      "max: Trop stylé. Faudra que tu me fasses écouter. Moi je fais que de la house, j'ai zéro culture.",
      "~ Il a l'air sincère. C'est presque agaçant.",
    ] },
    { t: "Je fais pas de la musique pour soirées étudiantes, non.", fx: { jal: 1, aff: -1 }, log: 'Tu as envoyé une pique à Max.', then: [
      "max: Haha. Ok. Message reçu.",
      "~ Inès te jette un regard. Celui qu'elle avait en 4e quand tu faisais le malin devant les grands.",
      { mem: 'Inès a remarqué ta pique.' },
    ] },
    { t: "Si tu veux, je peux te montrer deux-trois trucs sur tes platines.", fx: { aff: 1 }, then: ["max: Ah ouais ? Défi accepté. Plus tard, quand y aura moins de monde."] },
  ] },
  { if: v => v.sam_party, then: [
    "~ Sam est déjà en train de débattre avec Léa de la meilleure marque de chips. Ils ont l'air de s'entendre dangereusement bien.",
  ] },
  "~ Minuit approche. Le salon s'est transformé en piste de danse. Inès te repère depuis l'autre bout de la pièce et te fait signe de venir.",
  { c: [
    { t: "[Aller danser avec elle]", fx: { aff: 2, fz: -1 }, set: 'danced', log: "Tu as dansé avec Inès à la crémaillère." },
    { t: "[Rester près du buffet]", timeout: true, fx: { fz: 1 }, log: 'Tu es resté près du buffet.' },
  ], timer: 7, prompt: 'Elle t’attend…' },
  { if: v => v.danced, then: [
    "~ Tu danses mal. Elle danse pire. Vous riez tellement que les gens autour s'écartent.",
    "~ Puis la musique change. Max, aux platines, lance un slow. « Ironiquement », crie-t-il.",
    "ines: Bon. On est obligés, maintenant. C'est la règle.",
    "~ Elle pose ses mains sur tes épaules. Tu poses les tiennes sur sa taille, comme si c'était du verre.",
    "ines: Tu te souviens de la boum de 5e ? T'avais marché sur mon pied pendant tout le slow.",
    { c: [
      { t: "Je m'entraîne depuis. Pour ce moment précis.", fx: { aff: 1 }, then: ["~ Elle rit contre ton épaule. Tu sens son souffle dans ton cou. Ton cœur fait un truc bizarre."] },
      { t: "[Ne rien dire. Profiter.]", fx: { aff: 1 }, then: ["~ Vous ne dites rien. La chanson dure trois minutes quarante. Tu voudrais qu'elle en dure quarante."] },
      { t: "C'est bizarre de danser un slow avec ta meilleure amie, non ?", fx: { fz: 2 }, then: ["ines: ...Ouais. Un peu. Haha.", "~ Elle s'écarte légèrement. Tu as cassé quelque chose, mais tu ne sais pas quoi."] },
    ] },
    "max: INÈS ! Viens m'aider, Léa veut mettre du Céline Dion !",
    "~ Elle s'éloigne en te serrant la main une dernière fois.",
  ], else: [
    "~ Tu restes près des chips. Inès hausse les épaules, un peu déçue, puis Max l'attrape par la main.",
    "~ Ils dansent. Ils rient. Il est doué. Évidemment qu'il est doué.",
    { if: v => v.sam_party, then: [
      "~ Sam apparaît à côté de toi avec un bol de guacamole.",
      "sam: Frère. Tu regardes le buffet comme s'il t'avait trahi.",
      "sam: Le buffet t'a rien fait. C'est toi qui as rien fait.",
      { c: [
        { t: "Je danse mal, c'est tout.", then: ["sam: Elle s'en fout que tu danses mal. Elle voulait danser AVEC TOI."] },
        { t: "T'as raison. La prochaine fois, j'y vais.", fx: { sam: 1 }, set: 'sam_advice1' },
      ] },
    ] },
  ] },
  { go: 'c2_balcony' },
];

STORY.c2_balcony = [
  { scene: 'balcony', loc: 'Le balcon · 1h12', muffle: true, music: 'night', time: '01:12' },
  "~ Tu es sorti prendre l'air. Lyon scintille en contrebas. La musique n'est plus qu'un battement sourd derrière la vitre.",
  "~ La porte-fenêtre glisse. Inès te rejoint, pieds nus, ses chaussures à la main.",
  "ines: Tu fuis ?",
  "> Je respire.",
  "ines: Moi aussi. Je connais personne, en fait. Je souris à tout le monde depuis trois heures.",
  "~ Elle s'accoude à côté de toi. Vos bras se touchent.",
  "ines: Tu crois qu'on reste les mêmes, quand on change de ville ?",
  { c: [
    { t: "Moi je change pas. Je serai toujours là pour toi.", fx: { conf: 1, fz: 1 }, then: ["ines: Je sais. C'est rassurant. T'es mon repère, {nom}."] },
    { t: "J'espère qu'on change. J'ai pas envie d'être le gamin de 6e à côté de toi toute ma vie.", fx: { aff: 2, fz: -1 }, log: 'Sur le balcon, tu as laissé entendre que tu voulais plus.', then: [
      "~ Elle tourne la tête vers toi. Elle te regarde longtemps, comme si elle cherchait la suite de la phrase.",
      "ines: Le gamin de 6e, il était très bien, tu sais.",
      "ines: Mais je crois que je vois ce que tu veux dire.",
    ] },
    { t: "Tu veux qu'on change, toi ?", fx: { aff: 1, conf: 1 }, then: ["ines: Je sais pas. Je veux pas te perdre. Mais je veux pas qu'on reste figés non plus.", "~ Elle ne précise pas. Tu ne demandes pas."] },
  ] },
  "~ Un coup de vent. Elle frissonne et croise les bras.",
  "ines: Il caille, en fait.",
  { c: [
    { t: "[Lui donner ta veste]", fx: { aff: 1, fz: 1 }, log: 'Tu lui as donné ta veste.', then: ["~ Elle s'enroule dedans. Elle disparaît presque. « Elle sent toi », dit-elle, et elle ne développe pas."] },
    { t: "[Te rapprocher d'elle]", fx: { aff: 2, fz: -1 }, log: 'Sur le balcon, tu l’as prise contre toi.', then: [
      "~ Tu passes ton bras autour de ses épaules. Elle se laisse aller contre toi, naturellement, comme si elle avait attendu ça.",
      "~ Vous restez comme ça une minute. Peut-être deux. Personne ne parle.",
      { mem: 'Ce moment compte.' },
    ] },
    { t: "Rentre, alors. Tu vas tomber malade.", fx: { aff: -1, fz: 1 }, then: ["ines: Oui, papa.", "~ Elle rentre. La porte-fenêtre se referme sur la musique."] },
  ] },
  { endscene: 'ines', muffle: false, music: 'night', amb: 'room' },
  { lock: true, time: '03:04' },
  "~ 3h04. Tu viens de rentrer. Tu enlèves tes chaussures quand le téléphone vibre.",
  "ines: t'es bien rentré ?",
  "ines: c'était trop bien que tu sois là",
  "ines: t'es le seul qui me comprend vraiment tu sais",
  "ines: bon je suis un peu bourrée là. mais c'est vrai quand même",
  { unlock: 'ines' },
  { c: [
    { t: "Toi aussi tu me comprends. Plus que personne.", fx: { aff: 1, conf: 1 } },
    { t: "Inès, faut que je te dise un truc…", draft: true, dtimer: 6, go: 'c2_drunk',
      erase: ["> Bois de l'eau et dors bien 😴"], efx: { fz: 1 }, elog: "Tu as failli lui dire. À 3h du matin. Tu as effacé." },
    { t: "Bois de l'eau et dors 😴", fx: { conf: 1, fz: 1 } },
    { t: "[Tu t'endors avant de répondre]", timeout: true, fx: { conf: -1 }, then: [
      { lock: true, time: '11:20' },
      "ines: désolée pour les messages de 3h du mat lol",
      "ines: oublie tout",
      { unlock: 'ines' },
      "> Rien à oublier 😄",
    ] },
  ], timer: 12, prompt: '3h04. Elle attend ta réponse.' },
  "ines: 💤",
  { go: 'c2_end' },
];

STORY.c2_drunk = [
  "ines: quoi ?? 👀",
  "ines: dis",
  { typing: 'ines', ms: 1200 },
  { c: [
    { t: "Je suis amoureux de toi. Depuis longtemps.", fx: { aff: 1 }, set: 'confessed_drunk', log: 'Tu lui as tout avoué, par SMS, à 3h du matin.', then: [
      { time: '03:09' },
      { wait: 1200 },
      { typing: 'ines', ms: 3500, after: 400 },
      { typing: 'ines', ms: 2500, after: 600 },
      "ines: {nom}",
      "ines: je suis bourrée",
      "ines: redis-le moi quand je suis pas bourrée",
      "ines: d'accord ?",
      { mem: "Inès s'en souviendra. Peut-être." },
      "> D'accord.",
    ] },
    { t: "Que Max mixe comme un pied.", fx: { aff: 1 }, set: 'chickened_c2', log: 'Tu t’es dégonflé à la dernière seconde.', then: [
      "ines: MDRRRR",
      "ines: c'est vrai en plus. il a mis la macarena",
      "ines: c'était ça ton grand secret ? 😂",
      "> C'était lourd à porter.",
    ] },
    { t: "Que je suis content qu'on soit dans la même ville.", fx: { conf: 1, fz: 1 }, then: ["ines: moi aussi. tellement."] },
  ] },
  { go: 'c2_end' },
];

STORY.c2_end = [
  "ines: bonne nuit {nom}",
  { day: 'Dimanche 22 septembre', time: '13:30', music: 'happy', amb: 'none' },
  { open: 'sam' },
  { if: v => v.sam_party, then: [
    "sam: question random",
    "sam: Léa elle est célibataire ?",
    "> Sam.",
    "sam: QUOI. j'ai le droit d'avoir une vie moi aussi",
  ], else: [
    "sam: alors cette crémaillère ? les pâtes étaient cuites ou pas ?",
    { c: [
      { t: "C'était bien. Je crois.", then: ["sam: « je crois ». d'accord. on en reparle au petit déj"] },
      { t: "Y a un certain Max. Grand. Gentil. Insupportable.", fx: { jal: 1 }, then: ["sam: oh non", "sam: le grand gentil insupportable, le pire ennemi de l'homme"] },
    ] },
  ] },
  { recap: true },
  { go: 'c3' },
];

/* ==========================================================
   CHAPITRE 3 — Nuit blanche
   ========================================================== */
STORY.c3 = [
  { ch: 3, title: 'Nuit blanche', sub: 'Octobre' },
  { day: 'Lundi 30 septembre', time: '19:10' },
  { scene: 'studio', loc: 'Studio B · Fac de création sonore', music: 'studio' },
  "~ Le studio B sent la poussière chaude et le café froid. Nora a étalé sur le sol : un sac de gravier, des céleris, des gants en cuir et un parapluie cassé.",
  "nora: Bon. La scène du film : un homme marche dans la nuit, il pleut, il serre son manteau. On fait tout. Le gravier, le manteau, la pluie.",
  "nora: Les céleris, c'est pour les os qui craquent. Ne pose pas de questions.",
  { c: [
    { t: "Pourquoi des os qui craquent ? C'est un film d'amour.", fx: { nora: 1 }, then: ["nora: Tous les films d'amour ont des os qui craquent. Faut juste bien écouter."] },
    { t: "Je prends le gravier. Laisse-moi faire mes preuves.", fx: { nora: 1 } },
    { t: "[Croquer dans un céleri]", fx: { nora: 1 }, then: ["nora: ...Tu viens de manger notre fracture du fémur.", "~ Elle éclate de rire. Un vrai rire, grave et contagieux."] },
  ] },
  "~ Vous travaillez trois heures. Elle est précise, drôle, impitoyable. Elle te fait recommencer les pas dans le gravier quatorze fois.",
  "nora: Tu sais pourquoi je fais ça ? Le bruitage ?",
  "nora: Parce que personne ne remarque un bon bruitage. Mais tout le monde remarque quand il manque.",
  "nora: C'est un peu triste, non ? Être essentiel et invisible.",
  { c: [
    { t: "J'ai l'impression que tu parles pas que de bruitage.", fx: { nora: 2 }, set: 'nora_deep', then: ["~ Elle relève la tête de sa console, surprise.", "nora: T'es plus malin que t'en as l'air, binôme."] },
    { t: "Moi je trouve ça beau. Les gens ressentent sans savoir pourquoi.", fx: { nora: 1 } },
    { t: "Je connais. Je suis le meilleur ami officiel de quelqu'un.", fx: { nora: 1, fz: 1 }, then: ["nora: Aïe. Le bruitage de l'amitié. Je compatis."] },
  ] },
  "nora: Au fait, si notre court est bien, je veux le présenter au festival Court-Circuit. En février. Ce serait mon premier festival.",
  "nora: Donc on va faire un truc excellent. Pas juste bien. Excellent. Ok ?",
  "> Ok. Excellent.",
  "nora: Et le 16 au soir, on fait la nuit de mixage finale. Je compte sur toi. Je peux pas le faire seule, je gère pas le mix.",
  { c: [
    { t: "Je serai là. Promis.", set: 'nora_promise', fx: { nora: 1 }, log: 'Tu as promis à Nora d’être là pour la nuit de mixage.', mem: 'Tu as promis à Nora d’être là le 16 au soir.' },
    { t: "Compte sur moi, binôme.", set: 'nora_promise', mem: 'Tu as promis à Nora d’être là le 16 au soir.' },
  ] },
  { endscene: 'ines' },
  { day: 'Lundi 7 octobre', time: '22:40', music: 'night' },
  "ines: SOS",
  "ines: mon prof de projet vient de me dire que ma maquette « manquait d'âme »",
  "ines: d'ÂME. c'est du carton plume, Jean-Michel, il a pas d'âme",
  { c: [
    { t: "Il a raison, faut lui greffer une âme. Je connais un chaman.", fx: { aff: 1 }, then: ["ines: 😂 envoie le chaman"] },
    { t: "Il veut dire quoi exactement ? Raconte.", fx: { conf: 1 }, then: ["ines: que c'est propre mais froid. que ça raconte rien", "ines: je dois tout refaire pour le 17. je vais mourir"] },
    { t: "Courage, tu vas gérer 💪", fx: { fz: 1 } },
  ] },
  "ines: mon projet c'est une médiathèque pour un quartier. il veut que je pense « aux gens qui vont y vivre des choses »",
  "ines: toi tu y vivrais quoi dans une médiathèque ?",
  { c: [
    { t: "Je m'y cacherais pour écouter des vinyles en douce, dans un coin avec une fenêtre ronde.", fx: { aff: 1 }, set: 'idea_window', log: 'Tu lui as soufflé l’idée des fenêtres rondes.', then: [
      "ines: ...une fenêtre ronde",
      "ines: attends",
      "ines: ATTENDS",
      "ines: {nom} t'es un génie. je vais faire des alcôves d'écoute. avec des fenêtres rondes",
      { mem: 'Ton idée va finir dans sa maquette.' },
    ] },
    { t: "J'y donnerais rendez-vous à quelqu'un que j'aime bien.", fx: { aff: 1, fz: -1 }, then: ["ines: ah oui ? à qui ? 👀", "> C'est une médiathèque hypothétique, Inès.", "ines: hypothétiquement tu rougis"] },
    { t: "J'en sais rien, je vais pas dans les médiathèques.", then: ["ines: inculte. bon je retourne pleurer sur mon carton"] },
  ] },
  { go: 'c3_night' },
];

STORY.c3_night = [
  { day: 'Mercredi 16 octobre', time: '20:55', music: 'tense' },
  "~ Mercredi 16 octobre. La veille du rendu. Tu as rendez-vous au studio B à 21h pour la nuit de mixage avec Nora.",
  "~ Tu es dans le tram quand le téléphone vibre. Une fois. Deux fois. Six fois.",
  { open: 'ines' },
  "ines: {nom}",
  "ines: c'est la catastrophe",
  "ines: ma maquette s'est effondrée. la colle a pas pris. tout le niveau 2 est par terre",
  { m: 'ines', t: '', img: { e: '🏚️', bg: 'linear-gradient(135deg,#d9cbb0,#6d5a44)' } },
  "ines: rendu demain 8h. Léa est chez ses parents. je suis toute seule avec 400 morceaux de carton",
  "ines: je sais que t'as ton truc ce soir. mais je sais pas quoi faire. je vais pas y arriver",
  { wait: 300 },
  "ines: tu peux venir ? 🥺",
  "~ Le tram s'arrête. Une porte vers le studio. Une autre vers chez elle.",
  { c: [
    { t: "J'arrive. Tiens bon.", go: 'c3_help', log: 'Tu as lâché Nora pour aider Inès.' },
    { t: "Je peux pas, je suis désolé. Nora compte sur moi.", timeout: true, go: 'c3_nora', log: 'Tu as tenu ta promesse envers Nora.' },
    { t: "J'apporte mon ordi et je mixe chez toi. On fait les deux.", go: 'c3_both', log: 'Tu as essayé d’aider Inès et de mixer en même temps.' },
    { t: "Je t'envoie Sam. Il est doué de ses mains.", req: v => v.sam >= 5, go: 'c3_sam', log: 'Tu as envoyé Sam au secours d’Inès.' },
  ], prompt: 'Le tram repart dans 20 secondes…', timer: 20 },
];

STORY.c3_help = [
  { fx: { conf: 2, fz: 1, nora: -2 }, set: 'helped_ines' },
  { open: 'nora' },
  "~ Tu ouvres la conversation avec Nora. Tes doigts hésitent.",
  { c: [
    { t: "Nora, je suis vraiment désolé. Urgence avec ma meilleure amie. Je peux pas venir ce soir.", fx: { nora: 1 }, then: [
      { wait: 1200 },
      "nora: Tu rigoles ?",
      "nora: On rend à 9h.",
      { typing: 'nora', ms: 2000 },
      "nora: Ok. Je vais me débrouiller.",
      "nora: Encore une fois.",
    ] },
    { t: "[Mentir : « Je suis malade, je vomis partout »]", fx: { nora: -1 }, set: 'lied_nora', then: [
      "> Nora je suis malade, je vomis partout, je peux pas venir 🤢",
      { wait: 1500 },
      "nora: Super.",
      "nora: Soigne-toi.",
      { seen: 'nora' },
    ] },
    { t: "[Ne rien dire à Nora]", fx: { nora: -2 }, set: 'ghosted_nora', then: [
      "~ Tu verrouilles le téléphone. Tu lui expliqueras demain.",
    ] },
  ] },
  { scene: 'appart', loc: "Chez Inès · 22h14", amb: 'room', music: 'night', time: '22:14' },
  "~ Elle t'ouvre en pyjama, les yeux rouges, de la colle plein les doigts. Elle se jette dans tes bras.",
  "ines: T'es venu.",
  "> Évidemment.",
  "~ Le salon ressemble à un champ de bataille. Cutter, règles en métal, carton plume, et au milieu, la ruine de sa médiathèque.",
  { if: v => v.idea_window, then: ["ines: Regarde, j'avais fait les alcôves. Avec les fenêtres rondes. Ton idée. Elles ont tenu, elles. C'est le reste qui est tombé."] },
  "~ Vous travaillez. Elle découpe, tu colles. Elle mesure, tu tiens. À 2h, vous mangez des pâtes froides à même la casserole.",
  "ines: Pourquoi t'es venu ? T'avais ton projet.",
  { c: [
    { t: "Parce que c'est toi.", fx: { aff: 2 }, then: ["~ Elle s'arrête de découper. Juste une seconde.", "ines: ...« Parce que c'est toi. » D'accord."] },
    { t: "Parce que tu l'aurais fait pour moi.", fx: { conf: 1 } },
    { t: "Je sais pas dire non, tu me connais.", fx: { fz: 2 }, then: ["ines: Ouais. C'est vrai que tu sais pas dire non.", "~ Elle dit ça gentiment. Mais ça sonne comme un diagnostic."] },
  ] },
  { time: '05:10' },
  "~ 5h10. Le niveau 2 est debout. Inès s'est endormie sur ton épaule, le cutter encore à la main. Il reste les escaliers à coller.",
  { c: [
    { t: "[La réveiller doucement]", then: ["ines: Hm... quoi... les escaliers... JE DORS PAS.", "~ Vous finissez ensemble à 7h20, en riant comme des zombies."] },
    { t: "[La laisser dormir et finir seul]", fx: { conf: 1, aff: 1 }, set: 'finished_alone', then: [
      "~ Tu retires doucement le cutter de sa main. Tu poses un plaid sur elle.",
      "~ Tu colles les escaliers seul, marche par marche, en retenant ton souffle.",
      "~ À 7h, elle se réveille et voit la maquette finie. Elle ne dit rien pendant longtemps.",
      "ines: Tu sais que personne n'a jamais fait ça pour moi ?",
      { mem: 'Inès n’oubliera pas cette nuit.' },
    ] },
  ] },
  { endscene: 'ines', amb: 'none', day: 'Jeudi 17 octobre', time: '12:30' },
  "ines: RENDU. 16/20. LE PROF A DIT QUE LES ALCÔVES AVAIENT « UNE ÂME »",
  "ines: je t'aime toi tu sais",
  "~ « Je t'aime toi. » Elle l'écrit comme on l'écrit à un frère, à une coloc, à un chien très gentil.",
  "~ Tu fixes ces mots trop longtemps.",
  { c: [
    { t: "Moi aussi je t'aime, toi.", fx: { aff: 1, fz: 1 } },
    { t: "Je sais 😎", fx: { aff: 1 } },
    { t: "Tu dis ça à tout le monde.", draft: true, fx: { aff: 1, fz: -1 }, then: ["ines: non. pas à tout le monde."], erase: ["> 16 ! Bravo, archi ❤"] },
  ] },
  { go: 'c3_after' },
];

STORY.c3_nora = [
  { fx: { conf: -1, nora: 2 }, set: 'kept_nora' },
  "ines: ok",
  "ines: je comprends",
  { seen: 'ines' },
  { scene: 'studio', loc: 'Studio B · 21h03', music: 'studio' },
  "~ Nora a déjà tout installé. Elle te tend un café sans lever les yeux de l'écran.",
  "nora: T'es à l'heure. Je suis émue. Je savais pas que les garçons de ta promo savaient lire l'heure.",
  "~ Mais tu n'arrêtes pas de regarder ton téléphone. Inès n'écrit plus. Le silence est pire que tout.",
  "nora: Ok. Qu'est-ce qui se passe ? Ça fait six fois que tu regardes ton écran en dix minutes.",
  { c: [
    { t: "Ma meilleure amie est en crise. Sa maquette s'est effondrée.", fx: { nora: 1 }, then: [
      "nora: Et t'es là.",
      "nora: Avec moi. À mixer du gravier.",
      "~ Elle te regarde longtemps. Puis elle soupire.",
      "nora: Vas-y.",
      "> Quoi ?",
      "nora: Vas-y. Exporte-moi les pistes, je me débrouille pour le mix. Je ferai un truc moins bien, mais je ferai un truc.",
      "nora: Va aider ta copine.",
      { c: [
        { t: "[Y aller] Nora, je te revaudrai ça. Vraiment.", fx: { conf: 2, nora: 1 }, set: 'nora_released', log: 'Nora t’a libéré pour que tu ailles aider Inès.', go: 'c3_late' },
        { t: "[Rester] Non. J'ai promis. On finit ensemble.", fx: { nora: 2 }, set: 'nora_stayed', log: 'Tu es resté avec Nora jusqu’au bout.', then: [
          "~ Nora ne dit rien. Mais elle sourit en remettant son casque.",
        ] },
      ] },
    ] },
    { t: "Rien. On bosse.", fx: { nora: -1 }, then: ["nora: Ok. Rien.", "~ Elle n'insiste pas. Mais le reste de la nuit est froid."] },
  ] },
  "~ Vous mixez jusqu'à 6h. Le gravier, la pluie, le manteau. Quand vous écoutez le résultat final, Nora a les larmes aux yeux.",
  "nora: C'est excellent. Pas bien. Excellent.",
  { endscene: 'ines', day: 'Jeudi 17 octobre', time: '14:10' },
  "~ L'après-midi, toujours rien d'Inès. Puis :",
  "ines: rendu fait. 11/20. le niveau 2 manquait",
  "ines: t'inquiète c'est pas grave",
  { c: [
    { t: "Je suis désolé de pas avoir été là. Vraiment.", fx: { conf: 1 }, then: ["ines: je sais. t'avais promis à quelqu'un. c'est bien de tenir ses promesses", "ines: c'est juste que... j'ai l'habitude que tu sois là. c'est bête"] },
    { t: "11 c'est la moyenne ! C'est bien !", fx: { aff: -1 }, then: ["ines: ouais. super."] },
    { t: "Je t'invite à dîner ce soir. Pour me faire pardonner.", fx: { conf: 1, aff: 1 }, then: ["ines: ...ok. mais c'est toi qui choisis le resto. et c'est cher.", "> Marché conclu."] },
  ] },
  { go: 'c3_after' },
];

STORY.c3_late = [
  { scene: 'appart', loc: "Chez Inès · 23h40", amb: 'room', music: 'night', time: '23:40' },
  "~ Quand elle t'ouvre, elle a pleuré. Elle te regarde comme si tu étais un mirage.",
  "ines: T'étais pas avec ta binôme ?",
  "> Elle m'a dit de venir. Elle gère.",
  "ines: Ta binôme est une sainte. Je veux la rencontrer pour l'épouser.",
  "~ Vous travaillez toute la nuit. À 7h, la maquette tient debout. De justesse, mais elle tient.",
  { endscene: 'ines', amb: 'none', day: 'Jeudi 17 octobre', time: '12:30' },
  "ines: 15/20 !!!!",
  "ines: dis merci à Nora de ma part. sérieusement",
  { open: 'nora' },
  "> Nora. Merci. Elle a eu 15. Et nous ?",
  "nora: 17. Vasseur a dit que le gravier était « habité ».",
  "nora: T'as une dette envers moi, binôme. Une grosse.",
  { set: 'nora_debt' },
  { go: 'c3_after' },
];

STORY.c3_both = [
  { fx: { conf: 1, aff: 1, nora: -1 }, set: 'tried_both' },
  { open: 'nora' },
  "> Nora, urgence avec une amie. Je mixe à distance cette nuit, je t'envoie tout avant 8h. Promis.",
  { wait: 900 },
  "nora: À distance. Le mix final. Sérieusement ?",
  "nora: ...Ok. Mais si c'est nul, je te tue avec un céleri.",
  { scene: 'appart', loc: "Chez Inès · 22h05", amb: 'room', music: 'night', time: '22:05' },
  "~ Tu installes ton ordi sur un coin de table, entre deux pots de colle. Un écouteur dans l'oreille, une règle dans la main.",
  "ines: Tu mixes un film ET tu sauves ma maquette ? T'es quoi, un poulpe ?",
  "> Un poulpe très fatigué.",
  "~ À 3h, elle s'arrête et te regarde travailler, casque sur la tête, les yeux plissés devant tes courbes de son.",
  "ines: Tu sais que t'es beau quand tu te concentres ?",
  { c: [
    { t: "Seulement quand je me concentre ?", fx: { aff: 1 }, then: ["ines: Le reste du temps t'es mignon. C'est différent.", "~ Elle retourne à son carton avant que tu puisses répondre."] },
    { t: "[Rougir et faire semblant de pas avoir entendu]", fx: { fz: 1 }, then: ["~ Tu montes le volume. Ton cœur aussi."] },
    { t: "Toi aussi. Avec de la colle sur le nez.", fx: { aff: 1 }, then: ["ines: QUOI. Où ça ??"] },
  ] },
  "~ À 7h45, la maquette est finie. Le mix aussi. Ni l'un ni l'autre n'est parfait.",
  { endscene: 'ines', amb: 'none', day: 'Jeudi 17 octobre', time: '13:00' },
  "ines: 14 ! c'est inespéré. merci mon poulpe 🐙",
  { open: 'nora' },
  "nora: 12. Vasseur a dit que le mix était « pressé ».",
  "nora: Pas excellent. Juste bien.",
  "nora: La prochaine fois, choisis.",
  { go: 'c3_after' },
];

STORY.c3_sam = [
  { fx: { sam: 1, conf: 1 }, set: 'sam_helped' },
  "> Je peux pas venir, mais je t'envoie Sam. Il a fait un CAP menuiserie avant la fac. Il coupe comme un dieu.",
  "ines: ton coloc ???",
  "ines: ...ok. je prends tout ce qu'on me donne",
  { open: 'sam' },
  "> Sam. J'ai besoin de toi. Mission sauvetage maquette. Rue d'Austerlitz, 4e.",
  "sam: rue d'austerlitz ? chez Léa ?",
  "sam: j'y vais. pour toi. évidemment pour toi. pas du tout pour Léa",
  { scene: 'studio', loc: 'Studio B · 21h05', music: 'studio' },
  "~ Tu mixes avec Nora toute la nuit, le téléphone posé à côté de la console. Il vibre régulièrement.",
  { endscene: 'ines' },
  { m: 'ines', t: "ton coloc est fou mais il coupe le carton comme un dieu", fast: true },
  { m: 'ines', t: "il a ramené des croissants à 4h du mat. d'où il sort des croissants à 4h ????", fast: true },
  { m: 'ines', t: "", img: { e: '🏛️', bg: 'linear-gradient(135deg,#efe4cf,#9b8a6b)' }, fast: true },
  { m: 'ines', t: "ELLE TIENT DEBOUT", fast: true },
  { day: 'Jeudi 17 octobre', time: '13:15' },
  "ines: 15 !!! dis à Sam que je lui dois une vie",
  "ines: mais toi t'étais pas là 😤 je te pardonne parce que t'as envoyé le meilleur coloc du monde",
  { open: 'nora' },
  "nora: 17. Vasseur a dit que le gravier était « habité ».",
  "nora: Merci d'être resté. Je sais que t'avais la tête ailleurs.",
  { fx: { nora: 1 } },
  { go: 'c3_after' },
];

STORY.c3_after = [
  { day: 'Jeudi 17 octobre', time: '22:00', music: 'happy' },
  { open: 'sam' },
  { if: v => v.sam_helped, then: [
    "sam: frère. FRÈRE.",
    "sam: Léa était rentrée à minuit finalement",
    "sam: on a fait de la maquette jusqu'à 6h. elle a mis de la colle dans mes cheveux",
    "sam: je crois que je suis amoureux",
    "> 😂 Merci, vraiment. Je te dois une énorme.",
    "sam: tu me dois RIEN. par contre ta meuf est vraiment drôle",
    "> C'est pas ma meuf.",
    "sam: ouais ouais",
  ], else: [
    { if: v => v.helped_ines, then: [
      "sam: t'as découché ?",
      "sam: t'étais chez elle ? TOUTE LA NUIT ?",
      "> À coller du carton.",
      "sam: ...à coller du carton. toute la nuit. avec la fille dont t'es amoureux depuis six ans",
      "sam: t'es soit un saint soit un idiot. j'ai pas encore décidé",
      { c: [
        { t: "Les deux, probablement.", fx: { sam: 1 } },
        { t: "Elle avait besoin de moi. C'est tout.", fx: { fz: 1 }, then: ["sam: « elle avait besoin de moi. » c'est ce qu'on gravera sur ta tombe de meilleur ami"] },
      ] },
    ], else: [
      "sam: bien joué pour le rendu. t'as une tête de cadavre",
      "> Merci, ça fait plaisir.",
    ] },
  ] },
  { recap: true },
  { go: 'c4' },
];
