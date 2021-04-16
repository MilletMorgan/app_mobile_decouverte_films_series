# movies-list-groupe-6

Notre application permet de visualiser et d'interagir avec l'api de film TMDB. On peut consulter, chercher et réaliser différentes actions en lien avec notre compte TMDB.

## Prérequis
- [NPM](https://www.npmjs.com/)

- Émulateur android/ios ou l'application [Expo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=fr&gl=US)

- Un compte sur [The Movie Database](https://www.themoviedb.org/)

## Installation de la version de développement
```
git clone https://github.com/Mathis972/movies-list-groupe-6.git
```

```
cd movies-list-groupe-6
```

```
npm install
```

## Lancement de l'application (développement)

1.
```
npm start
```
2. Scanner le QR code qui s'affiche via l'application expo ou lancement via un emulateur.


## Utilisation de l'application
#### Connexion
La première page de l'application demande à l'utilisateur de se connecter, il lui suffit de renseigner ses identifiants du site The Movie Database.

#### Onglet films populaires
Cette page présente une liste de 10 films populaires dont 3 mis en avants. On peut y lire quelques informations à son propos. 
On peut sur chaque film cliquer dessus pour obtenir plus d'information sur celui-ci. 
Chaque film peut être ajouté en favoris ou bien ajouté à sa Watchlist.

#### Onglet séries populaires
Mêmes fonctionnalités que pour la page des films populaires, mais pour les séries.

#### Onglet Watchlist
Visualisation des films et séries ajoutées à sa watchlist. Possibilité de les retirer.

#### Bouton menu recherche
Cette page présente une barre de recherche qui permet de rechercher n'importe quoi en lien avec le cinéma, comme un acteur, réalisateur, film, etc. 
Il est possible de cliquer sur chaque élément pour obtenir plus d'information.

#### Bouton menu Profil
Cette page affiche des informations sur le compte comme le pseudo et la photo de profil. C'est également sur cette page que sont affichés les films et séries mis en favoris.

#### Bouton déconnexion
Permet de se déconnecter de l'application tmdb. Une reconnexion sera nécessaire pour accéder de nouveau à l'application.

#### Page détail
Comme dit précédemment, chaque élément est cliquable afin d'obtenir plus d'information comme les genres d'un film, 
son réalisateur, sa bande-annonce ou des informations sur un acteur par exemple. Il est possible d'ajouter un media
à sa watchlist ou en favoris mais également de noter le media.
