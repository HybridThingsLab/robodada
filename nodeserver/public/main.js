var socket = io();

$(document).ready(function(){
    console.log("rdy");
    $("input[type='range']").change(function(e){
        console.log(e);
        console.log(e.currentTarget.value);
        socket.emit('new_value', {
            target: e.currentTarget.className,
            value: e.currentTarget.value
        });
    });    
});
