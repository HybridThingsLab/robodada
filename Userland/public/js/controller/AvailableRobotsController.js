const config = require('../../../../Serverland/config.js');
class AvailableRobotsController {
    constructor(){
        this.socket = io(config.certifiedURL, {            
            transports: ['websocket']            
        });

        this.socket.on("connect_error", err => {
            console.log('could not connect due to: '+ err.message);
        })

        this.socket.on("availableRobotsMessage", (message) =>{
            console.log("Recieved new available Robots list:");
            console.log(message);
            let event = new CustomEvent("notifyRecievedNewAvailableRobotsList", {detail: {robots: message, socketId: this.socket.id}});
            dispatchEvent(event);
        });

        this.socket.on("robotClaimed", (message) => {
            let event = new CustomEvent("notifyClaimRobotConfirmed", {detail: message});
            dispatchEvent(event);
        });
        
        this.socket.on("robotReleased", (message) => {
            let event = new CustomEvent("notifyReleaseRobotConfirmed", {detail: message});
            dispatchEvent(event);
        });
    }

    /**
     * @description notifies server of claimed robot
     * @param {string} robotName 
     */
    //TODO
    claimRobot(robotName) {
        this.socket.emit("claimRobot", robotName);
    }

    /**
     * @description notifies server that robot should be released
     */
    //TODO
    releaseRobot() {
        this.socket.emit("releaseRobot", {});
    }

    getAvailableRobotsList(){
        this.socket.emit("getAvailableRobots");
    }
}