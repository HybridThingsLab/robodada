var socket = io();

$(document).ready(function(){
    console.log("rdy");
    $(".slider1").change(function(e){
        console.log(e.currentTarget.value);
        socket.emit('new_value', e.currentTarget.value);
    });
});
