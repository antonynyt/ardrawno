import Game from "./classes/Game.js";

let game;

window.setup = function () {
    game = new Game();
    game.setup();
};

window.draw = function () {
    game.draw();
};

window.keyPressed = function () {
    game.keyPressed();
};
