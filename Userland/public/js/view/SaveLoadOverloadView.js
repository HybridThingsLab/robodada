class SaveLoadOverlayView{
    constructor(){
        this._overlay = document.querySelector(".save-load-overlay");
        this._mainMenu = document.querySelector(".main-menu");
        this._close = document.querySelector(".save-load-overlay > .close");
        this._saveButton = document.querySelector(".save-paths-button");
        this._loadButton = document.querySelector(".load-paths-button");
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

        this._saveButton.addEventListener('click', this._save);
        this._loadButton.addEventListener('click', this._load);

    }

    _save() {
        let event = new CustomEvent("notifySaveToJSONFile");
        dispatchEvent(event);
    }
    
    _load() {
        let event = new CustomEvent("notifyLoadFromJSONFile");
        dispatchEvent(event);
    }

    openOverlay() {
        this._overlay.style.display = 'flex';
        this._mainMenu.style.filter = 'blur(4px)';
    }

    closeOverlay() {
        this._overlay.style.display = 'none';
        this._mainMenu.style.filter = '';        
    }
}