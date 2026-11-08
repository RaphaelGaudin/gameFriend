'use strict';
CHAPTERS.push(
  { n: 7, node: 'c7', title: 'Ce qu’on ne dit pas', sub: 'Décembre' },
  { n: 8, node: 'c8', title: 'Neige', sub: 'Noël' },
);

/* ==========================================================
   CHAPITRE 7 — Ce qu'on ne dit pas
   ========================================================== */
STORY.c7 = [
  { ch: 7, title: 'Ce qu’on ne dit pas', sub: 'Décembre' },
  { day: 'Mardi 3 décembre', time: '23:02', music: 'night', amb: 'rain' },
  { open: 'ines' },
  { if: v => v.ines_max, then: [
    "ines: Max a annulé. encore",
    "ines: c'est la 3e fois cette semaine. « gros set à préparer »",
    "ines: je sais que c'est important pour lui. mais j'ai l'impression de passer après ses platines",
    { c: [
      { t: "Il a de la chance que tu sois aussi patiente.", fx: { conf: 1 } },
      { t: "Le problème c'est pas toi. C'est qu'il voit pas ce qu'il a.", fx: { aff: 1 }, then: ["ines: ...c'est gentil", "ines: même si t'es un peu de parti pris 😅"] },
      { t: "Parle-lui. Peut-être qu'il est juste débordé.", fx: { fz: 1, conf: 1 }, then: ["ines: ouais. t'as raison. t'es toujours raisonnable toi"] },
    ] },
    { day: 'Vendredi 6 décembre', time: '01:14' },
    "ines: tu dors ?",
    "ines: il me répond plus depuis deux jours",
    "ines: tu crois que c'est moi le problème ?",
    "ines: Léa dit que je suis « trop intense ». que je fais peur aux mecs",
    { c: [
      { t: "T'es pas un problème. T'es la personne la plus… enfin. Non. T'es pas un problème.", draft: true, fx: { aff: 2 }, then: [
        "ines: la personne la plus quoi ?",
        { c: [
          { t: "La plus vivante que je connaisse.", fx: { aff: 1 }, then: ["ines: ...", "ines: personne m'a jamais dit ça"] },
          { t: "Laisse tomber 😅", fx: { fz: 1 }, then: ["ines: non mais là tu peux pas commencer et pas finir"] },
        ] },
      ], erase: ["> T'es pas trop intense. T'es juste entière. C'est une qualité."], efx: { conf: 1 } },
      { t: "Je pense que t'es parfaite. Pour quelqu'un qui saura le voir.", fx: { aff: 1, fz: -1 } },
      { t: "Peut-être qu'il faut que tu lui laisses de l'air ?", fx: { aff: -1, fz: 1 }, then: ["ines: ah", "ines: ok", "ines: donc c'est moi."] },
    ] },
  ], else: [
    { if: v => v.slowburn, then: [
      "ines: j'ai un aveu",
      "ines: j'ai écouté ton morceau en boucle pendant que je dessinais mes plans",
      { if: v => v.gift !== 'song', then: ["ines: enfin pas LE morceau. ceux que tu m'as fait écouter au Comptoir. je les ai demandés à Sam. il me les a envoyés. il a tous tes fichiers, ce traître"] },
      "ines: et du coup mes plans sont tout tristes et beaux",
      { c: [
        { t: "Je veux voir les plans tristes et beaux.", fx: { aff: 1 } },
        { t: "Sam est mort. Je le tue demain.", fx: { aff: 1, sam: -1 }, then: ["ines: noooon c'est mon allié"] },
      ] },
    ] },
  ] },
  { go: 'c7_lights' },
];

