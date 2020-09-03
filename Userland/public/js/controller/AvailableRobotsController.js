class AvailableRobotsController {
    constructor(){
        this.socket = io();
        this.socket.on("availableRobotsMessage", (message) =>{
            console.log("Recieved new available Robots list:");
            console.log(message);
            let event = new CustomEvent("notifyRecievedNewAvailableRobotsList", {detail: message});
            dispatchEvent(event);
        });

        this.socket.on("claimedRobot", (message) => {
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
        this.socket.emit("claimRobot", {name: robotName});
    }

    /**
     * @description notifies server that robot should be released
     */
    //TODO
    releaseRobot() {
        this.socket.emit("releaseRobot", {});
    }
}