class MainController extends EventTarget{    
    constructor(mainView, emotionDetectionController, mainModel, mainMenuView, pathDrawingOverlayView, emotionModel, pathDrawingController, playbackController, robotView, donutView){

        super();

        /**
         * Manage main view
         */
        this.mainView = mainView;
        addEventListener("notifyVideoPlay", this._handleOnPlay.bind(this));    
        addEventListener("notifyOpenDevVisualization", this._handleDevVisualization.bind(this));

        /**
         * Manage file IO events
         */
        addEventListener("notifySaveToJSONFile", this._handleSaveToJSONFile.bind(this));
        addEventListener("notifyLoadFromJSONFile", this._handleLoadFromJSONFile.bind(this));
        addEventListener("notifyLoadedJSONFile", this._handleJSONFileLoaded.bind(this));
        
        /**
         * Manage view of main menu
         */
        this.mainMenuView = mainMenuView;
        addEventListener("notifyOpenOverlay", this._handleOpenOverlay.bind(this));
        addEventListener("notifySwitchView", this._requestSwitchView.bind(this));
        
        /**
         * Manage view of path drawing overlay
         */
        this.pathDrawingOverlayView = pathDrawingOverlayView;
        addEventListener("notifyCloseOverlay", this._handleCloseOverlay.bind(this));
        addEventListener("notifyMouseEvent", this._handleMouseEvent.bind(this));
        addEventListener("notifyDeleteEvent", this._handlePathDeletion.bind(this));
        addEventListener("notifyLoopEvent", this._handleLoopEvent.bind(this));
        addEventListener("notifyPlaybackEvent", this._handlePlaybackEvent.bind(this));
        
        /**
         * Manage view of connected robot
         */
        this.robotView = robotView;
        
        /**
         * Manage view of "donut charts" that display confidence values of detected emotions
         */
        this.donutView = donutView;
        
        /**
         * Manage emotion detection controller
         */
        this.emotionDetectionController = emotionDetectionController;
        addEventListener("notifyNewTrackResult", this._handleNewTrackResult.bind(this));
        addEventListener("notifyEmotionChanged", this._handleChangedEmotion.bind(this));
        

        /**
         * Manage path drawing controller
         */
        this.pathDrawingController = pathDrawingController;
        addEventListener("notifyPathDrawing", this._handlePathDrawing.bind(this));
        addEventListener("notifyRecordingStateChanged", this._handleRecordingStateChanged.bind(this));
        
        /**
         * Manage playback controller
         */
        this.playbackController = playbackController;
        addEventListener("notifyDetectedEmotionPlayback", this._handleDetectedEmotionPlayback.bind(this));

        /**
         * manage main model
         */
        this.mainModel = mainModel;
        addEventListener("notifyTrackingResultChanged", this._handleTrackResultChanged.bind(this));
        addEventListener("notifyStateChanged", this._handleSwitchState.bind(this));
        addEventListener("notifyTrackedEmotionChanged", this._handleTrackedEmotionChanged.bind(this));


        /**
         * Manage emotion model
         */
        this.emotionModel = emotionModel;
    }
    
    /**
     * @description Call the tracking algorithms each time a new frame is played in the video element
     * 
     */ 
    _handleOnPlay(e){
        console.log("video starts playing");
        this.emotionDetectionController.onPlay(e.detail);
    }
    
    /**
     * @description Handles request to open overlay for specific emotion
     * @param {event object} event containing emotion name
     */
    _handleOpenOverlay(event){
        let selEmotion = this.emotionModel.getEmotionObject(event.emotionName);
        this.mainModel.selectedEmotion = selEmotion; 
        let selectedEmotion = this.mainModel.selectedEmotion;
        selectedEmotion.playback = false; 
        selectedEmotion.playbackPos = 0; 
        this.pathDrawingOverlayView.openOverlay(selEmotion);
        this.pathDrawingController.startDrawLoop();
    }
    
    /**
     * @description ends draw loop on emotion overlay that was closed in view
     * @param {event object} event containing emotion name
     */
    _handleCloseOverlay(event){
        this.pathDrawingController.endDrawLoop();
    }

    /**
     * @description Handles the request to switch view
     * @param {click event} event 
     */
    _requestSwitchView(event){
        
        if(this.mainModel.currentState == StatesEnum.planning){
            this.mainModel.currentState = StatesEnum.playback;
        } else if(this.mainModel.currentState == StatesEnum.playback) {
            this.mainModel.currentState = StatesEnum.planning;
        }
    }
    
