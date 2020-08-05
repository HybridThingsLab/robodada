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
     * @param {PointerEvent} pointerEvent 
     */
    _beginDraw(pointerEvent){
        this._dispatchRecordingStateEvent("during");
        this._setPointerCoordinates(pointerEvent);
        document.getElementById("canvas").setPointerCapture(pointerEvent.pointerId);
    }
    
    /**
     * @description stops drawing of path, dispatches RecordingStateEvent
     * @param {PointerEvent} pointerEvent 
     */
    _endDraw(pointerEvent){
        document.getElementById("canvas").releasePointerCapture(pointerEvent.pointerId);
        this._dispatchRecordingStateEvent("after");
    }
    
    /**
     * @description saves coordinates from pointerEvent to controller specific variables
     * @param {PointerEvent} pointerEvent 
     */
    _setPointerCoordinates(pointerEvent){
        this._xValueNormalized = this._clampValue(pointerEvent.offsetX / pointerEvent.target.width, 0.0, 1.0);
        this._yValueNormalized = this._clampValue(pointerEvent.offsetY / pointerEvent.target.height, 0.0, 1.0);
    }

    /**
     * @description clamps a value between two points, utility function for _setPointerCoordinates
     * @param {float} val 
     * @param {float} min 
     * @param {float} max 
     * @returns {float} clamped value
     */
    _clampValue(val, min, max){
        return Math.min(Math.max(min, val), max);
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
     * @description handles all PointerEvents and delegates to different functions based on PointerEvent.type
     * @param {PointerEvent} pointerEvent 
     */
    handleInput(pointerEvent) {
        switch(pointerEvent.pointerEvent.type){
            case "pointerdown": this._beginDraw(pointerEvent.pointerEvent); break;
            case "pointerup": this._endDraw(pointerEvent.pointerEvent); break;
            case "pointermove": this._setPointerCoordinates(pointerEvent.pointerEvent); break;
        }
    }                            
}