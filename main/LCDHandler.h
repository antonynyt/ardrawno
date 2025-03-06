#ifndef LCD_HANDLER_H
#define LCD_HANDLER_H

#include <LiquidCrystal.h>

// LCD pin definitions
#define LCD_RS 7
#define LCD_EN 6
#define LCD_D4 5
#define LCD_D5 4
#define LCD_D6 3
#define LCD_D7 2

// Initialize LCD
extern LiquidCrystal lcd;

// Initialize LCD and custom characters
void initLCD();

// Display welcome message
void displayWelcomeMessage();

// Display a general message on the LCD
void displayMessage(const char* message);

// Display game information (word, difficulty, time)
void displayGameInfo(const char* word, const char* difficulty, int timeRemaining);

// Display waiting message
void displayWaitingMessage();

#endif // LCD_HANDLER_H
