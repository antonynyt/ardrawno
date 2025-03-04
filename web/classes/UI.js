class UI {
    constructor() {}

    drawInterface(
        remainingTime,
        currentColor,
        x,
        y,
        buttonPressed,
        canvasWidth
    ) {
        push();

        // Draw time remaining
        textSize(24);
        noStroke();
        fill(0);
        textAlign(RIGHT, TOP);
        text(`Time: ${ceil(remainingTime / 1000)}s`, canvasWidth - 20, 20);

        // Draw current color indicator
        fill(currentColor);
        stroke(0);
        rect(20, 20, 40, 40);

        // Draw cursor crosshair if not drawing
        if (!buttonPressed) {
            stroke(0);
            strokeWeight(2);
            line(x - 10, y, x + 10, y);
            line(x, y - 10, x, y + 10);
        }

        pop();
    }

    displayShapeName(shapeName, canvasWidth) {
        push();
        textSize(32);
        noStroke();
        fill(0);
        textAlign(CENTER, TOP);
        text(`Draw a ${shapeName}`, canvasWidth / 2, 20);
        pop();
    }

    displayWaitingMessage() {
        push();
        textAlign(CENTER, CENTER);
        fill(0);
        textSize(16);
        text("Appuyez sur le bouton de l'Arduino pour commencer", width/2, height/2 + 40);
        pop();
    }

    displayEndMessage(message, canvasWidth) {
        push();
        textAlign(CENTER, CENTER);
        textSize(24);
        fill(0);
        text(message, canvasWidth/2, 50);
        pop();
    }
}

export default UI;
