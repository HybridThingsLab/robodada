var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var webPort = 3000;

module.exports = class WebController{
    constructor(){

        server.listen(port, function(){
            console.log("Listening on "+port);
        });
        
        app.use(express.static(__dirname + '/public'));
                
        io.on('connection', function(socket){
            socket.on('new_value', function(e){
                console.log("send new value " +e.value+ " to "+e.target);
               
            })
        });   
        
    }
}