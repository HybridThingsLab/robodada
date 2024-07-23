const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

let canv = document.querySelector("#canvas");

////OPEN OVERLAY
let intervalID;
let main = document.getElementById("main");
let overlay = document.getElementById("overlay");
overlay.style.display = 'none';

let current_emotion;

document.querySelectorAll(".wrapper-emotion > button")
    .forEach(function(button) {
        button.addEventListener('click', function() {
            //main.style.display = 'none';
            main.style.filter = 'blur(4px)';
            overlay.style.display = 'block';

            //add emotion name to overlay
            current_emotion = this.innerText.trim();
            //instruction sentence
            document.querySelectorAll('.emotion-var')[0].innerText = current_emotion;
            //add emoji to drawing panel
            document.querySelectorAll('.emotion-var')[1].innerHTML = "<img class=\"draw_icon\" src=\"img/"+ current_emotion +".svg\" >";

            //enable drawing to canvas
            initOverlay();
        })
    });







////CLOSE OVERLAY

document.querySelector(".close").addEventListener('click', (evt) => {
    closeOverlay();
});

document.getElementById("overlay").addEventListener('click', (evt) => {
    closeOverlay();
});

//clicking the canvas doesnt close the overlay
document.getElementById("overlay").childNodes.forEach((item)=>{
    item.addEventListener('click', (evt)=>{
        evt.stopPropagation();
    })
})

function closeOverlay(){
    paths[current_emotion] = mousePositions;
    mousePositions = [];
    main.style.display = 'block';
    main.style.filter = '';
    overlay.style.display = 'none';
    pendown = false;
    recording = false;
    stoppedRecording = false;
    playback = false;
    switchPlaybackButton();
    clearInterval(intervalID);
}










////CANVAS CONTENTS
const lineColor = "#6bc95d";
const recordingColor = "#FF0000";
const playbackColor = "#E27022";

const pollingRate = 10;

let playback = false;
let playbackProgress = 0;
let playbackbutton = document.querySelector(".play");
let loopbutton = document.querySelector(".loop");
let deletebutton = document.querySelector(".delete");

let mouseX = 0;
let mouseY = 0;

let recording;
let stoppedRecording;
let timeElapsed;

//time is needed for recording feedback point in corner
let startTime;
let stoppedAt = -1;

let context;
let mousePositions;
let ignoreLength = 5;
let paths = {
    neutral: null,
    happy: null,
    angry: null,
    surprised: null,
    disgusted: null,
    sad: null,
    fearful: null
};
let pathsLoop = {
    neutral: true,
    happy: true,
    angry: true,
    surprised: true,
    disgusted: true,
    sad: true,
    fearful: true
}

let image = new Image();
image.onload = function(){}
image.src = "img/overlay/robot_movement.png";
let border = 15;

let boundingBox;

let addedEventListeners = false;

function stopRecording(){
    recording = false; 
    stoppedRecording = true;
    stoppedAt = timeElapsed;
}







////EVENTLISTENER CANVAS

function addCanvasEventListeners(){
    canv.addEventListener('mousemove', (evt) => {
        mouseX = evt.clientX - boundingBox.left;
        mouseY = evt.clientY - boundingBox.top;
    });

    canv.addEventListener('mouseup', (evt) => {
        pendown = false; 
        if(recording){
            stopRecording();
        }
        if(mousePositions.length < ignoreLength){
            mousePositions = [];
            recording = false; 
            stoppedRecording = false;
        }
    });
    
    canv.addEventListener('mousedown', (evt) => {
        if(mousePositions.length == 0 || mousePositions.length < ignoreLength){
            pendown = true;
            //while pressing down
            mousePositions.push({mouseX, mouseY});
            recording = true;
            playback = false;
            switchPlaybackButton();
        } else {
            //draw attention to delete button if path is already drawn
            let deleteButton = document.querySelector(".delete");
            deleteButton.style.background = '#EA5A47';
            deleteButton.style.transform = "scale(1.1)";
            setTimeout(()=>{
                deleteButton.style.background = '';
                deleteButton.style.transform = "";
            }, 250);
        }
    });
    
    // canv.addEventListener('mouseleave', (evt) => {
    //     pendown = false; 
    //     if(recording){
    //         stopRecording();
    //     }
    // });
}







////EVENTLISTENER CANVAS MENU BUTTONS

function addEventListeners(){
    playbackbutton.addEventListener('click', (evt) => {
        if(mousePositions.length > ignoreLength){
            playback = !playback;
            playbackProgress = 0;
        }
        switchPlaybackButton();
    });
    
    loopbutton.addEventListener('click', (evt) => {
        switchLoopButton();
    });
    
    //delete path
    deletebutton.addEventListener('click', (evt) =>{
        mousePositions = [];
        paths[current_emotion] = null;
        playback = false;
        playbackProgress = 0;
        switchPlaybackButton();
    });
}

function switchPlaybackButton(){
    if (playback) {
        playbackbutton.firstElementChild.src = "img/overlay/pause.svg";
    } else {
        playbackbutton.firstElementChild.src = "img/overlay/play.svg"
    }
}

