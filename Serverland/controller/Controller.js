var osc = require('node-osc');
var config = require('../config');
var os = require('os');


module.exports = class Controller {
    constructor(model){
        this.model = model;
        
        this.oscserver = new osc.Server(9999, '0.0.0.0');
        
        this.oscserver.on("message", function(oscMsg, rinfo){
            
            switch(oscMsg.address){
                case "/helloServer":
                    console.log("Hello Server received from ");
                    console.log(oscMsg);
                    console.log(rinfo);                    
                    break;
                
            }
        });
        
        
       

        //look for robots every 15s
        this.searchRobots();
        setInterval(this.searchRobots.bind(this), 15000);       
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

    searchRobots(){ 
        
        let ifaces = os.networkInterfaces();
        let searchIf = "";
        let searchalias;
        
        Object.keys(ifaces).forEach(function (ifname) {
          var alias = 0;
        
          ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
              // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
              return;
            }
        
            if (alias >= 1) {
              // this single interface has multiple ipv4 addresses
              //console.log(ifname + ':' + alias, iface.address);
            } else {
              // this interface has only one ipv4 adress
              //console.log(ifname, iface.address, iface.netmask);
                if(searchIf == ""){
                    searchIf = ifname;
                    searchalias = alias+1;
                }
            }
            ++alias;
          });
        });
       
        console.log("Searching robots on", searchIf, ifaces[searchIf][searchalias].address, ifaces[searchIf][searchalias].netmask);
        let netmask = ifaces[searchIf][searchalias].netmask.split('.');
        let cnt = 0;
       
        for(let n = 0; n<netmask.length; n++){
            cnt = cnt + parseInt(netmask[n]);
        }        

        if(cnt != 3*255){
            console.log("The robosearch works only for class-c nets at the moment...sorry!");
            return;
        }

        let iparray = ifaces[searchIf][searchalias].address.split('.');
        let ipstring = iparray[0]+"."+iparray[1]+"."+iparray[2]+".";
        
        for(let i = 1; i<255; i++){
            let searchip = ipstring+i;
            let client_send = new osc.Client(searchip, '9999');
            client_send.send('/helloRobot','',() => {client_send.close(); });                                
        }
       
    }

}




