/**
 * @description handles user input/output in main menu
 */
class MainMenuView{
    constructor(){
        this._addButtonEventListeners();
    }
    
    /**
     * @description adds EventListeners to main menu buttons
     */
    _addButtonEventListeners() {
        this._addEmotionEventlisteners();
        this._addCameraEventlistener();
        this._addMenuEventlisteners();
    }

    _addMenuEventlisteners() {
        document.querySelector(".robo-button").addEventListener('click', function() {
            let event = new CustomEvent("notifyOpenRoboChooserOverlay");
            dispatchEvent(event);
        });

        document.querySelector(".save-button").addEventListener('click', function() {
            let event = new CustomEvent("notifyOpenSaveLoadOverlay");
            dispatchEvent(event);
        });

        document.querySelector('.help-button').addEventListener('click', function() {
            let event = new CustomEvent("notifyOpenHelpOverlay");
            dispatchEvent(event);
        })
    }    
    
    /**
     * @description adds EventListeners to all emotion buttons
     * 
     * @event MainMenuView#notifyOpenOverlay
     * @property {emotion string} emotionName Contains the string type name of the pressed button
     */
    _addEmotionEventlisteners() {
        document.querySelectorAll(".wrapper-emotion>.button")
        .forEach(function(button) {
            button.addEventListener('click', function() {
                let notifyOpenOverlayEvent = new CustomEvent("notifyOpenOverlay");
                let emotionName = this.innerText.trim();
                notifyOpenOverlayEvent.emotionName = emotionName;
                dispatchEvent(notifyOpenOverlayEvent);
            })
        });
    }
    
    /**
     * @description adds EventListener to the camera button
     * 
     * @event MainMenuView#notifySwitchView
     * @property {video element} videoElement event details contain dom element for camera video
     */
    _addCameraEventlistener() {
        document.getElementsByClassName("camera-button")[0].addEventListener('click', function(){
            let eventDetails = {
                videoElement: document.getElementsByClassName("cam-video")[0]
            }            
            let notifySwitchView = new CustomEvent("notifySwitchView", {detail: eventDetails});
            dispatchEvent(notifySwitchView);
        });
    }

    updateRoboButtonIcon(connected){
        if(connected){
            document.querySelector(".robo-button").firstElementChild.src = "img/menu/connected.svg";
        } else {
            document.querySelector(".robo-button").firstElementChild.src = "img/menu/not_connected.svg";
        }
    }
}