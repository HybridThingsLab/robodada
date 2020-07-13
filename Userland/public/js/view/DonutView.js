class DonutView {
    constructor(){
        this.donuts = document.querySelectorAll('.inner-donut-wrapper');
    }

    handleNewTrackResult(trackresult){
        this.donuts.forEach((elem)=>{
            let srcString = elem.firstElementChild.src;
            srcString = srcString.substring(srcString.lastIndexOf('/') + 1, srcString.lastIndexOf('.'));
            //console.log(srcString, trackresult['expressions'][srcString]);
            let donut = elem.lastElementChild;
            if(donut.contentDocument != undefined){
                let circles = donut.contentDocument.getElementsByClassName('circle-chart__circle');
                circles[0].style.strokeDasharray = "" + trackresult['expressions'][srcString] * 100 +" 100";                
                circles[1].style.strokeDasharray = "" + trackresult['expressions'][srcString] * 100 +" 100";
            }
            
        })
    }

}