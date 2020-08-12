var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var webPort = 3000;
const path = require('path');
var config = require('../config');

module.exports = class WebController{
    constructor(model){
        
        let self = this;
        this._model = model;
        server.listen(webPort, function(){
            console.log("Listening on "+webPort+" in "+__dirname);
        });
        
        //app.use(express.static(path.join(__dirname + './../public')));
        app.use(express.static(path.join(__dirname + config.frontend_location_relative)));
                
        io.on('connection', function(socket){
            socket.on('moveToMsg', function(e){                
                self.controller.moveTo(e);
            })
        });
        
        this._model.on("notifyRobotListChanged", this._notifyRobotListChangedClients.bind(this));
        
    }

    setController(controller){
        this.controller = controller;
    }

    _notifyRobotListChangedClients(robots){
       
        io.emit("availableRobotsMessage", robots);        
    }
}