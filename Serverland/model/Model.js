const EventEmitter = require('events');
const { RobotState } = require('./Robot');

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

    claimRobot(name, clientSocketId){
        this._robots[name].state = RobotState.CLAIMED;
        this._robots[name].clientDetails = {
            id: clientSocketId
        }

        this.dispatchRobotListChanged();
    }


    get robots(){
        return this._robots;
    }

    dispatchRobotListChanged(){
        this.emit("notifyRobotListChanged", this.robots);       
    }
   
}