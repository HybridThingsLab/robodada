var emotionValues = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

class DonutView {
    constructor(){
        this.donutViewContainer = document.getElementById("donut-view");
        this.donutRenderer = this.buildDonutRenderer();
        this.donutView = new p5(this.donutRenderer, this.donutViewContainer);
    }

    handleNewTrackResult(trackresult){
        emotionValues = trackresult.expressions;
    }

    buildDonutRenderer(){
        return (function(p){
            let width = window.innerHeight;
            let height = window.innerHeight * 0.15;
            let strokeWeight = p.windowHeight / 200;
            let donutScale = 0.9;
            let innerDonutScale = 0.7;
            let emojiScale = 1.55;
            let emojiNames = ["angry", "disgusted", "fearful", "happy", "neutral", "sad", "surprised"];
            let emojiPath = "img/emotions/";
            let graphColor = "#A2D2F9";
            let emojiImgs = [];

            p.preload = function(){
                for (let i = 0; i < emojiNames.length; i++) {
                     emojiImgs[i] = p.loadImage(emojiPath + emojiNames[i] + ".svg");
                }
            }

            p.setup = function(){
                p.createCanvas(width, height);
                p.smooth(8);
                p.imageMode(p.CENTER);
            }

            p.draw = function(){
                p.background("#FFFFFF");
                for (let i = 0; i < 7; i++) {
                    drawDonut((p.height - strokeWeight) / 2 + (p.width / 7) * i, p.height/2, i, emotionValues[emojiNames[i]]);
                }
            }

            let drawDonut = function(x, y, emotion, val){
                let donutSize = p.height * donutScale - strokeWeight;
                let innerDonutSize = p.height * donutScale * innerDonutScale - strokeWeight;
                p.noFill();
                p.stroke(0);
                p.strokeWeight(strokeWeight);
                //Draw Emoji
                let emoji = emojiImgs[emotion]
                p.image(emoji, x, y, innerDonutSize * emojiScale, innerDonutSize * emojiScale);
                //Prevent val == 0
                p.strokeWeight((donutSize - innerDonutSize) / 2);
                if(val < 0.001){
                    val = 0.001;
                }
                //Draw circle
                p.arc(x,y, (donutSize + innerDonutSize) / 2, (donutSize + innerDonutSize) / 2, -p.PI / 2, -p.PI / 2 + (val * 2 * p.PI));
                p.stroke(graphColor);
                p.strokeWeight((donutSize - innerDonutSize) / 3);
                p.arc(x,y, (donutSize + innerDonutSize) / 2, (donutSize + innerDonutSize) / 2, -p.PI / 2, -p.PI / 2 + (val * 2 * p.PI));
                
                //Reset Stroke
                p.stroke(0);
                p.strokeWeight(strokeWeight);
                //Draw outer border
                p.ellipse(x, y, donutSize, donutSize);
                //Draw inner border
                p.ellipse(x, y, innerDonutSize, innerDonutSize);
            }
        })
    }
}