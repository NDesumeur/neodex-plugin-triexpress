# Tri express

Un jeu de réflexes au centre de tri : les colis descendent le tapis roulant, envoie chacun dans le bac de sa couleur avant qu'il passe la ligne. Les bacs changent de place, et les bombes ne doivent surtout pas être triées.

*English version: [README.en.md](README.en.md)*

## Des règles qui changent (nouveau en 1.2.0)

Chaque colis a une couleur (son étiquette), une forme (carton, caisse en planches ou sac) et un poids (un à trois blocs noirs). On commence par trier par couleur ; tous les 30 colis, le patron annonce une nouvelle règle : par forme ou par poids. Les étiquettes des bacs changent avec la règle, et la règle en cours reste écrite en haut à gauche.

## Commandes

- **←** : bac de gauche, **↓** : bac du milieu, **→** : bac de droite. On peut aussi cliquer sur le bac.
- **P** : pause ; une touche pour reprendre.
- En fin de journée, une touche pour recommencer.

## Les règles

- Trois couleurs de colis, chacune avec sa forme pour la reconnaître sans les couleurs : **rouge cœur**, **bleu goutte**, **vert feuille**.
- Le colis le plus bas sur le tapis est celui que tu tries.
- **Bombes** (à partir du 9e colis trié) : ne rien faire. Elles passent la ligne toutes seules et rapportent 5 points ; en trier une, c'est **« Boum »**.
- Trois erreurs et la journée est finie. Une erreur, c'est un colis envoyé dans le **mauvais bac**, un colis qui passe la ligne sans être trié (**« Raté »**) ou une bombe triée.
- **Tous les 15 colis triés**, les bacs se mélangent : regarde bien où va chaque couleur.

## Points et vitesse

- Un colis bien trié vaut 10 points, multipliés par le combo : ×2 après 5 bons tris d'affilée, jusqu'à ×5 à partir de 20. Une erreur remet le combo à zéro.
- Le tapis accélère et les colis arrivent plus serrés au fil des colis triés, jusqu'à plus de trois fois la vitesse de départ.

## Records

Meilleur score, nombre de journées, colis triés et bombes évitées s'affichent à côté du jeu.

## Données et synchronisation

Record et statistiques sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Tri express → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).

## Plein écran, colis spéciaux et bombes

- **Plein écran** : bouton « PLEIN ÉCRAN ». Le jeu grandit aussi avec la fenêtre, du petit portable au grand écran.
- **Plus grand** : un tapis plus large et des colis plus gros, avec une grande étiquette.
- **Les bombes ne bloquent plus** : une bombe en tête de file file toute seule vers le trou, sans faire attendre les colis derrière elle. ↑ (ou Espace, ou un clic sur le tapis) la jette tout de suite, pour 5 points.
- **Colis fragile** (étiquette du verre) : il vole plus doucement et rapporte le double, mais il casse si tu le lances pendant qu'un autre colis vole encore.
- **Colis double** (deux cartons, « x2 ») : à envoyer deux fois dans le bon bac.
