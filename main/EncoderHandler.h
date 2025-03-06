#ifndef ENCODER_HANDLER_H
#define ENCODER_HANDLER_H

#include <Arduino.h>

struct Encoder {
  int pin_clk; // Clock pin is the pin that sends the signal to the microcontroller when the encoder is rotated.
  int pin_dt; // Data pin is the pin that sends the signal to the microcontroller when the encoder is rotated.
  int counter;
  bool direction;
  int last_clk;
};

// Initialize an encoder
void initEncoder(Encoder &enc);

// Update encoder value with anti-bounce protection
void updateEncoder(Encoder &enc, int &storedValue);

#endif // ENCODER_HANDLER_H
