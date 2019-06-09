window.onload = function() {

};

(() => {
    'use strict';

    const menuElem = document.getElementsByClassName('menu');
    menuElem[0].style.position = 'static';

    const ImgSelector = (() => {
        return class {
            constructor(idImgElem) {
                const self = this;
                this.observerList = [];
                this._idImgElem = idImgElem;
                this._idImgElem.addEventListener('change', () => {
                    console.log(1234);



                }, false);
            }

            addObserver(obj) {
                this.observerList.push(obj);
            }

            notifyObserver() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].update('imageSelector');
                }
            }
        }
    })();

    const Scale = (() => {
        return class {
            constructor() {
                this.observerList = [];
            }

            addObserver(obj) {
                this.observerList.push(obj);
            }

            notifyObserver() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].update('scale');
                }
            }
        }
    })();

    const Preview = (() => {
        return class {
            constructor() {
                this.observerList = [];
            }

            addObserver(obj) {
                this.observerList.push(obj);
            }

            notifyObserver() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].update('preview');
                }
            }
        }
    })();

    const Canvas = (() => {
        return class {
            constructor(_canvasElement) {
                this.observerList = [];
                this.canvasElement = _canvasElement;
            }

            addObserver(obj) {
                this.observerList.push(obj);
            }

            notifyObserver() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].update('canvas');
                }
            }
        }
    })();

    const ClippedImg = (() => {
        return class {
            constructor(canvasContainerElem, canvasElem, baseImgElem, context) {
                this._canvasContainerElem = canvasContainerElem;
                this._canvasElem = canvasElem;
                this._baseImgElem = baseImgElem;
                this._canvasContext = canvasElem.getContext(context);
            }

            setImg(baseImgElem) {
                const img = new Image();
                const canvasContainerWidth = canvasContainerElem.clientWidth;
/*
                const baseImageWidth = baseImageElement.naturalWidth;
                const baseImageHeight = baseImageElement.naturalHeight;
*/

                const baseImgWidth = 1680;
                const baseImgHeight = 1050;


                var biggerResult = Math.max(baseImgWidth, baseImgHeight);
                var smallerResult = Math.min(baseImgWidth, baseImgHeight);

                console.log('大きい方: ' + biggerResult);
                console.log('小さい方: ' + smallerResult);

                const smallNumCalcBasedOnTheRatio = smallerResult / biggerResult;






                const aspectRatio = this.findAspectRatio(canvasContainerWidth)(baseImgWidth);
                let width = baseImgWidth * aspectRatio;

                console.log('widthは ' + width);

                if(width >= 1200) {
                    width = 1200;
                }

                console.log('widthは ' + width);

                let height;

                if(baseImgWidth >= baseImgHeight) {
                    height = width * smallNumCalcBasedOnTheRatio;
                } else if(baseImgWidth <= baseImgHeight) {
                    height = width / smallNumCalcBasedOnTheRatio;
                }

                console.log('widthは' + width);
                console.log('heightは' + height);

                canvasElem.setAttribute('width', width);
                canvasElem.setAttribute('height', height);
                this._canvasContext.scale(aspectRatio, aspectRatio)
                this._canvasContext.drawImage(baseImgElem, 0, 0);

/*
                const aspectRatio = this.findAspectRatio(canvasContainerWidth)(baseImageWidth);
                let w = baseImageWidth * aspectRatio;
                canvasElement.setAttribute('width', baseImageWidth * aspectRatio);
                canvasElement.setAttribute('height', baseImageHeight * aspectRatio);
                this._canvasContext.scale(aspectRatio, aspectRatio)
                this._canvasContext.drawImage(baseImageElement, 0, 0);
*/
            }

            findAspectRatio(containerWidth) {
                return (imgWidth) => {
                    return containerWidth / imgWidth;
                }
            }

            findGreatestCommonDivisor(x) {
                return (y) => {
                    if(y === 0) return x;
                    return findGreatestCommonDivisor(y)(x % y);
                }
            }


            update(value) {
                console.log('clippedImage ' + value);
            }
        }
    })();

    const canvasContainerElem = document.getElementById('canvas_container');
    const canvasElem = document.getElementById('canvas');
    const offScreenCanvasElem = document.createElement('canvas');
    const baseImgElem = document.getElementById('base_image');
    const idImgElem = document.getElementById('id_image');
    const slideBarOfScalingElem = document.getElementById('slide_bar_of_scaling');

    const scale1 = new Scale();
    const preview1 = new Preview();
    const imgSelector1 = new ImgSelector(idImgElem);
    const canvas1 = new Canvas(canvasElem);
    const clippedImg1 = new ClippedImg(canvasContainerElem, canvasElem, baseImgElem, '2d');

    scale1.addObserver(clippedImg1);
    preview1.addObserver(clippedImg1);
    imgSelector1.addObserver(clippedImg1);
    canvas1.addObserver(clippedImg1);

    clippedImg1.setImg(baseImgElem);






/*
function findGreatestCommonDivisor(x, y) {
    if(y === 0) return x;
    return findGreatestCommonDivisor(y, x % y);
}
*/

function findGreatestCommonDivisor(x) {
    return (y) => {
        if(y === 0) return x;
        return findGreatestCommonDivisor(y)(x % y);
    }
}

/*
let w = 600;
let h = 1500;

const gcd = findGreatestCommonDivisor(w)(h);

console.log('最大公約数: ' + gcd);

let widthRatio = w / gcd;
let heightRatio = h / gcd;

console.log('横の比率: ' + widthRatio);
console.log('縦の比率: ' + heightRatio);

(function() {
    if(widthRatio >= heightRatio) {
        console.log('横幅: ' + w * (heightRatio / widthRatio));
        console.log('縦幅: ' + h * (heightRatio / widthRatio));
    } else {
        console.log('横幅: ' + w * (widthRatio / heightRatio));
        console.log('縦幅: ' + h * (widthRatio / heightRatio));
    }
})();
*/

})();