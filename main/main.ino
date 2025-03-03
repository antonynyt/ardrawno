#include <LiquidCrystal.h>

const int rs = 7, en = 6, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
const int BUTTON_PIN = 8;
const int FSR_PIN = A2;

struct Encoder {
  int pin_clk;
  int pin_dt;
  int counter;
  bool direction;
  int last_clk;
};

// Définition des encodeurs (modifier selon ton setup)
Encoder encoders[] = {
  {13, 12, 0, true, 0},  // Encodeur de gauche (leftEncoder)
  {11, 10, 0, true, 0}   // Encodeur de droite (rightEncoder)
};

const int numEncoders = 2;  // Nombre total d'encodeurs
int encoderValues[numEncoders] = {0}; // Stocke les valeurs pour affichage unique

// Fonction d'initialisation d'un encodeur
void initEncoder(Encoder &enc) {
  pinMode(enc.pin_clk, INPUT_PULLUP);
  pinMode(enc.pin_dt, INPUT_PULLUP);
  enc.last_clk = digitalRead(enc.pin_clk);
}

// Fonction de mise à jour d'un encodeur avec anti-rebond
void updateEncoder(Encoder &enc, int &storedValue) {
  int current_clk = digitalRead(enc.pin_clk);
  // Vérifier un changement d’état du signal CLK
  if (current_clk != enc.last_clk) {
    delayMicroseconds(500);  // Petit délai pour éviter les rebonds mécaniques
    // Vérification du sens de rotation
    if (digitalRead(enc.pin_dt) != current_clk) {  
      enc.counter++;
      enc.direction = true;
    } else {       
      enc.counter--;
      enc.direction = false;
    }
    
    storedValue = enc.counter; // Mettre à jour la valeur stockée
  }
  enc.last_clk = current_clk;  // Mise à jour de la dernière valeur lue
}

// Custom block symbols
byte full[8]  = {0b00000,0b00000,0b00000,0b00000,0b11111,0b11111,0b11111,0b11111};
byte four[8]  = {0b00000,0b00000,0b00000,0b00000,0b11110,0b11110,0b11110,0b11110};
byte three[8] = {0b00000,0b00000,0b00000,0b00000,0b11100,0b11100,0b11100,0b11100};
byte two[8]   = {0b00000,0b00000,0b00000,0b00000,0b11000,0b11000,0b11000,0b11000};
byte one[8]   = {0b00000,0b00000,0b00000,0b00000,0b10000,0b10000,0b10000,0b10000};


void setup() {
  Serial.begin(9600);

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(FSR_PIN, INPUT);

  // Initialisation de tous les encodeurs
  for (int i = 0; i < numEncoders; i++) {
    initEncoder(encoders[i]);
  }
}

int oldFsr, oldBtnState;

void loop() {
  bool valueChanged = false;

  // Mise à jour des encodeurs et détection d’un changement
  for (int i = 0; i < numEncoders; i++) {
    int oldValue = encoderValues[i]; // Stocke l'ancienne valeur
    updateEncoder(encoders[i], encoderValues[i]);

    if (encoderValues[i] != oldValue) {
      valueChanged = true; // Détecte un changement
    }
  }

  // ── Lecture du capteur de pression (FSR) ──
  int FsrValue = analogRead(FSR_PIN);
  if (FsrValue != oldFsr) {
    valueChanged = true;
    oldFsr = FsrValue; // Mise à jour de l'ancienne valeur
  }
  
  // Réinitialisation du FSR après lecture
  FsrValue = 0;

  // ── Lecture du bouton ──
  int isPainting = !digitalRead(BUTTON_PIN);
  if (isPainting != oldBtnState) {
    valueChanged = true;
    oldBtnState = isPainting; // Mise à jour de l'ancien état
  }

  if (valueChanged) {
    Serial.print(encoderValues[0]); // Encodeur gauche
    Serial.print(",");
    Serial.print(encoderValues[1]); // Encodeur droit
    Serial.print(',');
    Serial.print(!digitalRead(BUTTON_PIN));
    Serial.print(',');
    Serial.println(oldFsr);
  }
}