STORY.c7_lights = [
  { day: 'Dimanche 8 décembre', time: '17:40', amb: 'none', music: 'happy' },
  "~ Le 8 décembre, Lyon allume ses fenêtres. Des lumignons sur chaque rebord, des projections sur les façades, un million de gens dans les rues.",
  { if: v => v.ines_max, then: [
    "ines: Max devait m'emmener à la Fête des Lumières",
    "ines: il a un « plan de dernière minute ». il mixe dans un club",
    "ines: ...tu fais quoi ce soir ?",
    { c: [
      { t: "Je t'emmène. Rendez-vous place des Terreaux à 19h.", fx: { conf: 1, aff: 1 }, set: 'lights_together' },
      { t: "Je suis pas sûr que ce soit une bonne idée… t'as un copain.", fx: { conf: 1 }, then: [
        "ines: je te demande pas de m'épouser, je te demande de regarder des lumières",
        "ines: s'il te plaît. j'ai pas envie d'être seule ce soir",
        "> Ok. Place des Terreaux, 19h.",
        { set: 'lights_together' },
      ] },
    ] },
  ], else: [
    "ines: {nom}",
    "ines: ce soir on va à la Fête des Lumières",
    "ines: tous les deux",
    "ines: et c'est pas comme d'habitude",
    { if: v => v.slowburn, then: ["> C'est un rendez-vous ?", "ines: je dirais pas ce mot. mais je mets du rouge à lèvres"], else: ["> Comment ça, pas comme d'habitude ?", "ines: je sais pas encore. viens."] },
    { set: 'lights_together' },
  ] },
  { scene: 'street', loc: 'Fête des Lumières · Presqu’île', amb: 'street', music: 'love', particles: 'lights', time: '19:05' },
  "~ La place des Terreaux est un océan de bonnets. Sur la façade de l'Hôtel de Ville, des baleines de lumière nagent entre les fenêtres.",
  "~ Inès glisse son bras sous le tien pour ne pas te perdre dans la foule. Elle ne l'enlève plus.",
  "ines: Regarde ! Elles sont énormes ! Elles ont l'air tristes, tu trouves pas ?",
  { c: [
    { t: "Elles ont l'air de chanter. Écoute.", fx: { aff: 1 }, then: ["~ Une nappe de basses fait vibrer la place. Tu lui expliques comment le son est spatialisé. Elle t'écoute, la tête levée, et quand tu baisses les yeux tu vois qu'elle ne regarde pas les baleines. Elle te regarde toi."] },
    { t: "Comme nous en 6e quand on avait raté le bus.", fx: { conf: 1 }, then: ["ines: On avait fait les 5 km à pied sous la neige. T'avais porté mon sac.", "> Déjà."] },
  ] },
  "~ Vous montez à Fourvière par les escaliers. Six cents marches. Elle s'arrête tous les vingt mètres pour râler. En haut, toute la ville brille.",
  { scene: 'rooftop', loc: 'Esplanade de Fourvière · 21h30', amb: 'wind', particles: 'lights', time: '21:30' },
  "ines: C'est trop beau. J'ai envie de pleurer et je sais pas pourquoi.",
  "~ Elle se tourne vers toi. Vos visages sont très proches. Ses yeux brillent de mille petites fenêtres.",
  { if: v => v.ines_max, then: [
    "~ Son téléphone vibre. « Max ». Elle regarde l'écran longtemps. Elle ne décroche pas.",
    "ines: Je crois que je sais plus ce que je fais, {nom}.",
    { c: [
      { t: "Tu sais très bien. T'as juste peur.", fx: { aff: 1 }, then: ["ines: ...ouais. peut-être."] },
      { t: "Rappelle-le. Il s'inquiète sûrement.", fx: { conf: 1, fz: 2 }, then: ["~ Elle rappelle. Elle s'éloigne pour parler. Tu restes seul devant la ville la plus lumineuse de France."] },
      { t: "[L'embrasser]", fx: { jal: 1 }, set: 'kissed_taken', then: [
        "~ Tu te penches. Elle ne recule pas tout de suite.",
        "~ Puis elle pose un doigt sur tes lèvres.",
        "ines: Pas comme ça. Pas pendant que je suis avec quelqu'un. Ni toi ni moi on est comme ça.",
        "ines: Mais… j'avais envie. Voilà. Je l'ai dit.",
        { fx: { aff: 1 } },
        { mem: 'Elle a dit « pas comme ça ». Pas « non ».' },
      ] },
    ] },
  ], else: [
    { if: v => v.slowburn, then: [
      "ines: {nom}, je…",
      "~ Un feu d'artifice éclate au-dessus de la Saône. La foule hurle. Elle sursaute et éclate de rire.",
      "ines: Bon. L'univers a décidé. Pas ce soir.",
      "ines: Mais à Noël. À Grenoble. Là où tout a commencé. Je te promets que je serai prête.",
      { set: 'promise_noel', mem: 'Elle t’a donné rendez-vous à Noël.' },
    ], else: [
      "ines: C'est bizarre. J'ai l'impression que quelque chose va changer.",
      { c: [
        { t: "Peut-être que c'est déjà changé.", fx: { aff: 1 } },
        { t: "Non. On sera toujours nous.", fx: { fz: 1 } },
      ] },
    ] },
  ] },
  { endscene: 'nora', amb: 'none', music: 'studio' },
  { go: 'c7_concert' },
];