    /**
     * @description Handles new tracking events received from emotion detection controller. Writes the Tracking result to the model.
     * @param {tracking result object} trackingResult 
     */
    _handleNewTrackResult(e){
        this.mainModel.trackingResult = e.detail;
        this.donutView.handleNewTrackResult(e.detail);
    }

    /**
     * @description Handles a new tracking object beeing written to the model. Implement further stuff to do with a new tracking result here.
     * @param {tracking result object} trackResult 
     */
    _handleTrackResultChanged(trackResult){               
        this.mainView.updateEmojiPosition(trackResult.detail);
    }

    /**
     * @description Handles a new, different emotion beeing tracked by EmotionDetectionController. Writes the emotion to the model.
     * @param {EmotionString} lastEmotion 
     */    
    _handleChangedEmotion(lastEmotion){       
        this.mainModel.trackedEmotion = EmotionEnum[lastEmotion.detail];
        if(this.mainModel.selectedEmotion != undefined){
            this.mainModel.selectedEmotion.playbackPos = 0;
            this.mainModel.selectedEmotion.playback = false;
        }
        let selectedEmotion = this.emotionModel.getEmotionObjectById(this.mainModel.trackedEmotion);
        if(selectedEmotion != undefined){
            this.mainModel.selectedEmotion = selectedEmotion;
            this.mainModel.selectedEmotion.playback = true;
        }
    }
    
    /**
     * @description Catches the emotion change from the model and triggers all neccessary functions.
     * @param {EmotionEnum} changedEmotion 
     */
    _handleTrackedEmotionChanged(changedEmotion){
    //possibly redundant?
    }
    
    /**
     * @description Handles the switch of the applications state
     * @param {event object} newState 
     */
    _handleSwitchState(newState){
        
        switch(newState.detail){
            case StatesEnum.planning:
                this._switchFromVideoPlayback();
                this.mainView.switchToPlanningView();
                this.playbackController.stopPlaybackLoop();
                this.mainModel.selectedEmotion.playback = false;

                break;
                
                case StatesEnum.playback:
                this._switchToVideoPlayback();
                this.mainView.switchToPlaybackView();
                this.playbackController.startPlaybackLoop();
                
                break;
        }
    }
            
    /**
     * @description Switch from any view state to the playback state
     *
     */
    _switchToVideoPlayback(){
        this.emotionDetectionController.startCamInteraction(this.mainView.getVideoElement());
    }
    
    /**
     * @description Switch to any state from the playback state
     * 
     */
    _switchFromVideoPlayback(){
        this.emotionDetectionController.stopCamInteraction(this.mainView.getVideoElement());
    }         
    
    _handleDetectedEmotionPlayback(){
        if(this.mainModel.selectedEmotion != undefined){
            if(this.mainModel.selectedEmotion.pathData.length != 0) {
                this.mainModel.selectedEmotion.playbackPos += 1;
                let position = this.mainModel.selectedEmotion.pathCoordinates[this.mainModel.selectedEmotion.playbackPos];
                this.robotView.handleMovementCommand(this.mainModel.connectedRobotName, position.x, position.y);
                console.log(this.mainModel.selectedEmotion._name);
                console.log("playbackpos:" +  this.mainModel.selectedEmotion.playbackPos);
            }
        }
        if(this._openedWindow != undefined){
            this._openedWindow.postMessage(this.mainModel.selectedEmotion, "*");
        }
    }

    /**
     * @description Handle mouse input based on recording state
     * 
     * @param {mouseEvent} mouseEvent 
     */
    _handleMouseEvent(mouseEvent) {
        let recordingState = this.mainModel.selectedEmotion.recordingState;
        if(recordingState == "before" || recordingState == "during"){
            this.pathDrawingController.handleInput(mouseEvent);
        } else if(mouseEvent.mouseEvent.type == 'mousedown') {
            this.pathDrawingOverlayView.bounceTrashcan();
        }
    }

