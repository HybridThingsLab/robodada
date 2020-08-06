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

        this.socket.emit('moveToMsg', {
            name: robotName,
            x: x,
            y: y
        });
    }
}