STORY.c7_concert = [
  { day: 'Jeudi 12 décembre', time: '18:00' },
  "~ Le 15 décembre, c'est la Nuit du Son de la fac : chaque étudiant présente une pièce dans l'amphithéâtre plongé dans le noir. La tienne s'appelle « Lu à 23h12 ».",
  "~ C'est la première fois que tu vas jouer quelque chose de toi, devant des gens.",
  { if: v => v.nora >= 3, then: [
    "nora: Tu passes en 7e. Juste avant moi. Tu vas tout casser, binôme.",
    "nora: T'as invité ta copine-pas-copine ?",
    { c: [
      { t: "Oui. Elle a promis de venir.", then: ["nora: Cool. J'ai hâte de rencontrer la fameuse."] },
      { t: "Elle s'appelle Inès. Et oui.", fx: { nora: 0 }, then: ["nora: Inès. Ok. Joli prénom. Bon, je retourne à mes câbles."] },
      { t: "Je sais pas encore si je veux qu'elle vienne.", fx: { nora: 1 }, then: ["nora: Pourquoi ?", "> Parce que le morceau parle d'elle. Et que je sais pas si je suis prêt à ce qu'elle l'entende en public.", "nora: Alors c'est exactement pour ça qu'elle doit venir."] },
    ] },
  ], else: [
    "nora: Bon courage pour dimanche. T'es en 7e.",
  ] },
  { open: 'ines' },
  "> Dimanche 20h, amphi B. Tu viens toujours ?",
  "ines: je viendrais même si je devais ramper",
  { day: 'Dimanche 15 décembre', time: '19:40' },
  { scene: 'concert', loc: 'Amphi B · Nuit du Son', music: null, amb: 'room' },
  "~ L'amphi est noir. Soixante personnes assises dans l'obscurité, une lampe rouge sur la console. Passage n°6. Toi, tu es le n°7.",
  "~ Tu cherches Inès des yeux. Tu ne la vois pas.",
  { if: v => v.conf >= 5 || v.slowburn, then: [
    "~ À la dernière seconde, la porte s'entrouvre. Une silhouette se glisse au troisième rang, essoufflée. Elle lève le pouce vers toi dans le noir.",
    { set: 'ines_concert' },
  ], else: [
    "~ Son siège réservé reste vide. Ton téléphone vibre dans ta poche.",
    "~ « Désolée, Max a eu un souci de voiture, j'arrive plus tard. Merde merde merde. »",
    { fx: { conf: -1 } },
  ] },
  "~ C'est ton tour. Tu appuies sur play.",
  { music: 'love' },
  "~ La pièce commence par le silence. Puis une vibration de téléphone, très basse. Puis la pluie de septembre. Une voix d'enfant qui dit « c'est ma place ». Un train. Une machine à café d'hôpital. Des baleines qui chantent.",
  "~ Et à la fin, pendant quatre secondes, juste le son d'une respiration sur un balcon.",
  "~ Silence. Puis l'amphi applaudit. Fort. Longtemps.",
  { if: v => v.ines_concert, then: [
    { scene: 'street', loc: 'Sortie de l’amphi · 22h', amb: 'street', music: 'night' },
    "~ Elle t'attend dehors. Elle a pleuré, son mascara le dit.",
    "ines: La place près de la fenêtre. Le balcon. L'hôpital. Les baleines.",
    "ines: C'était nous. Tout ça, c'était nous.",
    "ines: T'as fait de nous de la musique, {nom}.",
    { c: [
      { t: "Je sais pas faire autrement. Avec toi, tout devient de la musique.", fx: { aff: 2 }, then: ["~ Elle te prend le visage entre ses mains froides. Elle te regarde comme si elle te voyait pour la première fois.", "ines: T'es vraiment quelqu'un, tu sais."] },
      { t: "C'est juste des sons qui traînaient.", fx: { fz: 1 }, then: ["ines: Arrête. Arrête de faire ça. De te cacher derrière « c'est juste ».", "~ Elle a l'air presque en colère. Comme si tu lui volais quelque chose."] },
    ] },
  ] },
  { if: v => v.nora >= 3, then: [
    { scene: 'concert', loc: 'Coulisses · 22h20', music: 'night', amb: 'room' },
    "~ Nora est assise sur une caisse de matériel, son casque autour du cou. Elle vient de passer. Sa pièce, faite uniquement de bruits de cuisine, a fait rire et pleurer l'amphi.",
    "nora: Alors c'est elle. La personne dans ton morceau.",
    "nora: C'est beau, ce que tu ressens pour elle. Vraiment. J'ai eu des frissons.",
    "~ Elle sourit. Mais ses yeux ne suivent pas tout à fait.",
    { c: [
      { t: "Ta pièce était incroyable, Nora. La meilleure de la soirée.", fx: { nora: 1 } },
      { t: "Ça va, toi ? T'as l'air ailleurs.", fx: { nora: 2 }, set: 'nora_moment', then: [
        "nora: Moi ? Non, ça va. C'est juste…",
        "nora: Rien. C'est le bruitage de l'amitié, tu te souviens ? Essentiel et invisible.",
        "~ Elle rit, trop vite. Tu viens de comprendre quelque chose. Elle voit que tu as compris.",
        "nora: Oublie. Bonne soirée, binôme.",
        { mem: 'Nora ne t’a pas tout dit.' },
      ] },
    ] },
  ] },
  { endscene: 'ines', amb: 'none' },
  { go: 'c7_break' },
];

