# Lu à 23h12

Un jeu narratif par messages, en français. Tu incarnes un étudiant en création sonore qui vient d'arriver à Lyon, en même temps qu'Inès, sa meilleure amie depuis la 6e. Il l'aime en secret depuis six ans. Un semestre, de septembre à février, pour savoir ce que vous êtes l'un pour l'autre.

## Jouer

Aucune installation, aucune dépendance. Il suffit de servir le dossier :

```bash
python3 -m http.server 8000
```

puis d'ouvrir <http://localhost:8000>. (Ouvrir `index.html` directement fonctionne aussi dans la plupart des navigateurs.)

### Sur iPhone

Le jeu est pensé pour l'iPhone. Une fois le dossier en ligne (GitHub Pages, Netlify…) :
ouvre l'adresse dans Safari, touche **Partager** puis **Sur l'écran d'accueil**. Le jeu s'ouvre
alors en plein écran comme une vraie app, garde ta progression et fonctionne même hors ligne.
Sur iOS 16 et avant, coupe le mode silencieux pour entendre le son.

🎧 À jouer avec le son : la musique et les bruitages sont générés en temps réel (Web Audio).

## Contenu

- **10 chapitres + épilogue**, de septembre à la Saint-Valentin, soit environ 45 min à 1 h par partie (et beaucoup plus pour voir toutes les fins)
- **7 fins** très différentes : *Nous deux*, *Meilleurs amis*, *Friendzoné*, *Le fantôme*, *Trop tard*, *Plan-séquence*, *Bruit blanc*
- **Environ 70 choix par partie**, et un scénario en arbre avec plus de 60 nœuds et des embranchements qui se rejoignent ou divergent selon tes décisions passées
- 6 jauges cachées (Complicité, Confiance, Friendzone, Jalousie, Sam, Nora) et des dizaines de souvenirs (« Inès s'en souviendra ») qui changent les dialogues des chapitres suivants

## Mécaniques

- **Messagerie** : indicateur « écrit… », accusés « Distribué » / « Vu à… », plusieurs conversations (Inès, Sam, Nora, Maman, groupes), notifications, photos, messages vocaux
- **Choix minutés** : la barre se vide au rythme d'un battement de cœur. Ne rien répondre, c'est aussi répondre.
- **Brouillons** : certains messages s'écrivent dans la barre de saisie, puis c'est à toi de choisir entre *Envoyer* et *Effacer*
- **Écran verrouillé et appels** : un appel à 2h47 du matin, tu décroches ou pas
- **Scènes « vraie vie »** façon visual novel : café, soirée, balcon, hôpital, neige… avec décors, particules et ambiances sonores
- **Récap** à la fin de chaque chapitre, **carnet** de relation consultable à tout moment
- **Sauvegarde automatique** à chaque chapitre, **sélection de chapitre** et **galerie des fins**
- Options : volume musique / effets, vitesse du texte, avance rapide (`F`), raccourcis clavier (`Espace`, `1` à `4`)

## Structure

```
index.html, style.css
js/audio.js      moteur audio procédural (musiques par ambiance, bruitages, ambiances)
js/engine.js     moteur narratif (modes chat / verrouillé / appel / scène, choix, stats)
js/main.js       menu, options, carnet, chapitres, fins
story/*.js       le scénario, chapitre par chapitre
tools/simulate.js  vérifie l'arbre et simule des milliers de parties
```

### Écrire du scénario

Chaque nœud est une liste d'étapes. Les lignes simples s'écrivent comme du texte :

```js
"ines: t'es réveillé ?"          // message d'un contact (ou réplique en scène)
"lea@groupe: Bienvenue !"        // message dans un groupe
"> Oui."                          // message envoyé par le joueur
"~ Il pleut sur Lyon."            // narration
{ c: [ { t: "Réponse", fx: { aff: 1 }, set: 'flag', then: [...], go: 'noeud' } ], timer: 8 }
{ if: v => v.aff >= 7, then: [...], else: [...] }
```

Pour vérifier l'arbre après une modification :

```bash
node tools/simulate.js 20000            # parties aléatoires
node tools/simulate.js 3000 romantic    # stratégies : romantic, doormat, jealous, absent, nora
```

En ajoutant `?auto=1&seed=3` à l'URL, le jeu se joue tout seul dans le navigateur (test de bout en bout).
