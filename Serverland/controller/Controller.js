var osc = require('node-osc');
var config = require('../config');
var os = require('os');
var Robot = require("../model/Robot");


module.exports = class Controller {
    constructor(model){
        this.model = model;
        
        this.oscserver = new osc.Server(9998, '0.0.0.0', () => {
            //when server is running, look for robots every 15s
            this.searchRobots();
            setInterval(this.searchRobots.bind(this), 15000);
        });
        
        this.oscserver.on("message", function(oscMsg, rinfo){                  
            
            switch(oscMsg[0]){
                case '/helloServer':
                    let newRobot = new Robot(oscMsg[1], rinfo.address);                    
                    //check if robot is already in database
                    if(! model.robots.find(element => element.name == newRobot.name)){
                        model.addRobot(newRobot);
                    }

                    break;
                default:
                    console.warn('Undefined robot msg!');
            }
                             
        });              
    }   
    
    moveTo(moveMsg){
        if(this.model.robots.find(element => element.name == moveMsg.name)){
            let client_send = new osc.Client(this.getRobotIpFromName(moveMsg.name), '9999');
            client_send.send('/position',moveMsg.x, moveMsg.y, () => {
                client_send.close();
            })
        } else {
            console.warn("Requested Robot "+ moveMsg.name +" does not exist!");
        }        
              
    }

    getRobotIpFromName(name){
        return this.model.robots.find(element => element.name == name).ip;
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




