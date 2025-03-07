# Documentation

## Recherche et conception

Le plus important dans une école et aussi en général, c’est d’avoir une bonne entente avec autrui, communiquer et collaborer. C’est pour cette raison que j’ai eu envie de créer un jeu où il n’y a pas de gagnants ou de compétition mais de l’entraide. Pour renforcer les liens et briser la glace, il faut dessiner en suivant un modèle. Cela rends la chose ludique.

Je me suis inspiré principalement du jeu **Etch A Sketch** et sa particularité pour dessiner: deux boutons à tourner qui contrôlent l'axe vertical et horizontal. Ma vision de base était sous forme de console, puis avec deux stelles indépendantes.

![Sketch d'une console avec boutons et écran](/docs/assets/console.jpg)

Je voulais aussi faire une expérience utilisateur volontairement mauvaise mais amusante.

![Sketch de 2 boitiers: pour les couleurs et boutons rotatifs](/docs/assets/early-sketch.jpg)

J'ai testé plusieurs PoC de jeux. Un labyrith et le dessin. Ce dernier était plus amusant.

![Traits tramblant qui forme la moitié d'un triangle](/docs/assets/web-ui-poc.jpg)

Avec ce projet, je souhaitais aussi essayer la modelisation et l'impression 3D.

![Modelisation du boitier sur Fusion](/docs/assets/modelisation.jpg)

## Circuit électronique

![circuit sur breadboard avec écran LCD écrit Draw: carré](/docs/assets/early-circuit-2.jpg)

LCD
KY-040 Rotary Encoders

[LCD](https://docs.arduino.cc/learn/electronics/lcd-displays/)

`Quelques notes sur des composants particuliers de mon projet, des liens vers des datasheets, etc.`

### Schéma

![Description de l'image](/docs/assets/schema_bb.jpg)

### BOM

| Réf | Composant      | Quantité | Description                            | Fournisseur / Lien                                            |
| --- | -------------- | -------- | -------------------------------------- | ------------------------------------------------------------- |
| 1   | Arduino Mega 2560 | 1        | Microcontrôleur ATmega2560             | [Arduino](https://store.arduino.cc/products/arduino-mega-2560-rev3) |
| 2   | Breadboard     | 1        | Plaque de prototypage                  | [Lien](#)                                                     |
| 3   | KY-040         | 2        | Encodeur Rotatif                       | [BastelGarage](https://www.bastelgarage.ch/encodeur-rotatif-ky-040)   |
| 4   | FSR402         | 1        | Capteur de force                       | [Lien](#)   |
| 5   | Button         | 1        | Bouton avec un cache de couleur        | [Lien](#)   |

## Programme

`Quelques notes sur des le code, des particularités, sa structure, l'usage de libs particulières, etc.`

### Marche à suivre

1. Connecter le Arduino et lancer p5.serialControl.
2. Indiquer le port USB dans le fichier `constants.js`.
2. Ouvrir le jeu dans le navigateur, avec liveServer de VScode (par exemple).
3. Dessiner!

### Contrôles

- Button: Permet de dessiner et démarrer le jeu
- Force sensor: Controle l'épaisseur du trait
- Encodeurs rotatifs: Controle la position X et Y du trait.

## Roadmap

Je souhaitais afficher le timer sur l'écran LCD mais cela bloque le dessin. Il y a aussi un problème d'accent, qui peut être résolu en créeant des caractères personnalisés. C'est aussi de cette manière que je voulais créer le timer: une barre de chargement.

Dans le futur, l'idéal serait que la “console” soit indépendante du PC avec un Raspberry Pi en mode kiosk par exemple.  Également, je verrai bien ce jeu modulable. En connectant plus de petits cubes de capteurs, le dessin évolue avec de nouvelles fonctionnalités. Par exemple, on rajoute un “cube” couleurs ou un microphone qui permet de dessiner avec la voix où rajoute une dimension pour passer en 3D.