/**
 * @description enumerator declaring the states for the main menu: 
 *              "planning", where emotion paths are decided and "playback", where you interact with the webcam stream
 */
const StatesEnum = Object.freeze ({"planning":0, "playback":1});

/**
 * @fires MainModel#notifyTrackResultChanged
 */
class MainModel{
    constructor(){
        this._trackingResult = {};
        this._trackedEmotion = {};
        this._currentState = StatesEnum.planning;
        this._selectedEmotion = undefined;
        this._connectedRobotName = "t-1000";
        this._availableRobots = [{name:"bender", ip:"1.2.3.4.5", state:0, clientDetails:{}}, {name:"r2d2", ip:"5.4.3.4.5", state:1, clientDetails:{}}, {name:"c3po", ip:"5.4.3.4.5", state:1, clientDetails:{}}, {name:"t-1000", ip:"5.4.3.4.5", state:0, clientDetails:{}}];
    }

    /**
     * @param {tracking result object} val
     * @event MainModel#notifyTrackResultChanged
     * @type {object}
     * @property {tracking result object}
     */
    set trackingResult(val){
        this._trackingResult = val;
        let event = new CustomEvent("notifyTrackingResultChanged", {detail: {tracking: this._trackingResult, emotion: this._trackedEmotion}});
        dispatchEvent(event);
    }

    get trackingResult(){
        return this._trackingResult;
    }

    set trackedEmotion(emotion) {
        this._trackedEmotion = emotion;
        let event = new CustomEvent("notifyTrackedEmotionChanged", {detail: this._trackedEmotion});
        dispatchEvent(event);
    }

    get trackedEmotion() {
        return this._trackedEmotion;
    }

    get currentState(){
        return this._currentState;
    }

    set currentState(newState){
        this._currentState = newState;
        let stateEvent = new CustomEvent("notifyStateChanged", {detail: this._currentState});
        dispatchEvent(stateEvent);
    }

    get selectedEmotion(){
        return this._selectedEmotion;
    }

    set selectedEmotion(emotion){
        this._selectedEmotion = emotion;
    }

    /**
     * @description Sets the name of the robot that should be moved
     * @param {String} name 
     */
    set connectedRobotName(name){
        this._connectedRobotName = name;
    }

    get connectedRobotName(){
        return this._connectedRobotName;
    }

    set availableRobots(val){
        this._availableRobots = val;
        let event = new CustomEvent("notifyAvailableRobotsChanged", {detail: this._availableRobots});
        dispatchEvent(event);
    }

    get availableRobots() {
        return this._availableRobots;
    }

}