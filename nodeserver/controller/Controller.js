var osc = require('osc');


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
                    type: "i",
                    value: moveMsg.x
                },
                {
                    type:"i",
                    value: moveMsg.y
                }            
            ]
        }, "192.168.1.200", 9999);
        
    }

}




