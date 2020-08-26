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

            socket.on('getAvailableRobots', function(e){
                self._sendAvailableRobots(socket);
            })

            socket.on('claimRobot', function(name){
                //check if robot exists
                if(self.controller.getRobotByName(name)){
                    self._model.claimRobot(name, socket.id);
                    socket.emit("robotClaimed", self.controller.getRobotByName(name));
                } else {
                    console.warn("Client tried to claim nonexistent robot!");
                    socket.emit("robotClaimed", false);
                }
            })

            socket.on('releaseRobot', function(e){
                
                if(self.controller.getRobotBySocketId(socket)){
                    self._model.releaseRobot(self.controller.getRobotBySocketId(socket).name);
                    socket.emit("robotReleased", self.controller.getRobotBySocketId(socket));
                } else {
                    console.warn("Client tried to release a robot that he didn't claim or does not exist!");
                    socket.emit("robotReleased", false);
                }
            })

            self._sendAvailableRobots(socket);            
            
        });
        
        this._model.on("notifyRobotListChanged", this._notifyRobotListChangedClients.bind(this));
        
    }

    setController(controller){
        this.controller = controller;
    }

    _notifyRobotListChangedClients(robots){       
        io.emit("availableRobotsMessage", robots);
        console.log("send available robots message");
        console.log(robots);        
    }

    _sendAvailableRobots(sck){
        sck.emit("availableRobotsMessage", this._model.robots);
    }
}