import {
    GAME_STATES,
    SHOW_TARGET_DURATION,
    DRAW_TIME_LIMIT,
} from "./constants.js";
import SerialManager from "./SerialManager.js";
import ShapeLibrary from "./ShapeLibrary.js";
import Drawing from "./Drawing.js";
import UI from "./UI.js";

class Game {
    constructor() {
        this.gameState = GAME_STATES.SHOWING_TARGET;
        this.startTime = 0;
        this.remainingTime = 0;

        this.serialManager = new SerialManager();
        this.shapeLibrary = new ShapeLibrary();
        this.drawing = new Drawing();
        this.ui = new UI();

        this.currentShape = null;
        this.difficulty = "beginner";
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    setup() {
        createCanvas(this.width, this.height);
        frameRate(30);

        const randomShape = this.shapeLibrary.getRandomShape(this.difficulty);
        this.currentShape = this.shapeLibrary.generateShape(
            randomShape,
            this.width,
            this.height
        );

        this.serialManager.setup(
            this.width,
            this.height,
            this.handleSerialData.bind(this)
        );
        this.startTime = millis();
    }

    handleSerialData(x, y, buttonPressed, weight) {
        if (this.gameState === GAME_STATES.DRAWING && buttonPressed) {
            this.drawing.addPoint(x, y, weight);
        }
    }

    //TODO: REPLACE BY ARDUINO
    keyPressed() {
        if (key === "r") this.drawing.setColor(255, 0, 0);
        if (key === "g") this.drawing.setColor(0, 255, 0);
        if (key === "y") this.drawing.setColor(255, 255, 0);
        if (key === "n") this.newGame(); // New game shortcut
    }

    newGame() {
        const randomShape = this.shapeLibrary.getRandomShape(this.difficulty);
        this.currentShape = this.shapeLibrary.generateShape(
            randomShape,
            this.width,
            this.height
        );
        this.gameState = GAME_STATES.SHOWING_TARGET;
        this.startTime = millis();
        this.drawing.clearPath();

        // TODO: send shape name through serial
        this.serialManager.sendShapeName(this.currentShape.name);
    }

    draw() {
        background(255);

        if (this.gameState === GAME_STATES.SHOWING_TARGET) {
            this.drawing.drawTarget(this.currentShape);
            this.ui.displayShapeName(this.currentShape.name, this.width);

            if (millis() - this.startTime > SHOW_TARGET_DURATION) {
                this.gameState = GAME_STATES.DRAWING;
                this.startTime = millis();
            }
        } else if (this.gameState === GAME_STATES.DRAWING) {
            this.remainingTime = DRAW_TIME_LIMIT - (millis() - this.startTime);

            if (this.remainingTime <= 0) {
                this.gameState = GAME_STATES.DONE;
            }

            // Target shape is not displayed during drawing
            this.drawing.drawPath();

            const { x, y } = this.serialManager.getPosition();
            const buttonPressed = this.serialManager.isButtonPressed();
            this.ui.drawInterface(
                this.remainingTime,
                this.drawing.getCurrentColor(),
                x,
                y,
                buttonPressed,
                this.width
            );
        } else if (this.gameState === GAME_STATES.DONE) {

            // Show both the drawing and target for comparison
            this.drawing.drawTarget(this.currentShape);
            this.drawing.drawPath();

            //TODO: save drawing to API
        }
    }
}

export default Game;