function switchLoopButton(){
    pathsLoop[current_emotion] = !pathsLoop[current_emotion];
    setLoopButton();
}

function setLoopButton(){
    console.log(current_emotion, pathsLoop[current_emotion]);
    if (pathsLoop[current_emotion]) {
        loopbutton.firstElementChild.src = "img/overlay/loop.svg";
    } else {
        loopbutton.firstElementChild.src = "img/overlay/play_once.svg";
    }
}






////PATH DRAWING

function initOverlay(){
    canv = document.getElementById("canvas");
    canv.style.width = '100%';
    canv.style.height = '100%';
    canv.width = canv.offsetWidth;
    canv.height = canv.offsetHeight;

    if(!addedEventListeners){
        addCanvasEventListeners();
        addEventListeners();
        addedEventListeners = true;
    }
    
    
    context = canv.getContext("2d");
    boundingBox = canv.getBoundingClientRect();
    mousePositions = [];
    recording = false;
    stoppedRecording = false;
    //time is needed for recording feedback point in corner
    startTime = new Date().getTime();
    stoppedAt = -1;

    playbackProgress = 0;
    //load previous path
    if (paths[current_emotion] != null) {
        mousePositions = paths[current_emotion];
    }

    setLoopButton();

    //start drawing only if mousebutton is down
    pendown = false;
    intervalID = setInterval(doFrame, pollingRate);
}

function drawRecordingIndicator(){
    if(recording){
        context.beginPath();
        context.globalAlpha = map(Math.cos(timeElapsed / 500 * Math.PI), -1.0, 1.0, 0.0, 1.0);
        context.fillStyle = recordingColor;
        context.strokeStyle = "#FFFFFF00";
        context.arc(canv.width / 20, canv.height / 20, canv.width / 30, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
}

function drawConfirmIndicator(){
    if(stoppedAt == -1){
        stoppedAt = timeElapsed;
    }
    context.beginPath();
    if(timeElapsed - stoppedAt > 1250){
        context.globalAlpha = 1.0 - map(timeElapsed - stoppedAt, 1250, 1500, 0.0, 1.0);
    } else if(timeElapsed - stoppedAt >= 1500){
        context.globalAlpha = 0.0;
    } else {
        context.globalAlpha = 1.0;
    }
    context.fillStyle = lineColor;
    context.strokeStyle = "#FFFFFF00";
    context.arc(canv.width / 20, canv.height / 20, canv.width / 30 * Math.min(map(timeElapsed - stoppedAt, 0, 150, 0.0, 1.0), 1.0), 0, 2 * Math.PI);
    context.fill();
    context.closePath();
    if(timeElapsed - stoppedAt >= 2000){
        stoppedRecording = false;
        stoppedAt = -1;
    }
}

function clearCanvas(){
    context.clearRect(0, 0, canv.width, canv.height);
    context.globalAlpha = 0.07;
    context.drawImage(image,border,border,canv.width-2*border,canv.height-2*border); 
}

//Draws green path
function drawPath() {
    context.globalAlpha = 1.0;
    context.lineCap = "round";
    context.lineWidth = 5;
    context.strokeStyle = lineColor;
    context.beginPath();
    for(let i = 0; i < mousePositions.length - 1; i++){
        context.moveTo(mousePositions[i].mouseX, mousePositions[i].mouseY);
        context.lineTo(mousePositions[i+1].mouseX, mousePositions[i+1].mouseY);
    }
    context.stroke();
}

function drawPlaybackIndicator() {
    context.globalAlpha = 1.0;
    context.beginPath();
    context.fillStyle = playbackColor;    
    context.arc(mousePositions[playbackProgress].mouseX, mousePositions[playbackProgress].mouseY, canv.width / 40, 0, Math.PI * 2);
    if(playback){
        playbackProgress += 1;
    }
    console.log(playbackProgress);
    if(pathsLoop[current_emotion]){
        playbackProgress %= mousePositions.length;
    } else if(playbackProgress >= mousePositions.length - 1){
        playback = false;
        playbackProgress = mousePositions.length - 1;
        console.log("test");
        switchPlaybackButton();
    }
    context.fill();
    context.closePath();
}

function doFrame() {
    timeElapsed = new Date().getTime() - startTime;
    clearCanvas();
    drawPath();
    if(recording && pendown){
        mousePositions.push({mouseX, mouseY});
        drawRecordingIndicator();
    } else if(!recording && mousePositions.length > 0){
        drawPlaybackIndicator();
    } else if(stoppedRecording){
        drawConfirmIndicator();
    }
}








////SERVO VISUALIZATION

document.getMousePositions = function(){
    return mousePositions;
};

document.getRecording = function(){
    return recording;
}

document.getPlayback = function(){
    return playback;
}

document.getPlaybackPositions = function(){
    if(mousePositions != undefined)
        return mousePositions[playbackProgress];
}

////START DEV VISUALIZATION
document.addEventListener('keydown', (key)=>{
    if(key.code == "F2"){
        let visualizationWindow = window.open("dev_visualization.html","dev_visualization","channelmode, width=700, height=600, menubar=no, scrollbars=no, status=no, toolbar=no");
    }
})


