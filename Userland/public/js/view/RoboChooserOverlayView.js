class RoboChooserOverlayView{
    constructor(){
        this._overlay = document.querySelector(".robo-chooser-overlay");
        this._mainMenu = document.querySelector(".main-menu");
        this._close = document.querySelector(".robo-chooser-overlay > .close");
        this._interfaceWrapper = document.querySelector(".robo-chooser-overlay > .interface-wrapper");
        this._addEventListeners();
    }

    _addEventListeners(){   
        this._overlayEventlistener();
    }

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
    }

    updateOverlayContent(roboList, currentRobo){
        this._interfaceWrapper.innerHTML = "";
        roboList.forEach(robo => {
            let icon = document.createElement("img");
            icon.src = "img/roboChooser/available.svg";
            icon.classList.add("robo-icon");

            let name = document.createElement("p");
            name.classList.add("robo-name");
            name.innerText = robo.name;
            
            let claimButton = document.createElement("div");
            claimButton.classList.add("claim-button");
            claimButton.classList.add("button");
            claimButton.style.display = "none";
            
            // Wave button is not needed for now
            
            // let waveButton = document.createElement("div");
            // waveButton.classList.add("wave-button");
            // waveButton.classList.add("button");
            // waveButton.style.display = "none";
            
            // let waveEmoji = document.createElement("img");
            // waveEmoji.src = "img/roboChooser/wave.svg"
            // waveEmoji.classList.add("wave-emoji");
            // waveButton.appendChild(waveEmoji);
            
            let buttonWrapper = document.createElement("div");
            buttonWrapper.classList.add("button-wrapper");
            buttonWrapper.appendChild(claimButton);
            // buttonWrapper.appendChild(waveButton);

            let infoText = document.createElement("p");
            infoText.classList.add("info-text");
            infoText.style.display = "none";

            if(robo.state == 1){
                infoText.innerText = robo.name + " is ready to be used.";
                claimButton.innerText = "connect now";
                claimButton.addEventListener('click', () => {
                    let event = new CustomEvent("notifyClaimRobot");
                    event.robotName = robo.name;
                    dispatchEvent(event);
                });
            } else if(robo.state == 0 && currentRobo == robo.name){
                icon.src = "img/roboChooser/connected.svg"
                infoText.innerText = "you are using " + robo.name + " as your robo.";
                claimButton.innerText = "disconnect";
                claimButton.addEventListener('click', () => {
                    let event = new CustomEvent("notifyReleaseRobot");
                    dispatchEvent(event);
                });
            } else {
                icon.src = "img/roboChooser/connected_other.svg"
                waveButton.style.display = "none";
                infoText.innerText = robo.name + " is in use by someone else.";
                claimButton.innerText = "connect anyway";
                claimButton.addEventListener('click', () => {
                    let event = new CustomEvent("notifyClaimRobot");
                    event.robotName = robo.name;
                    dispatchEvent(event);
                });
            }
            
            
            
            let button = document.createElement("div");
            button.classList.add("robo-chooser-button");
            button.classList.add("button");
            button.appendChild(icon);
            button.appendChild(name);
            button.appendChild(infoText);
            button.appendChild(buttonWrapper);
            button.addEventListener('click', () => {
                this._setCurrentAsActive(button);
            })

            this._interfaceWrapper.appendChild(button);
        });
    }

    _setCurrentAsActive(clickedButton) {
        let buttonList = document.querySelectorAll(".robo-chooser-button");
        buttonList.forEach(button => {
            if (button != clickedButton) {

                button.classList.remove("active");
                button.childNodes[1].style.display = "block";
                button.childNodes[2].style.display = "none";
                button.childNodes[3].style.display = "none";
            }
        });
        clickedButton.classList.add("active");
        clickedButton.childNodes[1].style.display = "none";
        setTimeout(() => {
            clickedButton.childNodes[2].style.display = "block";
            clickedButton.childNodes[3].style.display = "flex";
            //not very elegant, has to be changed when button text is changed
            if (clickedButton.childNodes[3].childNodes[0].innerText == "connect anyway") {
                clickedButton.childNodes[3].childNodes[0].style.display = "inline-block";
                clickedButton.childNodes[3].childNodes[1].style.display = "none";
            } else {
                clickedButton.childNodes[3].childNodes[0].style.display = "inline-block";
                clickedButton.childNodes[3].childNodes[1].style.display = "inline-block";
            }
        }, 110);

    }

    openOverlay(roboList, currentRobo) {
        this.updateOverlayContent(roboList, currentRobo);
        this._overlay.style.display = 'block';
        this._mainMenu.style.filter = 'blur(4px)';
    }

    closeOverlay() {
        this._overlay.style.display = 'none';
        this._mainMenu.style.filter = '';        
    }
}