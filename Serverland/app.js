const Model = require("./model/Model");
const Controller = require("./controller/Controller");
const WebController = require("./controller/WebController");

var model = new Model();
var controller = new Controller(model);
var webcontroller = new WebController(model);

webcontroller.setController(controller);