STORY.c7_break = [
  { day: 'Jeudi 19 décembre', time: '23:47', music: 'sad' },
  { if: v => v.ines_max, then: [
    "ines: c'est fini avec Max",
    { wait: 600 },
    { if: v => v.conf >= 6 && (v.went_hospital || v.stayed_phone || v.helped_ines), then: [
      "ines: c'est moi qui ai arrêté",
      "ines: il est gentil. vraiment. mais quand ça allait pas, c'était jamais lui que j'avais envie d'appeler",
      "ines: c'était toujours toi",
      { set: 'broke_for_you' },
      { mem: '« C’était toujours toi. »' },
    ], else: [
      "ines: il m'a dit que j'étais « trop compliquée » et qu'il avait « besoin de se concentrer sur sa musique »",
      "ines: génial. je suis plus compliquée qu'une table de mixage",
      { set: 'max_dumped' },
    ] },
    { c: [
      { t: "Tu veux que je vienne ? J'apporte de la glace et des films nuls.", fx: { conf: 1 }, then: ["ines: oui. viens. pistache. et pas de comédie romantique, je vais vomir"] },
      { t: "Je suis désolé, Inès.", then: ["ines: t'es pas désolé", "ines: t'as le droit de pas être désolé. moi je suis pas sûre de l'être"] },
      { t: "Enfin ! 🎉", fx: { jal: 2, conf: -1 }, then: ["ines: wow.", "ines: merci {nom}. vraiment sympa.", { seen: 'ines' }] },
    ] },
  ], else: [
    "ines: plus que 2 jours avant Grenoble",
    "ines: mes parents te réclament. mon père surtout. il veut te montrer sa nouvelle vie sans sel",
    "> J'ai hâte. Sauf pour le sans sel.",
  ] },
  { day: 'Vendredi 20 décembre', time: '19:00', music: 'happy' },
  "ines: on prend le même train demain ? le 9h12 ?",
  { c: [
    { t: "Le 9h12. Je prends les croissants.", fx: { aff: 1 } },
    { t: "Ok, je réserve deux places côte à côte.", fx: { conf: 1 } },
    { t: "Je pars plus tard, désolé. Je te rejoins là-bas.", fx: { aff: -1 }, set: 'train_alone' },
  ] },
  { open: 'sam' },
  "sam: tu pars demain ?",
  "sam: écoute-moi. Noël, la neige, votre ville natale, elle est célibataire",
  { if: v => v.slowburn || v.promise_noel, then: ["sam: et elle t'a littéralement donné RENDEZ-VOUS", "sam: si tu fais rien je te change les serrures"] },
  "sam: si tu dois lui dire, c'est maintenant. après il sera trop tard. c'est mon instinct de raton laveur",
  { c: [
    { t: "Je vais lui dire. J'en ai marre d'avoir peur.", fx: { sam: 1 }, set: 'resolve_tell' },
    { t: "Et si je perds tout ?", then: ["sam: tu perds rien. si elle dit non, tu gardes ton amie. et tu te gardes TOI, ce qui est pas mal non plus", "sam: tu peux pas vivre toute ta vie en bruit de fond, frère"] },
    { t: "Tu restes à Lyon pour Noël ?", fx: { sam: 2 }, then: ["sam: ouais. mes parents sont… compliqués. je reste ici avec mes plantes", { if: v => v.sam_helped || v.sam_party, then: ["sam: et Léa reste aussi. coïncidence. pure coïncidence"] }, "> Tu veux venir à Grenoble ? Ma mère adore nourrir les gens.", "sam: …t'es sérieux ?", "sam: non t'inquiète. mais merci. vraiment. ça me touche"] },
  ] },
  { recap: true },
  { go: 'c8' },
];

