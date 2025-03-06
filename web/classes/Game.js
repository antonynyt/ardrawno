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
        this.gameState = GAME_STATES.WAITING_FOR_START;
        this.startTime = 0;
        this.remainingTime = 0;

        this.serialManager = new SerialManager();
        this.shapeLibrary = new ShapeLibrary();
        this.drawing = new Drawing();
        this.ui = new UI();

        this.currentShape = null;
        this.difficulty = "easy";
        this.width = window.innerWidth / 1.10;
        this.height = window.innerHeight / 1.20;

        // Prevents restarts immediately after finishing
        // false by default, set to true when game is done and if button is pressed
        this.needsButtonRelease = false;
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
        
        // Send new shape information to Arduino immediately
        console.log(this.currentShape.name);
        this.serialManager.sendShapeName(this.currentShape.name);
        
        this.gameState = GAME_STATES.SHOWING_TARGET;
        this.startTime = millis();
        this.drawing.clearPath();
    }

    draw() {
        background("#faebd7");

        // First state: waiting for Arduino button press
        if (this.gameState === GAME_STATES.WAITING_FOR_START) {
            this.ui.displayWaitingMessage();
            
            if (this.serialManager.isGameStarted()) {
                this.difficulty = this.serialManager.getDifficulty();
                console.log("Game started from Arduino signal");
                this.newGame();  // This will set gameState to SHOWING_TARGET
            }
            return;
        }
        
        // The rest of the game flow
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
                if (this.serialManager.isButtonPressed()) {
                    this.needsButtonRelease = true;
                }
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

            //TODO: SEND DRAWING TO API

            this.ui.displayEndMessage("FINI! Appuyez sur le bouton pour rejouer", this.width);

            if (this.needsButtonRelease) {
                if (!this.serialManager.isButtonPressed()) {
                    // Button has been released, now we can accept a new press
                    this.needsButtonRelease = false;
                }
            } 
            // Only handle a new button press if we don't need to wait for release
            else if (this.serialManager.isButtonPressed()) {
                this.serialManager.sendReset();
                this.gameState = GAME_STATES.WAITING_FOR_START;
            }
        }
    }
}

export default Game;
