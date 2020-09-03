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

    /*
        <div class="robo-chooser-button button">
            <img class="robo-icon" src="img/menu/robot.svg" alt="">
            <p class="robo-name">bender</p>
        </div>
    */

    //TODO also call this when available robots list has changed
    updateOverlayContent(roboList, currentRobo){
        this._interfaceWrapper.innerHTML = "";
        roboList.forEach(robo => {
            let icon = document.createElement("img");
            icon.src = "img/menu/robot.svg";
            icon.classList.add("robo-icon");

            let name = document.createElement("p");
            name.classList.add("robo-name");
            name.innerText = robo.name;

            let claimButton = document.createElement("div");
            claimButton.classList.add("claim-button");
            claimButton.classList.add("button");
            claimButton.style.display = "none";

            let infoText = document.createElement("p");
            infoText.classList.add("info-text");
            infoText.style.display = "none";

            if(robo.state == 1){
                infoText.innerText = robo.name + " is ready to be used.";
                claimButton.innerText = "connect now"
            } else if(robo.state == 0 && currentRobo == robo.name){
                infoText.innerText = "you are using " + robo.name + " as your robo.";
                claimButton.innerText = "disconnect"
            }else{
                infoText.innerText = robo.name + " is in use by someone else.";
                claimButton.innerText = "connect anyway"
            }
            
            
            
            let waveButton = document.createElement("div");
            waveButton.classList.add("wave-button");
            waveButton.classList.add("button");
            waveButton.style.display = "none";
            
            let button = document.createElement("div");
            button.classList.add("robo-chooser-button");
            button.classList.add("button");
            button.appendChild(icon);
            button.appendChild(name);
            button.appendChild(infoText);
            button.appendChild(claimButton);
            button.appendChild(waveButton);
            button.addEventListener('click', () => {
                this._setCurrentAsActive(button);
            })

            this._interfaceWrapper.appendChild(button);
        });
    }

    _setCurrentAsActive(clickedButton) {
        let buttonList = document.querySelectorAll(".robo-chooser-button");
        buttonList.forEach(button => {
            button.classList.remove("active");
            button.childNodes[1].style.display = "block";
            button.childNodes[2].style.display = "none";
            button.childNodes[3].style.display = "none";
            button.childNodes[4].style.display = "none";
        });
        clickedButton.classList.add("active");
        clickedButton.childNodes[1].style.display = "none";
        setTimeout(() => {
            clickedButton.childNodes[2].style.display = "block";
            clickedButton.childNodes[3].style.display = "block";
            clickedButton.childNodes[4].style.display = "block";
        }, 125);

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