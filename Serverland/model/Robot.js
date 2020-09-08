const RobotState = Object.freeze({
    CLAIMED : 0,
    AVAILABLE : 1
});

class Robot {
    constructor(name, ip){
        this.name = name;
        this.ip = ip;
        this.state = RobotState.AVAILABLE;
        this.clientDetails = {

        }
    }   
}

module.exports = {
    RobotState : RobotState,
    Robot : Robot
}