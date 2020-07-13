document.addEventListener("trkResult", function(r){
    let canvas = document.getElementsByClassName("emoji-canvas")[0];
    let dims = faceapi.matchDimensions(canvas, document.getElementsByClassName("cam-video")[0], true);
    let resizedResult = faceapi.resizeResults(r.trkResult, dims);
    //call drawEmoticon lateron
    
    drawEmoticon(resizedResult.detection.box, emotion);
});

document.addEventListener("emotionChanged", function(e){
    console.log(e.emotionString);
    emotion = e.emotionString;
});

let emotion = "happy";

const emoticons = {};

$(document).ready(function(){
    let allEmotions = ['neutral', 'happy', 'angry', 'surprised', 'disgusted','sad', 'fearful'];
    registerEmotions(allEmotions);
})

function registerEmotions(emotionStringArray){
    emotionStringArray.forEach(emot => {
        emoticons[emot] = new Image();
        emoticons[emot].src = "../img/"+emot+".svg";
    });
}

function drawEmoticon(box, emotionString){
    
    //console.log(box);
    
    
    let canvas = document.getElementsByClassName("emoji-canvas")[0];
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let scale = box.width/canvas.width*8;
    ctx.setTransform(scale, 0, 0, scale, box.x+box.width/2, box.y+box.height / 2);
 

    ctx.drawImage(emoticons[emotionString],-100 , -120 );
    

    /*
    ctx.fillStyle = "red";   
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 10, 0, 0, Math.PI*2);
    ctx.fill();
    */
    
}

