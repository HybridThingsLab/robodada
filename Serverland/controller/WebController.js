var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var webPort = 3000;
const path = require('path');

module.exports = class WebController{
    constructor(){
        let self = this;
        server.listen(webPort, function(){
            console.log("Listening on "+webPort+" in "+__dirname);
        });
        
        //app.use(express.static(path.join(__dirname + './../public')));
        app.use(express.static(path.join(__dirname + './../../Userland/public')));
                
        io.on('connection', function(socket){
            socket.on('moveToMsg', function(e){
                console.log("send new value " +e.x+ " to "+e.y);
                self.controller.moveTo(e);
            })
        });   
        
    }

    setController(controller){
        this.controller = controller;
    }
}