/* ==========================================================
   CHAPITRE 8 — Neige
   ========================================================== */
STORY.c8 = [
  { ch: 8, title: 'Neige', sub: 'Noël · Grenoble' },
  { day: 'Samedi 21 décembre', time: '09:12' },
  { if: v => !v.train_alone, then: [
    { scene: 'train', loc: 'TER Lyon → Grenoble · 9h12', music: 'snow', amb: 'street' },
    "~ Le train traverse un pays de plus en plus blanc. Inès a posé ses pieds sur le siège en face, ses écouteurs partagés avec toi : un pour elle, un pour toi.",
    "~ Elle a mis ton morceau. Elle fait semblant de dormir. Tu fais semblant de ne pas savoir qu'elle fait semblant.",
  ] },
  { endscene: 'maman', amb: 'none', music: 'happy', day: 'Dimanche 22 décembre', time: '11:30' },
  "maman: Mon chéri tu es où ? Je t'ai fait un gratin",
  "> Dans ma chambre, maman. À dix mètres de toi.",
  "maman: Je sais. Mais je préfère écrire, tu réponds plus vite",
  "maman: Philippe Moreau m'a appelée. Il vous invite à manger demain soir. Toi et nous",
  "maman: Il a dit, je cite : « il faut qu'on parle de l'avenir de nos enfants ». Il rigolait. Je crois",
  { c: [
    { t: "Maman. Non.", then: ["maman: Je n'ai RIEN dit 😇"] },
    { t: "Il a dit ça ?? 😳", fx: { aff: 0 }, then: ["maman: Ton père a déjà commandé le champagne. Je plaisante. Enfin non, il l'a fait."] },
  ] },
  { open: 'ines' },
  "ines: demain 17h devant le vieux collège ?",
  "ines: avant le repas. j'ai envie de marcher dans la neige. comme avant",
  "> 17h.",
  { go: 'c8_walk' },
];

