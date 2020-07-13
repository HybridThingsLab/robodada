/**
 * @description enumerator for easier access of the available emotions
 */
const EmotionEnum = Object.freeze({"disgusted": 0, "sad": 1, "fearful": 2, "neutral": 3, "happy": 4, "angry": 5, "surprised": 6});


class EmotionModel {
    constructor() {
        this._emotionArray = [];
        this.initializeEmotionObjects();
    }
    
    /**
     * @description fills emotion array with emotion objects based on available emotions
     */
    initializeEmotionObjects() {
        for (let emotion in EmotionEnum) {
            this._emotionArray.push(new Emotion(emotion));            
        }
    }

    /**
     * @description returns selected emotion from emotion array
     * @param {string} emotionName string value of wanted emotion's name  
     */
    getEmotionObject(emotionName){
        return this._emotionArray[EmotionEnum[emotionName]];
    }

    /**
     * @description returns selected emotion from emotion array
     * @param {string} emotionId id of wanted emotion 
     */
    getEmotionObjectById(emotionId){        
        return this._emotionArray[emotionId];
    }

    set emotionArray(emotionArr){
        for(let i = 0; i < this._emotionArray.length; i++){
            let loadedEmotion = emotionArr[i];
            Object.assign(this._emotionArray[i], loadedEmotion);
        }
    }
}


/**
 * @description class that describes properties of a single emotion
 * @param {string} emotionName string value of emotion name is used to create emotion objects
 * @property {string} _name string value of emotion name
 * @property {array of maps with x and y values} pathData stores the mouse positions that were drawn onto the canvas
 * @property {boolean} loop whether path playback should loop, false means it plays only once
 * @property {boolean} playback whether path playback is enabled
 * @property {integer} playbackPos current position of playback indicator
 * @property {string} recordingState    path recording has three possible states: "before", "during", "after" – 
 *                                      correlating to "blank canvas that can be drawn on", "currently drawing" and "drawing is locked in"
 * @property {string} svg stores path to svg file of emotion
 */
class Emotion {    
    constructor(emotionName) {
        this._name = emotionName;
        this._pathData = [];
        this._loop = true;
        this._playback = false;
        this._playbackPos = 0;
        this._recordingState = "before"; 
        this._svg = "img/emotions/" + this._name + ".svg";
    }

    /**
     * @description adds path coordinates to pathData array as map
     * @param {float} x 
     * @param {float} y 
     */
    addPathCoordinates(x, y){
        if(this._recordingState == "during"){
            this._pathData.push({x, y});
        }
    }

    /**
     * @description clears all pathData, sets recordingState to "before" and resets playbackPos to 0
     */
    clearPathCoordinates(){
        this._pathData = [];
        this._recordingState = "before";
        this._playbackPos = 0;
    }

    /**
     * @description sets recording state, can't change recording state from "after" from outside the class
     * @param {RecordingState} 
     */
    set recordingState(recordingState){
        if(["during", "after"].includes(recordingState)){
            if(this._recordingState != "after"){
                this._recordingState = recordingState;
            }
        }
    }

    get recordingState(){
        return this._recordingState;
    }


    get pathData(){
        return this._pathData;
    }

    get pathCoordinates(){
        return this._pathData;
    }

    get svg(){
        return this._svg;
    }

    set loop(boolean)  {
        this._loop = boolean;
    }

    get loop() {
        return this._loop;
    }
    
    set playback(boolean) {
        this._playback = boolean;
    }

    get playback() {
        return this._playback;
    }

    /**
     * @description sets playbackPosition to given value, loops value if loop variable is true, else playbackPosition will stay at end of array
     * @param {int} pos position in pathData array
     */
    set playbackPos(pos){
        this._playbackPos = pos;
        if (this._loop && this._pathData.length != 0) {
            this._playbackPos = this._playbackPos % this._pathData.length;
        } else {
            if (this._playbackPos >= this._pathData.length && this._pathData.length > 0) {
                this._playbackPos = this._pathData.length - 1;
                this._playback = false;
            }
        }
    }
    
    get playbackPos(){
        return this._playbackPos;
    }
}