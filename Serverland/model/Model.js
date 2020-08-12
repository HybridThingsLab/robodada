const EventEmitter = require('events');

module.exports = class Model extends EventEmitter{
    constructor(){
        super();
        this._robots = [];
    }    
    
    addRobot(robot){
        this._robots.push(robot);
        console.log("Added " + JSON.stringify(robot) + "to robots");
        this.dispatchRobotListChanged();
    }

    get robots(){
        return this._robots;
    }

    dispatchRobotListChanged(){
        this.emit("notifyRobotListChanged", this.robots);       
    }
   
}