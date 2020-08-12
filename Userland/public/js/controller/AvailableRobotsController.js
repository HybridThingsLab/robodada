class AvailableRobotsController {
    constructor(){
        this.socket = io();
        this.socket.on("availableRobotsMessage", (message) =>{
            console.log("Recieved new available Robots list:");
            console.log(message);
            let event = new CustomEvent("notifyRecievedNewAvailableRobotsList", {detail: message});
            dispatchEvent(event);
        })
    }

    /**
     * @description notifies server of claimed robot
     * @param {string} robotName 
     */
    //TODO
    claimRobot(robotName) {
        this.socket.emit("claimRobotMessage", {robotName: robotName});
    }

    /**
     * @description notifies server that robot has been released
     * @param {string} robotName 
     */
    //TODO
    releaseRobot(robotName) {
        this.socket.emit("releaseRobotMessage", {robotName: robotName});
    }
}