#ifndef SERIAL_HANDLER_H
#define SERIAL_HANDLER_H

#include <Arduino.h>

#define BUFFER_SIZE 64

struct GameInfo {
  char word[20];
  char difficulty[12];
  bool hasNewData;
};

// Parse incoming serial data
void parseSerialData(char* buffer, GameInfo& gameInfo);

// Process any available serial data
void processSerial(GameInfo& gameInfo);

#endif // SERIAL_HANDLER_H
