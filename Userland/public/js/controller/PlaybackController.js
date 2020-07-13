class PlaybackController{

    constructor(){
        
    }
    
    /**
     * @description function that is called every frame, dispatches PlaybackEvent
     */
    _playbackLoop(){
        cancelAnimationFrame(this._intervalId);
        this._intervalId = requestAnimationFrame(this._playbackLoop.bind(this));
        this._dispatchPlaybackEvent();
    }

    _dispatchPlaybackEvent(){
        dispatchEvent(new CustomEvent("notifyDetectedEmotionPlayback"));
    }
    
    startPlaybackLoop(){
        console.log("started playback loop");
        this._intervalId = requestAnimationFrame(this._playbackLoop.bind(this));
    }

    stopPlaybackLoop(){
        console.log("stopped playback loop");
        cancelAnimationFrame(this._intervalId);
    }
}    
    
    
    
    
