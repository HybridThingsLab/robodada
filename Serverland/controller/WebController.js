const path = require('path');
var config = require('../config');
var fs = require('fs');
var https = require('https');

var express = require('express');
var app = express();

var options = {
    key: fs.readFileSync(config.privateSSLKey_location_relative),
    cert: fs.readFileSync(config.publicCert_location_relative)    
};

var webPort = 443;

var io; 



module.exports = class WebController{
    constructor(model){
        
        let self = this;
        this._model = model;

     
        var server = https.createServer(options, app);
        io = require('socket.io')(server);
        
    
        server.listen(webPort, function(){
            console.log("Listening on "+webPort+" in "+__dirname);
        });
        
        
        //app.use(express.static(path.join(__dirname + './../public')));
        app.use(express.static(path.join(__dirname + config.frontend_location_relative)));
                
        io.on('connection', function(socket){
            console.log("A client connected...");
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
                    console.warn("Client tried to claim nonexistent robot: " + name);
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