# Documentation

## Recherche et conception

Le plus important dans une école et aussi en général, c’est d’avoir une bonne entente avec autrui, communiquer et collaborer. C’est pour cette raison que j’ai eu envie de créer un jeu où il n’y a pas de gagnants ou de compétition mais de l’entraide. Pour renforcer les liens et briser la glace, il faut dessiner en suivant un modèle.

Mon objectif était de proposer une expérience utilisateur originale, volontairement imparfaite mais amusante.

### Inspirations

Je me suis principalement inspiré du jeu _Etch A Sketch_ et de sa méthode particulière de dessiner : deux boutons à tourner qui contrôlent l'axe vertical et horizontal. Je me suis aussi inspiré du jeu _Dessiner c'est gagné_.

![Sketch de 2 boitiers: pour les couleurs et boutons rotatifs](/docs/assets/early-sketch.jpg)

J’ai testé plusieurs PoC. Un labyrinthe et le dessin. Le dessin s’est révélé plus amusant.

![Traits tramblant qui forme la moitié d'un triangle](/docs/assets/web-ui-poc.jpg)

Avec ce projet, je voulais aussi explorer la modélisation et l’impression 3D.

![Modelisation du boitier sur Fusion](/docs/assets/modelisation.jpg)

## Circuit électronique

![circuit sur breadboard avec écran LCD écrit Draw: carré](/docs/assets/early-circuit-2.jpg)

Le circuit utilise principalement les composants suivants:
- **Arduino Mega 2560**
- **Écran LCD 16x2**: Affiche les instructions, le modèle à dessiner et le temps restant
- **Encodeurs rotatifs KY-040**: Permettent de contrôler les positions X et Y du curseur de dessin
- **Capteur de force FSR402**: Détecte la pression appliquée pour modifier l'épaisseur du trait
- **Bouton poussoir**: Permet de démarrer le jeu et d'activer/désactiver le dessin

### Schéma

![Description de l'image](/docs/assets/schema_bb.jpg)

### BOM

| Réf | Composant      | Quantité | Description                            | Fournisseur / Lien                                            |
| --- | -------------- | -------- | -------------------------------------- | ------------------------------------------------------------- |
| 1   | Arduino Mega 2560 | 1        | Microcontrôleur ATmega2560             | [Arduino](https://store.arduino.cc/products/arduino-mega-2560-rev3) |
| 2   | Breadboard     | 1        | Plaque de prototypage                  |                                                     |
| 3   | KY-040         | 2        | Encodeur Rotatif                       | [BastelGarage](https://www.bastelgarage.ch/encodeur-rotatif-ky-040)   |
| 4   | FSR402         | 1        | Capteur de force                       |   |
| 5   | Button         | 1        | Bouton avec un cache de couleur        |   |

## Programme

Le programme se divise en deux parties principales :

1. Arduino
2. Interface Web

### Arduino
Il gère la lecture des capteurs et communique avec l’interface web via le port série.

Pour l'écran LCD, j'ai utiliser la [docs](https://docs.arduino.cc/learn/electronics/lcd-displays/) de arduino et la librairie [LiquidCrystal](https://docs.arduino.cc/libraries/liquidcrystal/).

Concernant les encodeurs rotatif, j'ai suivi ce [tutoriel](https://sensorkit.joy-it.net/fr/sensors/ky-040) pour l'implémenter. J'ai eu de la peine à gérer les variations lors de la rotation.

### Interface Web
Elle affiche le canevas de dessin et interprète les données reçues de l’Arduino.

Le programme est réalisé en HTML, CSS et JavaScript avec la librairie p5.js. J’utilise la version desktop de p5.serialControl.

### Marche à suivre

1. Connecter le Arduino et lancer p5.serialControl.
2. 
   ```javascript
   const SERIAL_PORT = '/dev/tty.usbmodem14201'; // Remplacez par votre port
   ```
2. Ouvrir le jeu web dans le navigateur, avec liveServer de VScode (par exemple).
3. Dessiner!

Retrouvez le guide d'installation complet pour modifier le projet dans le fichier [INSTALLATION.MD](docs/INSTALLATION.MD).

### Contrôles

- Button: Permet de dessiner et démarrer le jeu
- L'encodeur sur le boîtier du capteur de pression permet de choisir la difficulté.
- Force sensor: Controle l'épaisseur du trait
- Encodeurs rotatifs: Controle la position X et Y du trait.

## Roadmap et améliorationns

- Un bug d’affichage sur le LCD : la difficulté est affichée avec des lettres aléatoires.
- Actuellement, le jeu n’a pas de fin définie. Les dessins sont envoyés sur une page web, ce qui permet de conserver une trace sous forme de galerie.
- L’interface web nécessitera une amélioration de l’UI et de l’UX pour mieux expliquer ce qui se passe.

Je souhaitais afficher le timer sur l'écran LCD, mais cela bloque le dessin. Il y a également un problème d'accentuation, qui pourrait être résolu en créant des caractères personnalisés. C'est aussi de cette manière que je voulais implémenter le timer : sous forme de barre de chargement.

Un algorithme de reconnaissance de dessins pour attribuer un score était prévu. Il s’est avéré trop compliqué à mettre en place. Ce point pourrait être amélioré ultérieurement.

Dans le futur, l'idéal serait que la "console" soit indépendante du PC, par exemple avec un Raspberry Pi en mode kiosque ou un ESP32. Je verrais également ce jeu sous une forme modulaire. En connectant davantage de petits modules capteurs, le dessin évoluerait avec de nouvelles fonctionnalités. Par exemple, on pourrait ajouter un module de couleurs ou un autre module permettant d'ajouter une dimension pour passer en 3D.

Enfin, il serait intéressant d’envoyer les dessins sur une page web afin de constituer une galerie regroupant toutes les créations.