STORY.c8_walk = [
  { day: 'Lundi 23 décembre', time: '17:00' },
  { scene: 'snownight', loc: 'Devant le vieux collège · Grenoble', music: 'snow', amb: 'wind', particles: 'snow' },
  "~ Il neige. Une vraie neige épaisse, de celles qui étouffent le bruit des voitures. Le collège est fermé, les grilles cadenassées, la cour blanche et vide.",
  "~ Inès est déjà là, bonnet jaune et nez rouge. Elle saute sur place pour se réchauffer.",
  "ines: Tu te rends compte ? On était là. Il y a huit ans. Nos deux petites têtes de nuls.",
  "~ Vous longez la grille. Elle montre du doigt une fenêtre du premier étage.",
  "ines: La salle 12. La place près de la fenêtre.",
  { c: [
    { t: "Ma place, que tu m'as volée.", fx: { aff: 1 }, then: ["ines: MA place. Tu me l'as laissée. C'est différent.", "> Je t'ai toujours tout laissé.", "~ Elle s'arrête de marcher. Elle te regarde. Tu n'as pas dit ça pour rire, et elle l'a entendu."] },
    { t: "On était insupportables.", then: ["ines: Toi t'étais insupportable. Moi j'étais adorable."] },
  ] },
  "~ Vous arrivez au banc du parc, en face du collège. Celui où vous mangiez vos goûters en 5e. Elle balaie la neige avec sa manche et s'assoit.",
  "~ Tu t'assois à côté d'elle. La neige tombe sur vos genoux.",
  { if: v => v.confessed_drunk, then: [
    "ines: Tu sais ce dont je me souviens, de la crémaillère ?",
    "ines: « Redis-le-moi quand je suis pas bourrée. »",
    "ines: Je suis pas bourrée, {nom}.",
  ] },
  { if: v => v.promise_noel, then: [
    "ines: Je t'avais promis. À Fourvière. Que je serais prête à Noël.",
    "ines: On est le 23. C'est presque Noël.",
  ] },
  { if: v => v.rejected_early, then: [
    "ines: J'ai beaucoup repensé à ce que tu m'avais dit sur le toit. À Halloween.",
    "ines: Je t'avais répondu trop vite. Je crois.",
  ] },
  "ines: {nom}… Est-ce que t'as quelque chose à me dire ?",
  "~ Ton cœur. Le froid. Huit ans. La place près de la fenêtre.",
  { c: [
    { t: "Inès. Je suis amoureux de toi. Depuis la 6e, je crois. Depuis toujours.", go: 'c8_confess', log: 'Sous la neige, tu lui as tout dit.' },
    { t: "[Lui prendre la main, sans rien dire]", go: 'c8_hand' },
    { t: "Rien. Je suis juste content d'être là, avec toi.", fx: { fz: 2 }, go: 'c8_silent', log: 'Sous la neige, tu n’as rien dit.' },
    { t: "[Le silence]", timeout: true, fx: { fz: 1 }, go: 'c8_silent', log: 'Le silence a parlé à ta place.' },
  ], timer: 15, prompt: 'Elle te regarde. La neige tombe.' },
];

STORY.c8_hand = [
  "~ Tu enlèves ton gant. Tu prends sa main. Elle est froide. Elle ne la retire pas.",
  { if: v => v.aff >= 7, then: [
    "~ Elle baisse les yeux sur vos doigts, puis les relève vers toi.",
    "ines: C'est ce que je crois ?",
    { c: [
      { t: "Oui. C'est exactement ce que tu crois.", go: 'c8_confess', log: 'Sous la neige, tu lui as pris la main, puis tu as tout dit.' },
      { t: "Je sais pas. J'avais froid.", fx: { fz: 2, aff: -1 }, go: 'c8_silent', log: 'Tu as pris sa main… puis tu as fait marche arrière.' },
    ] },
  ], else: [
    "~ Elle serre tes doigts une seconde. Puis elle les lâche doucement, et remet son gant.",
    "ines: T'as les mains gelées. Viens, on va être en retard chez mes parents.",
    { c: [
      { t: "Attends. Faut que je te dise. Je suis amoureux de toi, Inès.", go: 'c8_confess', log: 'Même quand elle s’est levée, tu as osé le dire.' },
      { t: "[La suivre]", fx: { fz: 1 }, go: 'c8_silent', log: 'Tu as lâché sa main et tu l’as suivie.' },
    ] },
  ] },
];

