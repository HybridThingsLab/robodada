class RoboChooserOverlayView {
    constructor() {
        this._overlay = document.querySelector(".robo-chooser-overlay");
        this._mainMenu = document.querySelector(".main-menu");
        this._close = document.querySelector(".robo-chooser-overlay > .close");
        this._interfaceWrapper = document.querySelector(".robo-chooser-overlay .robo-chooser-nav");
        this._addEventListeners();
    }

    _addEventListeners() {
        this._overlayEventlistener();
    }

    _overlayEventlistener() {
        //clicking the close button closes the overlay
        this._close.addEventListener("mousedown", this.closeOverlay.bind(this));

        //clicking outside the drawing area closes the overlay too
        this._overlay.addEventListener('mousedown', this.closeOverlay.bind(this));
        this._overlay.childNodes.forEach((item) => {
            item.addEventListener('mousedown', (evt) => {
                evt.stopPropagation();
            })
        })
    }

    updateOverlayContent(roboList, currentRobo) {
        // @note injects testdata during development
        if (typeof roboListTestData !== 'undefined' && typeof currentRoboTestData !== 'undefined') {
            roboList = roboListTestData;
            currentRobo = currentRoboTestData;
        }

        this._interfaceWrapper.innerHTML = "";
        roboList.forEach(robo => {
            let icon = document.createElement("img");
            icon.src = "img/roboChooser/available.svg";
            icon.classList.add("robo__icon");

            let name = document.createElement("p");
            name.classList.add("robo__name");
            name.innerText = robo.name;

            let claimButton = document.createElement("div");
            claimButton.classList.add("button", "claim-button");

            // Wave button is not needed for now
            // let waveButton = document.createElement("div");
            // waveButton.classList.add("button", "wave-button");
            // let waveEmoji = document.createElement("img");
            // waveEmoji.src = "img/roboChooser/wave.svg";
            // waveEmoji.classList.add("icon");
            // waveButton.appendChild(waveEmoji);

            let buttonWrapper = document.createElement("div");
            buttonWrapper.classList.add("buttons");
            buttonWrapper.appendChild(claimButton);
            // buttonWrapper.appendChild(waveButton);

            let infoText = document.createElement("p");
            infoText.classList.add("robo__info");

            if (robo.state == 1) {
                infoText.innerHTML = `<em>${robo.name}</em> is ready to be used.`;
                claimButton.innerText = "connect now";
                claimButton.addEventListener('click', () => {
                    let event = new CustomEvent("notifyClaimRobot");
                    event.robotName = robo.name;
                    dispatchEvent(event);
                });
            } else if (robo.state == 0 && currentRobo == robo.name) {
                icon.src = "img/roboChooser/connected.svg"
                infoText.innerHTML = `You are using <em>${robo.name}</em> as your robo.`;
                claimButton.innerText = "disconnect";
                claimButton.addEventListener('click', () => {
                    let event = new CustomEvent("notifyReleaseRobot");
                    dispatchEvent(event);
                });
            } else {
                icon.src = "img/roboChooser/connected_other.svg"
                infoText.innerHTML = `<em>${robo.name}</em> is in use by someone else.`;
                claimButton.innerText = "connect anyway";
                claimButton.addEventListener('click', () => {
                    let event = new CustomEvent("notifyClaimRobot");
                    event.robotName = robo.name;
                    dispatchEvent(event);
                });
            }

            // outer button element
            let button = document.createElement("div");
            button.classList.add("button", "robo-chooser-button", "robo");
            button.addEventListener('click', () => {
                this._setCurrentAsActive(button);
            })
            
            // inner front and back elements
            let front = document.createElement("div");
            front.classList.add("robo__front");
            let back = document.createElement("div");
            back.classList.add("robo__back");
            button.appendChild(front);
            button.appendChild(back);
            // add inner items
            front.appendChild(icon);
            front.appendChild(name);
            back.appendChild(infoText);
            back.appendChild(buttonWrapper);
            // creates wrapper item to maintain grid size
            let gridItem = document.createElement("div");
            gridItem.appendChild(button);
            this._interfaceWrapper.appendChild(gridItem);
        });
    }

    _setCurrentAsActive(clickedButton) {
        let buttonList = document.querySelectorAll(".robo-chooser-button");
        buttonList.forEach(button => {
            if (button != clickedButton) {
                button.classList.remove("active");
            }
        });
        clickedButton.classList.add("active");
    }

    openOverlay(roboList, currentRobo) {
        this.updateOverlayContent(roboList, currentRobo);
        this._overlay.classList.add('is-active');
        this._mainMenu.classList.add('has-active-overlay');
    }

    closeOverlay() {
        this._overlay.classList.remove('is-active');
        this._mainMenu.classList.remove('has-active-overlay');
    }
}