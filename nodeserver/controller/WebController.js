var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//var webPort = 3567;
const path = require('path');

module.exports = class WebController {
    constructor() {
        let self = this;
        var webPort = process.env.PORT || 3000;
        server.listen(webPort, function () {
            console.log("Listening on " + webPort + " in " + __dirname);
        });

        //app.use(express.static(path.join(__dirname + './../public')));
        //app.use(express.static(path.join(__dirname + './../../../Unfriendly robots/ROBODADA/public')));
        app.use(express.static(path.join(__dirname + './../../../workshop-unfriendlyrobots/ROBODADA/public')));

        io.on('connection', function (socket) {
            socket.on('moveToMsg', function (e) {
                console.log("send new value " + e.x + " to " + e.y);
                self.controller.moveTo(e);
            })
        });

    }

    setController(controller) {
        this.controller = controller;
    }
}