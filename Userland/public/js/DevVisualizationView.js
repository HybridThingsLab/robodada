function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(60);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

let rotationBottom = 0;
let rotationSpeedBottom = 1;
let rotationTop = -90;
let rotationSpeedTop = 1;

function draw() {
    //getRotationValues();

    background(255);
    smooth();
    push();
    fill(0);
    noStroke(0);
    translate(0, 40, 0);
    box(30);

    pop();
    fill(0);
    stroke(255);
    rotateY(radians(rotationBottom));
    box(70, 60, 70);

    stroke(0);
    strokeWeight(5);
    noFill();
    translate(0, -60 / 2, 0);
    rotateX(radians(rotationTop));
    translate(0, -40, 0);
    box(90, 90, 30);

}

window.addEventListener("message", recieveMessage);

function recieveMessage(event) {
    console.log(event.data);
    getRotationValues(event.data);
}


function getRotationValues(data) {
    let pathData = data._pathData;
    let currentPosition;
    if (data._playback) {
        currentPosition = pathData[data._playbackPos];
    } else {
        currentPosition = pathData[pathData.length - 1];
    }

    if (currentPosition != undefined) {
        rotationBottom = map(currentPosition.x, 0, 1, -90, 90);
        rotationTop = map(currentPosition.y, 0, 1, 90, -90);
    }
}