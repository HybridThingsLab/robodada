/*  -> Demo implementation for landmarks
let canvas_landmarks = document.getElementsByClassName("face-landmarks")[0];
let ctx = canvas_landmarks.getContext("2d");


document.addEventListener("trkResult", function(e){
    $(".button-landmarks img").css("display", "none");
    $(".button-landmarks canvas").css("display", "block");
    
    //console.log("result");
    ctx.clearRect(0,0,200,200);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = "black";
    e.trkResult.unshiftedLandmarks.positions.forEach(l => {       
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(map(l.x, 0, e.trkResult.unshiftedLandmarks._imgDims.width, 0, 200), map(l.y, 0, e.trkResult.unshiftedLandmarks._imgDims.height, 0, 200), 2, 2, 0, 0, Math.PI*2);
          
    });    
    

});

*/