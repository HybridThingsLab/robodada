var Robot = require("./Robot");

module.exports = class Model {
    constructor(){
        this.robots = [];
    }

    helloRobot(helloMsg){        
        let robot = new Robot(helloMsg.args[0].value, helloMsg.args[1].value);
        if(!this.robots.find(element => element.name == robot.name)){
            this.robots.push(robot);
            console.log("Added " + JSON.stringify(robot) + "to robots");
        } else {
            console.warn(JSON.stringify(robot) + " already exists");
        }
        return robot;
    }

    getRobotIpFromName(name){
        return this.robots.find(element => element.name == name).ip;
    }
}