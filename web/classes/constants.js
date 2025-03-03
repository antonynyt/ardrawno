const GAME_STATES = {
    SHOWING_TARGET: "showingTarget",
    DRAWING: "drawing",
    DONE: "done",
};

const SERIAL_PORT = "/dev/tty.usbmodem14401";
const PIXEL_SCALE = 10;
const SHOW_TARGET_DURATION = 3000;
const DRAW_TIME_LIMIT = 15000;
const MAX_PATH_LENGTH = 500;

export {
    SERIAL_PORT,
    GAME_STATES,
    PIXEL_SCALE,
    SHOW_TARGET_DURATION,
    DRAW_TIME_LIMIT,
    MAX_PATH_LENGTH,
};