STORY.c8_confess = [
  { set: 'confessed_noel' },
  "> Je suis amoureux de toi. Je voulais pas que ça arrive, j'ai essayé que ça passe. Ça a jamais passé.",
  "> Je veux pas être ton grand frère. Je veux pas être ton repère. Je veux être… là. Autrement.",
  "> Et si c'est non, je serai pas fâché. Mais il fallait que tu le saches.",
  "~ Elle ne dit rien. La neige tombe sur ses cils. Elle a les yeux pleins d'eau.",
  { if: v => (v.slowburn ? (v.aff >= 7 && v.conf >= 5 && v.jal <= 3) : (v.aff >= 8 && v.conf >= 6 && v.fz <= 5 && v.jal <= 2)), then: [
    { music: 'love' },
    "ines: T'es vraiment lent, tu sais ça ?",
    "ines: Huit ans. HUIT ANS, {nom}.",
    "~ Elle rit et pleure en même temps. Elle attrape ton écharpe et te tire vers elle.",
    "~ Elle t'embrasse. Ses lèvres sont froides et elle sent la fleur d'oranger et la neige. Le monde fait silence, comme un amphi juste avant les applaudissements.",
    "ines: Moi aussi. Moi aussi, idiot.",
    { set: 'together', fx: { aff: 1, conf: 1, fz: -3 }, sfx: 'good', mem: 'Inès et toi, ensemble.' },
    "~ Vous arrivez en retard au repas. Couverts de neige. Main dans la main.",
    "~ Philippe Moreau lève les yeux de son assiette sans sel et dit simplement : « Ah. Enfin. » Ta mère renverse son verre.",
    { go: 'c8_nye' },
  ] },
  { if: v => v.aff >= 6 && v.jal <= 3, then: [
    "ines: {nom}…",
    "ines: Je… Je ressens quelque chose. Je le sais. Mais j'ai peur de me tromper. Je sors à peine d'une histoire, je me connais plus.",
    { if: v => !v.ines_max, then: ["ines: Et j'ai tellement peur de te perdre si on se rate."] },
    "ines: Est-ce que tu peux me laisser un peu de temps ? Pas pour toujours. Juste… le temps de savoir.",
    { c: [
      { t: "Prends le temps qu'il faut. Je serai là, quoi que tu décides.", fx: { conf: 2 }, set: 'needtime', mem: 'Elle a besoin de temps. Tu as dit que tu respecterais ça.' },
      { t: "Encore du temps ? J'en ai déjà donné beaucoup.", fx: { jal: 1, conf: -1 }, set: 'needtime', then: ["ines: Je sais. Je sais. Pardon.", "~ Elle se lève. La neige a recouvert vos traces sur le banc."] },
    ] },
    "~ Vous marchez jusque chez ses parents sans rien dire. À la porte, elle te serre très fort, longtemps.",
    { go: 'c8_nye' },
  ] },
  "ines: Oh, {nom}…",
  "ines: Je t'aime. Tellement. Mais… pas comme ça. T'es mon frère. T'es ma famille.",
  "ines: Je suis désolée. J'aurais tellement voulu que ce soit autrement. Pour toi.",
  { set: 'rejected_noel', sfx: 'bad' },
  { c: [
    { t: "C'est pas grave. Je voulais juste que tu saches.", fx: { conf: 1 }, then: ["~ Tu souris. Ça fait mal comme une dent qu'on arrache, mais tu souris. Et étrangement, quelque chose en toi respire."] },
    { t: "Je comprends. Je vais avoir besoin d'un peu de temps, par contre.", fx: { conf: 1 }, set: 'healthy_distance', mem: 'Tu as pris soin de toi.' },
    { t: "Tu dis ça parce que tu sors avec des mecs comme Max.", fx: { jal: 2, conf: -2 }, then: ["ines: …Quoi ?", "ines: T'as pas le droit de dire ça. Pas toi.", "~ Elle part. Tu restes seul sur le banc, sous la neige, à regretter chaque mot."] },
  ] },
  { go: 'c8_nye' },
];

