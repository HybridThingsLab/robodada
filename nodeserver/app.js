var osc = require('osc');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = 3000;
server.listen(port, function(){
    console.log("Listening on "+port);
});

app.use(express.static(__dirname + '/public'));

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 9999,
    metadata: true
});

udpPort.open();

io.on('connection', function(socket){
    socket.on('new_value', function(val){
        console.log("send new value " +val);
        udpPort.send({
            address: "/led",
            args: [
                {
                    type: "i",
                    value: val
                }            
            ]
        }, "192.168.1.200", 9999);
    })
});

udpPort.on("ready", function(){
    console.log("UDP ready");
});