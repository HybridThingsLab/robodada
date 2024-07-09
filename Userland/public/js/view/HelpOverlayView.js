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
        this._overlay.classList.add('is-active');
        this._mainMenu.classList.add('has-active-overlay');
    }

    closeOverlay() {
        this._overlay.classList.remove('is-active');
        this._mainMenu.classList.remove('has-active-overlay');
    }
}