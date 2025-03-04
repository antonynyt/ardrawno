import { PIXEL_SCALE, SERIAL_PORT } from "./constants.js";

class SerialManager {
    constructor() {
        this.serial = new p5.SerialPort();
        this.portName = SERIAL_PORT;
        this.rawData = null;
        this.x = 0;
        this.y = 0;
        this.initialDataReceived = false;
        this.buttonPressed = false;
        this.prevButtonPressed = false;
        this.currentWeight = 20;
        this.prevDeltaX = 0;
        this.prevDeltaY = 0;
        this.gameStarted = false;
    }

    setup(canvasWidth, canvasHeight, onDataReceived) {
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.onDataReceived = onDataReceived;

        this.serial.on("connected", () => {
            console.log("Connected");
        });

        this.serial.on("open", () => console.log("Port open"));

        this.serial.on("data", () => this.serialEvent());

        this.serial.on("error", (err) => console.log("Serial error:", err));

        this.serial.on("close", () => {
            console.log("Port closed");
        });

        this.serial.list();
        this.serial.open(this.portName);
    }

    async close() {
        if (this.serial) {
            await this.serial.close();
        }
    }

    serialEvent() {
        this.rawData = this.serial.readLine();
        if (!this.rawData) return;

        // Check if it's a START message
        if (this.rawData.trim() === "START") {
            this.gameStarted = true;
            console.log("Game started by Arduino");
            return;
        }

        // Only process DATA: messages
        if (!this.rawData.startsWith("DATA:")) return;

        // Remove the prefix
        const dataStr = this.rawData.substring(5);

        let values = dataStr.split(",");
        if (values.length === 4) {
            let deltaX = Number(values[0]);
            let deltaY = Number(values[1]);
            this.prevButtonPressed = this.buttonPressed;
            this.buttonPressed = Number(values[2]) === 1;
            let fsrValue = Number(values[3]) || 0;
            this.currentWeight = map(fsrValue, 0, 70, 10, 50);

            if (deltaX > this.prevDeltaX) this.x += PIXEL_SCALE;
            else if (deltaX < this.prevDeltaX) this.x -= PIXEL_SCALE;

            if (deltaY > this.prevDeltaY) this.y += PIXEL_SCALE;
            else if (deltaY < this.prevDeltaY) this.y -= PIXEL_SCALE;

            this.x = constrain(this.x, 0, this.canvasWidth);
            this.y = constrain(this.y, 0, this.canvasHeight);

            this.initialDataReceived = true;
            this.prevDeltaX = deltaX;
            this.prevDeltaY = deltaY;

            if (this.onDataReceived) {
                this.onDataReceived(
                    this.x,
                    this.y,
                    this.buttonPressed,
                    this.currentWeight
                );
            }
        }
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    isButtonPressed() {
        return this.buttonPressed;
    }

    getCurrentWeight() {
        return this.currentWeight;
    }

    isGameStarted() {
        return this.gameStarted;
    }

    async sendCommand(command) {
        if (this.serial) {
            const encoder = new TextEncoder();
            const data = encoder.encode(command + '\n');
            try {
                await this.serial.write(data);
            } catch (error) {
                console.error('Error sending command:', error);
            }
        }
    }

    async sendShapeName(shapeName) {
        await this.sendCommand(`SHAPE:${shapeName}`);
    }

    async sendDifficulty(difficulty) {
        await this.sendCommand(`DIFF:${difficulty}`);
    }

    async sendReset() {
        await this.sendCommand("RESET");
        this.gameStarted = false;
    }
}

export default SerialManager;
