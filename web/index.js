let serial;
let portName = "/dev/tty.usbmodem14401";

let rawData;
let x, y;
let initialDataReceived = false;
let buttonPressed = false;
let prevButtonPressed = false;
let currentWeight = 20;

let path = [];
let maxPathLength = 50;

let prevDeltaX = 0;
let prevDeltaY = 0;

const PIXEL_SCALE = 10;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    x = width / 2; // Start in the middle of the canvas
    y = height / 2;

    serial = new p5.SerialPort();
    serial.on("connected", serverConnected);
    serial.on("open", portOpen);
    serial.on("data", serialEvent);
    serial.on("error", serialError);
    serial.on("close", portClose);

    serial.list();
    serial.open(portName);
    frameRate(30);
}

function serverConnected() {
    console.log("Connected to server.");
}

function portOpen() {
    console.log("The serial port is opened.");
}

function serialError(err) {
    console.log("Serial port error:", err);
}

function portClose() {
    console.log("The serial port is closed.");
}

function serialEvent() {
    rawData = serial.readLine();
    if (!rawData || rawData.length === 0) return;

    console.log("Received:", rawData);

    let values = rawData.split(",");
    if (values.length === 4) { // Expect exactly 4 values
        let deltaX = Number(values[0]); // Change in X from encoder
        let deltaY = Number(values[1]); // Change in Y from encoder
        buttonPressed = Number(values[2]) === 1;

        let fsrValue = Number(values[3]);
        if (isNaN(fsrValue)) fsrValue = 0;
        currentWeight = map(fsrValue, 0, 70, 10, 50);

        // Update position using fixed increments if value changes
        if (deltaX > prevDeltaX) {
            x += PIXEL_SCALE;
        } else if (deltaX < prevDeltaX) {
            x -= PIXEL_SCALE;
        }
        if (deltaY > prevDeltaY) {
            y += PIXEL_SCALE;
        } else if (deltaY < prevDeltaY) {
            y -= PIXEL_SCALE;
        }

        // Constrain within canvas bounds
        x = constrain(x, 0, width);
        y = constrain(y, 0, height);

        if (!initialDataReceived) {
            initialDataReceived = true;
        }

        if (buttonPressed) {
            path.push({ pos: createVector(x, y), weight: currentWeight });
            if (path.length > maxPathLength) path.shift();
        } else if (!buttonPressed && prevButtonPressed) {
            path = [];
        }
        prevButtonPressed = buttonPressed;
        prevDeltaX = deltaX;
        prevDeltaY = deltaY;
    }
}

function draw() {
    background(255);

    if (initialDataReceived) {
        if (path.length > 1) {
            noFill();
            stroke(255, 0, 0);
            strokeCap(ROUND);
            
            for (let i = 1; i < path.length; i++) {
                const prevPoint = path[i - 1];
                const currPoint = path[i];

                const avgWeight = (prevPoint.weight + currPoint.weight) / 2;
                strokeWeight(avgWeight);
                line(prevPoint.pos.x, prevPoint.pos.y, currPoint.pos.x, currPoint.pos.y);
            }
        }
    }
    // Draw crosshair
    if (!buttonPressed) {
        stroke(1);
        strokeWeight(5);
        line(x - 10, y, x + 10, y);
        line(x, y - 10, x, y + 10);
    }
}
