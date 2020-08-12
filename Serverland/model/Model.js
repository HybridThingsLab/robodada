module.exports = class Model {
    constructor(){
        this._robots = [];
    }    
    
    addRobot(robot){
        this._robots.push(robot);
        console.log("Added " + JSON.stringify(robot) + "to robots");
    }

    get robots(){
        return this._robots;
    }

    getRobotIpFromName(name){
        return this.robots.find(element => element.name == name).ip;
    }
}