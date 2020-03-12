var socket = io();

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

$(document).ready(function(){
    let run = false;

    console.log("rdy");
    
     
   
    $(".control").mousemove(function(e){
        console.log((e.pageX-$(this).position().left)+" "+(e.pageY-$(this).position().top));
        run != run;
        
        socket.emit('moveToMsg', {
            name: "Bender",
            x: map_range(e.pageX-$(this).position().left, 0, 400, 0, 180),
            y: map_range(e.pageY-$(this).position().top, 0, 400, 0, 180)
        });
        
       
    
    });
      
});

