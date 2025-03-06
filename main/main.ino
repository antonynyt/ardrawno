#include <LiquidCrystal.h>
#include "EncoderHandler.h"
#include "LCDHandler.h"
#include "SerialHandler.h"

enum GameState {
  WAITING_FOR_START,
  RUNNING
};

const int BUTTON_PIN = 8; // draw and start button pin
const int FSR_PIN = A2; // force sensitive resistor pin

int oldFsr = 0, oldBtnState = 0;

LiquidCrystal lcd(LCD_RS, LCD_EN, LCD_D4, LCD_D5, LCD_D6, LCD_D7);

Encoder encoders[] = {
  {13, 12, 0, true, 0},  // Encodeur de gauche (leftEncoder)
  {11, 10, 0, true, 0}   // Encodeur de droite (rightEncoder)
};

const int numEncoders = 2;
int encoderValues[numEncoders] = {0}; // Stocke les valeurs pour affichage unique

GameInfo gameInfo = {"", "EASY", false};
GameState gameState = WAITING_FOR_START;

// Buffer for serial input
// holds chars as they arrive one by one from the serial connection
// allows to collect partial messages until a complete command is received, rather than processing one character at a time
char inputBuffer[BUFFER_SIZE];
int bufferIndex = 0; // Increments as each character is added to the buffer

void setup() {
  Serial.begin(9600);

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(FSR_PIN, INPUT);

  lcd.begin(16, 2); //init LCD
  displayWaitingMessage();

  // Init all encoders
  for (int i = 0; i < numEncoders; i++) {
    initEncoder(encoders[i]);
  }
}

void loop() {
  // Process any incoming serial data
  processSerial(gameInfo);
  
  // Check button state for game start
  int buttonState = !digitalRead(BUTTON_PIN);
  
  switch (gameState) {
    case WAITING_FOR_START:
      if (buttonState && !oldBtnState) {
        gameState = RUNNING;
        Serial.println("START"); // Notify the server
        displayMessage("REGARDEZ L'ECRAN");
        delay(1000);
      }
      break;
      
    case RUNNING:
      sendSensorData(buttonState);
      if (gameInfo.hasNewData) {
        displayGameInfo(gameInfo.word, gameInfo.difficulty); //update LCD
        gameInfo.hasNewData = false;
      }
      break;
  }
  
  oldBtnState = buttonState;
}

void sendSensorData(int buttonState) {
  bool valueChanged = false;

  // Mise à jour des encodeurs et détection d'un changement
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

  if (valueChanged || buttonState != oldBtnState) {
    Serial.print("DATA:");
    Serial.print(encoderValues[0]); // Encodeur gauche
    Serial.print(",");
    Serial.print(encoderValues[1]); // Encodeur droit
    Serial.print(",");
    Serial.print(buttonState);
    Serial.print(",");
    Serial.println(oldFsr);
  }
}

// Encoder implementation
void initEncoder(Encoder &enc) {
  pinMode(enc.pin_clk, INPUT_PULLUP);
  pinMode(enc.pin_dt, INPUT_PULLUP);
  enc.last_clk = digitalRead(enc.pin_clk);
}

void updateEncoder(Encoder &enc, int &storedValue) {
  int current_clk = digitalRead(enc.pin_clk);
  // Vérifier un changement d'état du signal CLK
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

void displayMessage(const char* message) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(message);
}

void displayWaitingMessage() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Appuyez sur");
  lcd.setCursor(0, 1);
  lcd.print("un bouton");
}

void displayGameInfo(const char* word, const char* difficulty) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Draw: ");
  lcd.print(word);
  lcd.setCursor(0, 1);
  lcd.print(difficulty);
}

// Serial processing implementation
void processSerial(GameInfo& gameInfo) {
  if (Serial.available() > 0) {
    while (Serial.available() > 0) {
      char c = Serial.read();
      
      // Adds characters to the buffer until it receives a newline character
      if (c != '\n' && bufferIndex < BUFFER_SIZE - 1) {
        inputBuffer[bufferIndex++] = c;
      } 
      // End of message, process it
      else {
        inputBuffer[bufferIndex] = '\0'; // Null-terminate the string
        parseSerialData(inputBuffer, gameInfo);
        bufferIndex = 0; // Reset buffer
      }
    }
  }
}

void parseSerialData(char* buffer, GameInfo& gameInfo) {
  // Check if string is 6 characters long and starts with "SHAPE:"
  if (strncmp(buffer, "SHAPE:", 6) == 0) {
    // Copy the word into the game info struct
    strncpy(gameInfo.word, buffer + 6, sizeof(gameInfo.word) - 1);
    gameInfo.hasNewData = true;
  }
  // Check if string is 5 characters long and starts with "DIFF:"
  else if (strncmp(buffer, "DIFF:", 5) == 0) {
    strncpy(gameInfo.difficulty, buffer + 5, sizeof(gameInfo.difficulty) - 1);
    gameInfo.hasNewData = true;
  }
  // If reset command
  else if (strncmp(buffer, "RESET", 5) == 0) {
    gameInfo.hasNewData = true;
    displayWaitingMessage();
    gameState = WAITING_FOR_START;
  }
}