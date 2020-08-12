class RobotView {
    constructor() {
        this.socket = io();
    }

    /**
     * @description Sends object with x and y [0,1] to move to, adressed to robot name
     * @param {String} robotName 
     * @param {float} x 
     * @param {float} y 
     */
    handleMovementCommand(robotName, x, y) {
        console.log(robotName, "moveto:", x, y);

        //TODO remove hardcoded robot name
        robotName = "Bender";

        //movement commands should only be sent if a robot is connected
        if(robotName != undefined){
            this.socket.emit('moveToMsg', {
                name: robotName,
                x: x,
                y: y
            });
        }
    }
}