    /**
     * @description Handle path drawing event, add new coordinates to path data if in right recording state, manages draw calls
     * 
     * @param {pathDrawingEvent} pathDrawingEvent 
     */
    _handlePathDrawing(pathDrawingEvent) {
        let selectedEmotion = this.mainModel.selectedEmotion;
        //sends selected emotion to dev visualization
        if(this._openedWindow != undefined){
            this._openedWindow.postMessage(selectedEmotion, "*");
        }
        //adds path data to selected emotion and sends them to robot view
        if(!selectedEmotion.playback && selectedEmotion.recordingState == "during"){
            selectedEmotion.addPathCoordinates(pathDrawingEvent.xValueNormalized, pathDrawingEvent.yValueNormalized);
            
            let position = this.mainModel.selectedEmotion.pathCoordinates[this.mainModel.selectedEmotion.pathCoordinates.length - 1];
            this.robotView.handleMovementCommand(this.mainModel.connectedRobotName, position.x, position.y);
        }
        //draws path and playback indicator
        this.pathDrawingOverlayView.clearCanvas();
        this.pathDrawingOverlayView.drawPath(selectedEmotion.pathCoordinates);
        if(selectedEmotion.recordingState === "after" && selectedEmotion.pathData.length !== 0) {
            this.pathDrawingOverlayView.drawPlaybackIndicator(selectedEmotion.pathData[selectedEmotion.playbackPos]);
            this.pathDrawingOverlayView.switchPlaybackButton(selectedEmotion.playback);
        } else if(selectedEmotion.recordingState == "during") {
            
        }
        if(selectedEmotion.playback){
            let position = selectedEmotion.pathCoordinates[selectedEmotion.playbackPos];
            this.robotView.handleMovementCommand(this.mainModel.connectedRobotName, position.x, position.y);

            selectedEmotion.playbackPos += 1;
        }
    }

    /**
     * @description Handle path deletion event, clears path of selected emotion
     */
    _handlePathDeletion(){
        let selectedEmotion = this.mainModel.selectedEmotion;
        selectedEmotion.clearPathCoordinates();
        selectedEmotion.playback = false;
        this.pathDrawingOverlayView.switchPlaybackButton(false);
    }

    /**
     * @description Handle change in recording state, prevents jump from before to after and 
     *              adds Indicators for when recording path and successful path drawing
     * 
     * @param {RecordingStateChangedEvent} event 
     */
    _handleRecordingStateChanged(event) {
        let selectedEmotion = this.mainModel.selectedEmotion;
        if(!(selectedEmotion.recordingState == "before" && event.recordingState == "after")){
            selectedEmotion.recordingState = event.recordingState;
            if (event.recordingState == "during") {
                this.pathDrawingOverlayView.addRecordingIndicator();
            } else if (event.recordingState == "after") {
                this.pathDrawingOverlayView.removeRecordingIndicator();
                this.pathDrawingOverlayView.addConfirmIndicator();
                setTimeout(this.pathDrawingOverlayView.removeConfirmIndicator, 2000);
            }
        }
        console.log(selectedEmotion.recordingState);
    }

    /**
     * @description Handle loop event, calls view to switch appearance of loop button
     */
    _handleLoopEvent() {
        let selectedEmotion = this.mainModel.selectedEmotion;
        selectedEmotion.loop = !selectedEmotion.loop;
        this.pathDrawingOverlayView.switchLoopButton(selectedEmotion.loop);
    }

    /**
     * @description Handle playback event, resets playback position
     */
    _handlePlaybackEvent() {
        let selectedEmotion = this.mainModel.selectedEmotion;
        if(selectedEmotion.pathData.length > 0){
            selectedEmotion.playback = !selectedEmotion.playback;
            selectedEmotion.playbackPos = 0;
            this.pathDrawingOverlayView.switchPlaybackButton(selectedEmotion.playback);
        }
    }

    _handleSaveToJSONFile(){
        let content = this.emotionModel._emotionArray;
        this.mainView.saveJSON(content, "robodada_savefile.json");
    }
    
    _handleLoadFromJSONFile(){
        this.mainView.loadJSON();
    }

    _handleJSONFileLoaded(e){
        console.log(this.emotionModel._emotionArray);
        console.log(e.detail);

        this.emotionModel.emotionArray = e.detail;
        console.log(this.emotionModel._emotionArray);
    }

    _handleDevVisualization() {
        this._openedWindow = window.open("dev_visualization.html","dev_visualization","channelmode, width=700, height=600, menubar=no, scrollbars=no, status=no, toolbar=no");
        this._openedWindow.postMessage(this.mainModel.selectedEmotion, "*");
    }

    
}