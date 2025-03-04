#ifndef ENCODER_HANDLER_H
#define ENCODER_HANDLER_H

#include <Arduino.h>

struct Encoder {
  int pin_clk;
  int pin_dt;
  int counter;
  bool direction;
  int last_clk;
};

// Initialize an encoder
void initEncoder(Encoder &enc);

// Update encoder value with anti-bounce protection
void updateEncoder(Encoder &enc, int &storedValue);

#endif // ENCODER_HANDLER_H
