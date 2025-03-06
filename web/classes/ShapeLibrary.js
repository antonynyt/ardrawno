class ShapeLibrary {
    constructor() {
        this.shapes = {
            easy: [
                {
                    name: "Carre",
                    path: (width, height) => this.generateSquare(width, height),
                    strokeWidths: [3],
                },
                {
                    name: "Triangle",
                    path: (width, height) => this.generateTriangle(width, height),
                    strokeWidths: [3],
                }
            ],
            medium: [                
                {
                    name: "Cercle",
                    path: (width, height) => this.generateCircle(width, height),
                    strokeWidths: [3],
                },
                {
                    name: "Fleche",
                    path: (width, height) => this.generateArrow(width, height),
                    strokeWidths: [3, 10, 3],
                }
            ],
            hard: [
                {
                    name: "Etoile",
                    path: (width, height) => this.generateStar(width, height),
                    strokeWidths: [3, 10, 3, 10, 3],
                }
            ],
        };
        this.currentShape = null;
    }

    getRandomShape(difficulty = "easy") {
        difficulty = difficulty.toLowerCase();
        if (!this.shapes[difficulty]) {
            difficulty = "easy";
        }

        const availableShapes = this.shapes[difficulty];
        const randomIndex = Math.floor(Math.random() * availableShapes.length);
        return availableShapes[randomIndex];
    }

    generateShape(shape, width, height) {
        this.currentShape = shape;
        return {
            name: shape.name,
            points: shape.path(width, height),
            strokeWidths: shape.strokeWidths,
        };
    }

    generateSquare(width, height) {
        const size = Math.min(width, height) * 0.3;
        const cx = width / 2,
            cy = height / 2;
        return [
            createVector(cx - size, cy - size),
            createVector(cx + size, cy - size),
            createVector(cx + size, cy + size),
            createVector(cx - size, cy + size),
            createVector(cx - size, cy - size),
        ];
    }

    generateCircle(width, height) {
        const radius = Math.min(width, height) * 0.2;
        const cx = width / 2,
            cy = height / 2;
        const points = [];
        const segments = 24;

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * TWO_PI;
            points.push(
                createVector(cx + radius * cos(angle), cy + radius * sin(angle))
            );
        }

        return points;
    }

    generateStar(width, height) {
        const cx = width / 2,
            cy = height / 2;
        const outerRadius = Math.min(width, height) * 0.3;
        const innerRadius = outerRadius * 0.4;
        const points = [];

        for (let i = 0; i < 10; i++) {
            const angle = -HALF_PI + (i * TWO_PI) / 10;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            points.push(
                createVector(cx + cos(angle) * radius, cy + sin(angle) * radius)
            );
        }

        points.push(points[0]); // Close the shape
        return points;
    }

    generateTriangle(width, height) {
        const size = Math.min(width, height) * 0.3;
        const cx = width / 2, cy = height / 2;
        return [
            createVector(cx, cy - size),
            createVector(cx + size, cy + size),
            createVector(cx - size, cy + size),
            createVector(cx, cy - size)
        ];
    }

    generateArrow(width, height) {
        const size = Math.min(width, height) * 0.3;
        const cx = width / 2, cy = height / 2;
        return [
            // Shaft
            createVector(cx - size, cy),
            createVector(cx + size * 0.5, cy),
            // Arrowhead
            createVector(cx + size * 0.5, cy - size * 0.5),
            createVector(cx + size, cy),
            createVector(cx + size * 0.5, cy + size * 0.5),
            createVector(cx + size * 0.5, cy)
        ];
    }
}

export default ShapeLibrary;
