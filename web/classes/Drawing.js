import { MAX_PATH_LENGTH } from "./constants.js";

class Drawing {
    constructor() {
        this.path = [];
        this.currentColor = color(255, 0, 0);
    }

    addPoint(x, y, weight) {
        this.path.push({
            pos: createVector(x, y),
            weight: weight,
            col: this.currentColor,
        });

        if (this.path.length > MAX_PATH_LENGTH) {
            this.path.shift();
        }
    }

    setColor(r, g, b) {
        this.currentColor = color(r, g, b);
    }

    getCurrentColor() {
        return this.currentColor;
    }

    getPath() {
        return this.path;
    }

    clearPath() {
        this.path = [];
    }

    drawPath() {
        if (this.path.length < 2) return;

        push();
        noFill();
        strokeCap(ROUND);

        for (let i = 1; i < this.path.length; i++) {
            let prev = this.path[i - 1],
                curr = this.path[i];
            stroke(prev.col);
            strokeWeight((prev.weight + curr.weight) / 2);
            line(prev.pos.x, prev.pos.y, curr.pos.x, curr.pos.y);
        }

        pop();
    }

    drawTarget(targetShape) {
        if (
            !targetShape ||
            !targetShape.points ||
            targetShape.points.length === 0
        )
            return;

        push();
        noFill();
        stroke(200, 200, 200, 150);

        const points = targetShape.points;
        const widths = targetShape.strokeWidths || [3];

        // Draw each segment with potentially different stroke weights
        for (let i = 1; i < points.length; i++) {
            const widthIndex = (i - 1) % widths.length;
            strokeWeight(widths[widthIndex]);
            line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
        }

        pop();
    }
}

export default Drawing;
