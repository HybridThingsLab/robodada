var osc = require('osc');
var config = require('../config');


module.exports = class Controller {
    constructor(model){
        this.model = model;
        let self = this;

        this.udpPort = new osc.UDPPort({
            localAddress: "0.0.0.0",
            localPort: 9999,
            metadata: true
        });

        this.udpPort.open();

        
        this.udpPort.on("message", function(oscMsg){
            
            switch(oscMsg.address){
                case "/hello":
                    let robot = model.helloRobot(oscMsg);
                    self.moveTo({
                        name: robot.name,
                        x: 60,
                        y: 60
                    });
                    break;
                
            }
        });
        
        this.udpPort.on("ready", function(){
            console.log("UDP ready");
        });
    }
    

    moveTo(moveMsg){
        
        this.udpPort.send({
            address: "/position",
            args: [
                {
                    type: "f",
                    value: moveMsg.x
                },
                {
                    type:"f",
                    value: moveMsg.y
                }            
            ]
        }, config.robot_ip, 9999);
        
    }

}




