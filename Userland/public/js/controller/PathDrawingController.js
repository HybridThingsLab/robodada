class PathDrawingController {
    constructor(){
        this._xValueNormalized = 0;
        this._yValueNormalized = 0;
    }

    /**
     * @description function that is called every frame, dispatches PathDrawingEvent
     */
    _drawLoop(){
        cancelAnimationFrame(this._intervalId);
        this._intervalId = requestAnimationFrame(this._drawLoop.bind(this));
        this._dispatchPathDrawingEvent();
    }

    /**
     * @description begins drawing of path, dispatches RecordingStateEvent
     * @param {MouseEvent} mouseEvent 
     */
    _beginDraw(mouseEvent){
        this._dispatchRecordingStateEvent("during");
        this._setMouseCoordinates(mouseEvent);
    }
    
    /**
     * @description stops drawing of path, dispatches RecordingStateEvent
     * @param {MouseEvent} mouseEvent 
     */
    _endDraw(mouseEvent){
        this._dispatchRecordingStateEvent("after");
    }
    
    /**
     * @description saves coordinates from mouseEvent to controller specific variables
     * @param {MouseEvent} mouseEvent 
     */
    _setMouseCoordinates(mouseEvent){
        this._xValueNormalized = mouseEvent.offsetX / mouseEvent.target.width;
        this._yValueNormalized = mouseEvent.offsetY / mouseEvent.target.height;
    }
    
    /**
     * @description dispatches a Recording state event with recording state in ["before", "during", "after"]
     * @param {RecordingState} recordingState 
     * @property {RecordingState recordingState}
     */
    _dispatchRecordingStateEvent(recordingState){
        let notifyRecordingStateChanged = new CustomEvent("notifyRecordingStateChanged");
        notifyRecordingStateChanged.recordingState = recordingState;
        dispatchEvent(notifyRecordingStateChanged);
    }
    
    /**
     * @description dispatches path drawing event that contains the new coordinates to be added
     * @event PathDrawingController#notifyPathDrawing
     * @property {mouseX float, mouseY float}
     */
    _dispatchPathDrawingEvent(){
        let notifyPathDrawingEvent = new CustomEvent("notifyPathDrawing");
        notifyPathDrawingEvent.xValueNormalized = this._xValueNormalized;
        notifyPathDrawingEvent.yValueNormalized = this._yValueNormalized;
        dispatchEvent(notifyPathDrawingEvent);
    }

    /**
     * @description starts interval that calls _drawLoop every 10 ms
     */
    startDrawLoop(){
        console.log("started drawing loop");
        this._intervalId = requestAnimationFrame(this._drawLoop.bind(this));
    }

    /**
     * @description clears draw loop interval
     */
    endDrawLoop(){
        console.log("stopped drawing loop");
        cancelAnimationFrame(this._intervalId);
    }

    /**
     * @description handles all MouseEvents and delegates to different functions based on MouseEvent.type
     * @param {MouseEvent} mouseEvent 
     */
    handleInput(mouseEvent) {
        switch(mouseEvent.mouseEvent.type){
            case "mousedown": this._beginDraw(mouseEvent.mouseEvent); break;
            case "mouseup": this._endDraw(mouseEvent.mouseEvent); break;
            case "mousemove": this._setMouseCoordinates(mouseEvent.mouseEvent); break;
        }
    }                            
}