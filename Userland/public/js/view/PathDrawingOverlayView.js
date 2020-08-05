/**
 * @description handles input from and output to user in PathDrawingOverlay
 * @property {DOM Element} _overlay overlay with panel to draw emotion path
 * @property {DOM Element} _mainMenu main menu
 * @property {DOM Element} _canvas drawing canvas
 * @property {DOM Element} _delete delete button
 * @property {DOM Element} _close close button
 * @property {DOM Element} _loop loop button
 * @property {DOM Element} _play playback button
 * @property {Map} _colors colors used on canvas
 */
class PathDrawingOverlayView{
    constructor(){
        this._overlay = document.querySelector(".overlay");
        this._mainMenu = document.querySelector(".main-menu");
        this._canvas = document.querySelector(".path-drawing-canvas");
        this._delete = document.querySelector(".delete");
        this._close = document.querySelector(".close");
        this._loop = document.querySelector(".loop");
        this._play = document.querySelector(".play");
        this._addEventListeners();
        this._colors = {"green": "#6bc95d", "red": "#EB3017", "orange": "#E27022"};
        this._loadBackgroundImage();
    }

    /**
     * @description initializes canvas width and height properties according to browser
     */
    _initCanvas(){
        this._canvas.style.width = '100%';
        this._canvas.style.height = '100%';
        this._canvas.width = this._canvas.offsetWidth;
        this._canvas.height = this._canvas.offsetHeight;
    }

    /**
     * @description adds event listeners to all relevant DOM objects
     */
    _addEventListeners(){   
        this._overlayEventlistener();
        this._addButtonEventListeners();
        this._addCanvasEventListeners();
    }

    /**
     * @description adds pointer event listeners to drawing canvas
     */
    _addCanvasEventListeners(){
        this._canvas.addEventListener('pointerdown', this._pointerevent.bind(this));
        this._canvas.addEventListener('pointerup', this._pointerevent.bind(this));
        this._canvas.addEventListener('pointermove', this._pointerevent.bind(this));
    }

    /**
     * @description adds event listeners to interface buttons
     */
    _addButtonEventListeners(){
        this._delete.addEventListener('click', this._deleteevent.bind(this));
        this._loop.addEventListener('click', this._loopevent.bind(this));
        this._play.addEventListener('click', this._playevent.bind(this));
    }

    /**
     * @description adds event listeners to close button 
     * and to part of screen next to overlay to close overlay on click
     * and stops recording when releasing the mouse button outside of the drawing area 
     */
    _overlayEventlistener() {
        //clicking the close button closes the overlay
        this._close.addEventListener("mousedown", this.closeOverlay.bind(this));

        //clicking outside the drawing area closes the overlay too
        this._overlay.addEventListener('mousedown', this.closeOverlay.bind(this));
        this._overlay.childNodes.forEach((item)=>{
            item.addEventListener('mousedown', (evt)=>{
                evt.stopPropagation();
            })
        })
        
        //stop recording when button is no longer pressed when outside canvas
        this._overlay.addEventListener('pointerup', this._pointerevent.bind(this));
    }

    /**
     * @description dispatches delete event
     * @event PathDrawingOverlayView#notifyDeleteEvent notifies that delete button was pressed
     */
    _deleteevent(){
        let notifyDeleteEvent = new CustomEvent("notifyDeleteEvent");
        dispatchEvent(notifyDeleteEvent);
    }

    /**
     * @description dispatches loop event
     * @event PathDrawingOverlayView#notifyLoopEvent notifies that loop button was pressed
     */
    _loopevent(event){
        let notifyLoopEvent = new CustomEvent("notifyLoopEvent");
        dispatchEvent(notifyLoopEvent);
    }

    /**
     * @description dispatches playback event
     * @event PathDrawingOverlayView#notifyPlaybackEvent notifies that playback button was pressed
     */
    _playevent(event){
        let notifyPlaybackEvent = new CustomEvent("notifyPlaybackEvent");
        dispatchEvent(notifyPlaybackEvent);
    }

    /**
     * @description dispatches pointer event
     * @event PathDrawingOverlayView#notifyPointerEvent notifies of any events regarding the pointer (pointerup, pointerdown, pointermove)
     * @property {pointerEvent} pointerEvent
     */
    _pointerevent(pointerevent){
        let notifyPointerEvent = new CustomEvent("notifyPointerEvent");
        notifyPointerEvent.pointerEvent = pointerevent;
        dispatchEvent(notifyPointerEvent);
    }

    /**
     * @description loads background image for canvas from disk
     */
    _loadBackgroundImage(){
        this._backgroundImage = new Image();
        this._backgroundImage.onload = function(){};
        this._backgroundImage.src = "img/overlay/robot_movement.svg";
    }

    /**
     * @description clears canvas of any drawing
     */
    clearCanvas(){
        let context = this._canvas.getContext("2d");
        context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._drawBackgroundImage();
    }

