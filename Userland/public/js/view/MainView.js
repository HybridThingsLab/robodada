class MainView {
    constructor(emotionModel) {
        document.getElementsByClassName("cam-video")[0].addEventListener("loadedmetadata", this._onPlay);
        document.addEventListener('keydown', (key) => {
            if (key.code == "F2") {
                dispatchEvent(new CustomEvent("notifyOpenDevVisualization"));
            }
            if (key.code == "KeyS") {
                dispatchEvent(new CustomEvent("notifySaveToJSONFile"));
            }
            if (key.code == "KeyL") {
                dispatchEvent(new CustomEvent("notifyLoadFromJSONFile"));
            }
        });
        this.emoticons = {};
        for (let emo in EmotionEnum) {
            console.log(emo + " " + EmotionEnum[emo]);
            this.emoticons[EmotionEnum[emo]] = new Image();
            this.emoticons[EmotionEnum[emo]].src = emotionModel.getEmotionObject(emo).svg;
        }
    }

    saveJSON(content, fileName) {
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(content)], {
            type: 'text/plain'
        });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    loadJSON() {
        let input = document.createElement('input');
        input.type = 'file';
        input.click();

        input.onchange = e => {
            let file = e.target.files[0];
            if (!file) {
                return;
            }
            let reader = new FileReader();
            reader.onload = function (e) {
                let contents = e.target.result;
                let jsonContent = JSON.parse(contents);
                dispatchEvent(new CustomEvent("notifyLoadedJSONFile", {
                    detail: jsonContent
                }));
            };
            reader.readAsText(file);
        }
    }


    _onPlay(e) {
        let event = new CustomEvent("notifyVideoPlay", {
            detail: e.srcElement
        });
        dispatchEvent(event);
    }


    /**
     * @description updates the emojiposition with a new tracking result
     * @param {tracking result object} trackingResult 
     */
    updateEmojiPosition(trackingResult) {
        let canvas = document.getElementsByClassName("emoji-canvas")[0];
        let dims = faceapi.matchDimensions(canvas, document.getElementsByClassName("cam-video")[0], true);
        let resizedResult = faceapi.resizeResults(trackingResult.tracking, dims);

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let scale = resizedResult.detection.box.width / canvas.width * 4;
        ctx.setTransform(scale, 0, 0, scale, resizedResult.detection.box.x + resizedResult.detection.box.width / 2, resizedResult.detection.box.y + resizedResult.detection.box.height / 2);

        //@TODO: manage emoticons       
        ctx.drawImage(this.emoticons[trackingResult.emotion], -100, -120);
    }

    /**
     * @description translates the main menu so you see the live webcam feed 
     */
    switchToPlaybackView() {
        console.log("switching to playback view");
        let cam_button = document.querySelector(".camera-button");
        document.getElementsByClassName("main-screen")[0].style.transform = "translate(0, -86vh)";
        cam_button.firstElementChild.innerHTML = "<p>deactivate&nbsp;cam</p>";
        cam_button.lastElementChild.src = "img/menu/camera_off.svg";
    }

    /**
     * @description translates the webcam emotion detection area so you see the planning or emotion drawing area
     */
    switchToPlanningView() {
        console.log("switching to planning view");
        let cam_button = document.querySelector(".camera-button");
        document.getElementsByClassName("main-screen")[0].style.transform = "";
        cam_button.firstElementChild.innerHTML = "<p>activate&nbsp;cam</p>";
        cam_button.lastElementChild.src = "img/menu/camera_on.svg";
    }

    /**
     * @description returns dom element for cam video
     * @returns {dom element} camera video element
     */
    getVideoElement() {
        return document.getElementsByClassName("cam-video")[0];
    }




}