STORY.c8_silent = [
  { set: 'silent_noel' },
  "~ Tu ne dis rien. Ou tu dis autre chose. Ça revient au même.",
  "~ Elle hoche la tête lentement. Elle regarde le collège.",
  "ines: Ouais. Moi aussi je suis contente.",
  { if: v => v.promise_noel || v.confessed_drunk || v.slowburn, then: [
    "ines: J'ai cru que… Non. Rien. Laisse.",
    { fx: { aff: -1 } },
    "~ Elle avait attendu. Tu l'as entendu dans sa voix. Elle avait attendu, et tu n'as rien dit.",
    { mem: 'Elle attendait quelque chose. Elle ne l’attendra peut-être plus.' },
  ] },
  "ines: Viens, on va être en retard.",
  "~ Vous marchez dans la neige, côte à côte. Vos traces sont parallèles. Elles ne se croisent pas.",
  { go: 'c8_nye' },
];

STORY.c8_nye = [
  { endscene: 'ines', amb: 'none', music: 'night', day: 'Mardi 31 décembre', time: '23:58' },
  "~ 31 décembre. Tu es à une soirée chez un ancien du lycée. Musique trop forte, cotillons, gens que tu ne reconnais plus.",
  { lock: true, time: '23:59' },
  { if: v => v.together, then: [
    "ines: viens dans la cuisine",
    "ines: maintenant",
    "ines: j'ai une tradition à inventer",
    { unlock: 'ines' },
    "~ Tu la trouves près du frigo. À minuit pile, pendant que tout le monde hurle dans le salon, elle t'embrasse au milieu des bouteilles vides.",
    "ines: Bonne année, toi.",
    { go: 'c8_end' },
  ] },
  { if: v => v.needtime, then: [
    { time: '00:00' },
    "ines: bonne année {nom}",
    "ines: je pense à toi. vraiment",
    "ines: je réfléchis. promis",
    { unlock: 'ines' },
    { c: [
      { t: "Bonne année Inès. Prends ton temps. ❤", fx: { conf: 1 } },
      { t: "Bonne année. Tu réfléchis à quoi exactement ?", fx: { jal: 1 }, then: ["ines: {nom}…", "ines: s'il te plaît."] },
    ] },
    { go: 'c8_end' },
  ] },
  { time: '00:00' },
  "ines: BONNE ANNÉE 🎉🎉",
  "ines: t'es où ?? on fait la photo de minuit !",
  { unlock: 'ines' },
  { c: [
    { t: "Bonne année Inès ❤", then: [] },
    { t: "Bonne année. J'avais besoin d'air.", req: v => v.rejected_noel, fx: { conf: 1 } },
    { t: "Bonne année. Que tous tes vœux se réalisent.", draft: true, then: ["ines: même ceux que je dis pas ?", "> Surtout ceux-là."], erase: ["> Bonne année !"], fx: { aff: 1 } },
  ] },
  { if: v => v.nora >= 4, then: [
    { wait: 600 },
    { open: 'nora' },
    "nora: Bonne année, binôme.",
    "nora: J'ai enregistré les feux d'artifice depuis mon balcon. Ça sonne comme de la friture. C'est magnifique.",
    { m: 'nora', voice: '0:12', t: "(Crépitements. Un chat qui miaule. Puis une voix, tout bas :) Bonne année, toi." },
    { set: 'nora_nye' },
  ] },
  { go: 'c8_end' },
];

STORY.c8_end = [
  { recap: true },
  { go: 'c9' },
];
