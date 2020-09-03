class HelpOverlayView{
    constructor(){
        this._overlay = document.querySelector(".help-overlay");
        this._mainMenu = document.querySelector(".main-menu");
        this._close = document.querySelector(".help-overlay > .close");
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

    openOverlay() {
        this._overlay.style.display = 'block';
        this._mainMenu.style.filter = 'blur(4px)';
    }

    closeOverlay() {
        this._overlay.style.display = 'none';
        this._mainMenu.style.filter = '';        
    }
}