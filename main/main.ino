#include <LiquidCrystal.h>

// LCD pin definitions
#define LCD_RS 7
#define LCD_EN 6
#define LCD_D4 5
#define LCD_D5 4
#define LCD_D6 3
#define LCD_D7 2
#define BUFFER_SIZE 64
#define FSR_THRESHOLD 10
#define BUTTON_PIN 8 // draw and start button pin
const int FSR_PIN = A2; // force sensitive resistor pin

enum GameState {
  WAITING_FOR_START,
  RUNNING
};

struct GameInfo {
  char word[20];
  char difficulty[12];
  bool hasNewData;
};

struct Encoder {
  int pin_clk; // Clock pin is the pin that sends the signal to the microcontroller when the encoder is rotated.
  int pin_dt; // Data pin is the pin that sends the signal to the microcontroller when the encoder is rotated.
  int counter;
  bool direction;
  int last_clk;
};

int oldFsr = 0, oldBtnState = 0;

LiquidCrystal lcd(LCD_RS, LCD_EN, LCD_D4, LCD_D5, LCD_D6, LCD_D7);

Encoder encoders[] = {
  {13, 12, 0, true, 0},  // leftEncoder
  {11, 10, 0, true, 0}   // rightEncoder
};

const int numEncoders = 2;
int encoderValues[numEncoders] = {0}; // Stocke les valeurs pour affichage unique

const char* difficultyLevels[] = {"EASY", "MEDIUM", "HARD"};
const int numDifficulties = 3;
int currentDifficultyIndex = 0; // Default to EASY

GameInfo gameInfo = {"", difficultyLevels[0], false};
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
      updateDifficultySelection(); // also show waiting message

      if (buttonState && !oldBtnState) {
        gameState = RUNNING;
        displayMessage("REGARDEZ L'ECRAN");
        delay(1000);
        Serial.print("START:"); // start with difficulty level
        Serial.println(difficultyLevels[currentDifficultyIndex]);
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

  // Encoder change detection
  for (int i = 0; i < numEncoders; i++) {
    int oldValue = encoderValues[i];
    updateEncoder(encoders[i], encoderValues[i]);

    if (encoderValues[i] != oldValue) {
      valueChanged = true;
    }
  }

  // FSR change detection
  int fsrValue = analogRead(FSR_PIN);
  if (abs(fsrValue - oldFsr) > FSR_THRESHOLD) {
    valueChanged = true;
    oldFsr = fsrValue;
  }

  if (valueChanged || buttonState != oldBtnState) {
    Serial.print("DATA:");
    Serial.print(encoderValues[0]); // Left encoder
    Serial.print(",");
    Serial.print(encoderValues[1]); // Right encoder
    Serial.print(",");
    Serial.print(buttonState);
    Serial.print(",");
    Serial.println(fsrValue);
  }
}

// Rotary Encoder implementation
void initEncoder(Encoder &enc) {
  pinMode(enc.pin_clk, INPUT_PULLUP);
  pinMode(enc.pin_dt, INPUT_PULLUP);
  enc.last_clk = digitalRead(enc.pin_clk);
}

void updateEncoder(Encoder &enc, int &storedValue) {
  int current_clk = digitalRead(enc.pin_clk);
  
  // A change indicates the encoder is rotating
  if (current_clk != enc.last_clk) {
    delayMicroseconds(800);
    current_clk = digitalRead(enc.pin_clk); //to ensure stable reading after debounce
    
    if (digitalRead(enc.pin_dt) != current_clk) {  // detect clockwise rotation
      enc.counter++;
      enc.direction = true;
    } else {       
      enc.counter--;
      enc.direction = false;
    }
    storedValue = enc.counter;
  }
  enc.last_clk = current_clk; 
}

//LCD implementation
// ----------------

void displayMessage(const char* message) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(message);
}

void displayWaitingMessage() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Start: Button");
  lcd.setCursor(0, 1);
  lcd.print("Diff: ");
  lcd.print(difficultyLevels[currentDifficultyIndex]);
}

void updateDifficultySelection() {
  // Update encoder values
  updateEncoder(encoders[0], encoderValues[0]);
  // Check for clockwise rotation
  if (encoders[0].direction) {
    currentDifficultyIndex = (currentDifficultyIndex + 1) % numDifficulties;
  }
  // Check for counter-clockwise rotation
  if (!encoders[0].direction) {
    currentDifficultyIndex = (currentDifficultyIndex - 1 + numDifficulties) % numDifficulties;
  }
  // Update the gameInfo with selected difficulty
  strcpy(gameInfo.difficulty, difficultyLevels[currentDifficultyIndex]);
  displayWaitingMessage();
}

void displayGameInfo(const char* word, const char* difficulty) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Draw: ");
  lcd.print(word);
  lcd.setCursor(0, 1);
  lcd.print(difficulty);
}

// Incoming serial processing implementation
// ----------------

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

// Parse incoming serial data
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