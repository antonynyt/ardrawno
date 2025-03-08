# Guide d'installation

Ce document explique comment installer et configurer le projet.

## Prérequis

- Arduino IDE (version 1.8.x ou supérieure)
- [p5.serialcontrol](https://github.com/p5-serial/p5.serialcontrol/releases) pour la communication série
- Un navigateur web

## Installation matérielle

1. Assemblez le circuit selon le schéma fourni dans la documentation principale
2. Connectez l'Arduino à votre ordinateur via USB

## Installation logicielle

### Arduino

1. Ouvrez Arduino IDE
2. Installez les bibliothèques requises via le gestionnaire de bibliothèques:
   - LiquidCrystal

3. Ouvrez le fichier sketch `main.ino`
4. Sélectionnez le bon port et le modèle de carte (Arduino Mega 2560)
5. Téléversez le programme sur la carte

### Interface Web

1. Installez p5.serialcontrol
2. Dans p5.serialcontrol, ouvrez le port correspondant à votre Arduino
3. Ouvrez le fichier `index.html` dans un serveur web local (comme Live Server de VSCode)

## Configuration

Modifiez le fichier `/web/classes/constants.js` pour indiquer le port USB correct:
   ```javascript
   const SERIAL_PORT = '/dev/tty.usbmodem14201'; // Remplacez par votre port
   ```

## Dépannage

- **Problème**: Pas de connexion série, l'interface web ne réagit pas
  **Solution**: Vérifiez que p5.serialcontrol est lancé et que le bon port est sélectionné (dans le fichier `/web/classes/constants.js` aussi), relancez le programme p5.serialcontrol et essayer de débrancher/rebrancher le Arduino.
