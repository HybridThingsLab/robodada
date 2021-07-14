class EmotionDetectionController{
       
    constructor(){
        this._stream = null;
        this._lastEmotion = "";
        this.trackingInterval = "";
    }

    /**
     * @description Inits the camera inside the give video element, starts a browser user dialog
     * @param {DOM videoElement} videoElement The video element to show the cameras picture
     */
    startCamInteraction(videoElement){
        this._getMedia({
            video: {width:
                        {min: 640, ideal: 640, max: 1900},
                    height:
                        {min: 480, ideal: 480, max: 1080}
            }
        }, videoElement);
    }

    /**
     * @description Stops and cleans up the video stream for the given video element
     * @param {DOM videoElement} videoElement Video element to stop
     */
    stopCamInteraction(videoElement){
        this._stream.getTracks().forEach(function(track) {
            track.stop();
        });
    
        videoElement.pause();
        videoElement.currentTime = 0;
        clearTimeout(this.trackingInterval);
    }

    /**
     * @description Perform the tracking algorithms on the given video element. Dispatches the "emotionChanged" and "trkResult" events.
     * @param {DOM videoElement} videoElement The video element to perform the tracking on
     */
    async onPlay(videoElement){
        const options = getFaceDetectorOptions();
        const result = await faceapi.detectSingleFace(videoElement, options).withFaceExpressions();

        if (result) {            
            let expressionSort = [];
      
            for(var expr in result.expressions){
              expressionSort.push([expr, result.expressions[expr]]);
            }
      
            expressionSort.sort((a, b) => b[1]-a[1]);
            
            if(this._lastEmotion != expressionSort[0][0]){
              this._lastEmotion = expressionSort[0][0];
                            
              let event = new CustomEvent("notifyEmotionChanged", {detail: this._lastEmotion});
              dispatchEvent(event);
            }                  
            
            let newTrkResultEvt = new CustomEvent("notifyNewTrackResult", {detail: result});
            dispatchEvent(newTrkResultEvt);          
          }
      
          
          if(videoElement.paused || videoElement.ended || !isFaceDetectionModelLoaded()){
            console.log("ER model loaded:" + isFaceDetectionModelLoaded());      
          } else {            
            this.trackingInterval = setTimeout(() => this.onPlay(videoElement))
          }
    }

    /**
     * @description Configure faceapi and kick off video stream
     * @param {video properties} constraints 
     * @param {DOM video element} videoElement 
     */
    async _getMedia(constraints, videoElement){
        const MODEL_URL = './js/lib/weights'
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        //await faceapi.loadFaceLandmarkModel(MODEL_URL);
        await changeFaceDetector(TINY_FACE_DETECTOR);   
        changeInputSize(224);
        console.log(getCurrentFaceDetectionNet().params);   
        this._stream = await navigator.mediaDevices.getUserMedia(constraints);
    
        try {
            /** 
             * @WARNING: Pattern violation?       
             */
            
            videoElement.srcObject = this._stream;
        } catch(err) {
        /* handle the error */
        }
    }

}