    /**
     * @description draws background of canvas, once per frame
     */
    _drawBackgroundImage(){
        let context = this._canvas.getContext("2d");
        let _imageScale = 0.8;
        if(this._backgroundImage.width > 0)
            context.globalAlpha = 0.1;
            context.drawImage(this._backgroundImage, this._canvas.width * (1.0 - _imageScale) / 2.0, this._canvas.height * (1.0 - _imageScale) / 2.0, this._canvas.width * _imageScale, this._canvas.height * _imageScale);
            context.globalAlpha = 1.0;
    }

    /**
     * @description draws path onto canvas from pathData array
     * @param {PathData} pathData 
     */
    drawPath(pathData){
        let context = this._canvas.getContext("2d");
        context.globalAlpha = 1.0;
        context.lineCap = "round";
        context.lineWidth = 5;
        context.strokeStyle = this._colors["green"];
        context.beginPath();
        for(let i = 0; i < pathData.length - 1; i++){
            context.moveTo(pathData[i].x * this._canvas.width, pathData[i].y * this._canvas.height);
            context.lineTo(pathData[i+1].x * this._canvas.width, pathData[i+1].y * this._canvas.height);
        }
        context.stroke();
        context.closePath();
    }

    /**
     * @description draw playback indicator at given coordinates
     * @param {{x,y} position} pos 
     */
    drawPlaybackIndicator(pos){
        let context = this._canvas.getContext("2d");
        context.globalAlpha = 1.0;
        context.beginPath();
        context.fillStyle = this._colors["orange"];    
        context.arc(pos.x * this._canvas.width, pos.y * this._canvas.height, this._canvas.width / 40, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    }

    /**
     * @description adds blinking recording indicator DOM element to DOM
     */
    addRecordingIndicator() {
        let recordingIndicator = document.createElement("div");        
        recordingIndicator.className = "recording-indicator indicator";
        recordingIndicator.style.background = this._colors["red"];
        recordingIndicator.style.animation = "blinking 1s ease-in-out infinite";
        this._canvas.parentElement.appendChild(recordingIndicator);
    }

    /**
     * @description removes recording indicator DOM element from DOM
     */
    removeRecordingIndicator() {
        let recordingIndicator = document.querySelector(".recording-indicator");
        recordingIndicator.parentElement.removeChild(recordingIndicator);
    }

    /**
     * @description adds confirmation indicator DOM element to DOM
     */
    addConfirmIndicator() {
        let confirmIndicator = document.createElement("div");        
        confirmIndicator.className = "confirm-indicator indicator";
        confirmIndicator.style.background = this._colors["green"];        
        confirmIndicator.style.animation = "fadeout 1s ease-out 1s";
        this._canvas.parentElement.appendChild(confirmIndicator);
    }

    /**
     * @description removes confirmation indicator DOM element from DOM
     */
    removeConfirmIndicator() {
        let confirmIndicator = document.querySelector(".confirm-indicator");
        if(confirmIndicator != null){
            confirmIndicator.parentElement.removeChild(confirmIndicator);
        }
    }

    /**
     * @description draws attention to trashcan when input is not currently possible
     */
    bounceTrashcan(){
        this._delete.style.background = this._colors["red"];
        this._delete.style.transform = "scale(1.1)";
        setTimeout(()=>{
            this._delete.style.background = '';
            this._delete.style.transform = "";
        }, 250);
    }

    /**
     * @description switches appearance of loop button according to loop state
     * @param {boolean} loop 
     */
    switchLoopButton(loop) {
        if (loop) {
            this._loop.firstElementChild.src = "img/overlay/loop.svg"
        } else {
            this._loop.firstElementChild.src = "img/overlay/play_once.svg"
        }
    }

    switchPlaybackButton(playback) {
        if(playback){
            this._play.firstElementChild.src = "img/overlay/stop.svg";
        } else {
            this._play.firstElementChild.src = "img/overlay/play.svg";
        }
    }

    /**
     * @description opens overlay, sets placeholders to emotion name, calls initCanvas
     * @param {EmotionObject} emotion 
     */
    openOverlay(emotion) {
        this._overlay.style.display = 'block';
        this._mainMenu.style.filter = 'blur(4px)';         
        this._initCanvas();

        this.switchLoopButton(emotion._loop);
        this.switchPlaybackButton(emotion._playback);

        let emotionInInstruction = document.querySelector('.instructions .emotion-var');
        emotionInInstruction.innerText = emotion._name;

        let emotionImageOnPanel = document.querySelector('.canvas-panel .emotion-var');
        emotionImageOnPanel.innerHTML = "<img class=\"draw-icon\" src=" + emotion._svg + ">";
    }

    /**
     * @description closes overlay, dispatches notifyCloseOverlayEvent
     * @event PathDrawingOverlayView#notifyCloseOverlayEvent notifies that overlay has been closed
     */
    closeOverlay() {
        let notifyCloseOverlay = new CustomEvent("notifyCloseOverlay");
        dispatchEvent(notifyCloseOverlay);
        //bug here
        this.removeConfirmIndicator();
        this._overlay.style.display = 'none';
        this._mainMenu.style.filter = '';        
    }
}