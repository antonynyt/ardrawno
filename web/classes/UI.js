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
        text(`Temps restant: ${ceil(remainingTime / 1000)}s`, canvasWidth - 20, 20);

        // Draw current color indicator
        // fill(currentColor);
        // stroke(0);
        // rect(20, 20, 40, 40);

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
        text(`Dessinez: ${shapeName}`, canvasWidth / 2, 20);
        pop();
    }

    displayWaitingMessage() {
        push();
        textAlign(CENTER, CENTER);
        fill(0);

        textSize(18);
        text("Un dessin va apparaître puis disparaître.", width/2, height/2 - 80);
        text("Reproduisez-le le plus fidèlement possible en groupe.", width/2, height/2 - 50);
        
        textAlign(LEFT, CENTER);
        textSize(16);
        text("Instructions:", width/2 - 200, height/2 + 20);
        text("- Maintenez le bouton appuyé pour dessiner", width/2 - 200, height/2 + 50);
        text("- Un encodeur contrôle la position X", width/2 - 200, height/2 + 75);
        text("- Un autre encodeur contrôle la position Y", width/2 - 200, height/2 + 100);
        text("- Le capteur de pression contrôle l'épaisseur du trait", width/2 - 200, height/2 + 125);
        
        textAlign(CENTER, CENTER);
        textSize(18);
        text("Appuyez sur le bouton de l'Arduino pour commencer", width/2, height/2 + 180);
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
