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
                this._idImgElem.addEventListener('change', (e) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        self.switchImg(e.target.result, self);
                    }
                    reader.readAsDataURL(e.target.files[0]);
                }, false);
            }
/*
            switchImage(data, self) {

                this.notifyObserver();
                const image = new Image();

                image.onload = () => {
                    self[private_.canvasImage].setImage(img);
                }
                image.src = data;
            }
*/

            addObserver(obj) {
                this.observerList.push(obj);
            }

            switchImg(data, self) {

                const img = new Image();

                img.onload = () => {
                    for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                        self.observerList[i].setImg({img: img});
                    }
                }
                img.src = data;
            }

/*
            notifyObserver() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].showTest();
                }
            }
*/

        }
    })();

    const Scale = (() => {
        return class {
            constructor(slideBarOfScalingElem) {
                const self = this;
                this.observerList = [];
                this._slideBarOfScalingElem = slideBarOfScalingElem;
                this._slideBarOfScalingElem.addEventListener('change', (e) => {
                    self.scaleImg();
                }, false);
            }

            addObserver(obj) {
                this.observerList.push(obj);
            }

            scaleImg() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].setImg({img: null, scale: this._slideBarOfScalingElem.value});
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
            constructor(canvasContainerElem, canvasElem, baseImgElem, imgElem, context) {
                const self = this;
                this._canvasContainerElem = canvasContainerElem;
                this._canvasElem = canvasElem;
                this._baseImgElem = baseImgElem;
                this._imgElem = imgElem;
                this._canvasContext = canvasElem.getContext(context);
                this._imgElem.src = baseImgElem.src;
                this._imgElem.addEventListener('load', function() {
                    self.setImg({img: self._imgElem});
                });
            }

            setImg(args) {

                console.log('args.img: ' + args.img);

                const canvasContainerWidth = canvasContainerElem.clientWidth;

                const baseImgSize = this.getBaseImgSize(args);

                console.log(baseImgSize.width);
                console.log(baseImgSize.height);


                const smallNumCalcBasedOnTheRatio = this.calcSmallNumCalcBasedOnTheRatio(baseImgSize.width, baseImgSize.height);
                const imgWidth = this.judgeImgWidthExceedsTheCanvasWidth(baseImgSize.width);
                let aspectRatio = this.findAspectRatio(imgWidth)(baseImgSize.width);
                const imgHeight = this.calcImgHeight(baseImgSize.width, baseImgSize.height, imgWidth, smallNumCalcBasedOnTheRatio);

                canvasElem.setAttribute('width', imgWidth);
                canvasElem.setAttribute('height', imgHeight);

                this._canvasContext.scale(aspectRatio, aspectRatio)



                if(args.img == null) {
                    this._canvasContext.drawImage(this._imgElem, 0, 0);
                } else {
                    this._canvasContext.drawImage(args.img, 0, 0);
                }


/*
                const baseImgWidth = args.img.naturalWidth;
                const baseImgHeight = args.img.naturalHeight;
                const smallNumCalcBasedOnTheRatio = this.calcSmallNumCalcBasedOnTheRatio(baseImgWidth, baseImgHeight);
                const imgWidth = this.judgeImgWidthExceedsTheCanvasWidth(baseImgWidth);
                let aspectRatio = this.findAspectRatio(imgWidth)(baseImgWidth);
                const imgHeight = this.calcImgHeight(baseImgWidth, baseImgHeight, imgWidth, smallNumCalcBasedOnTheRatio);

                canvasElem.setAttribute('width', imgWidth);
                canvasElem.setAttribute('height', imgHeight);

                this._canvasContext.scale(aspectRatio, aspectRatio)


                this._canvasContext.drawImage(args.img, 0, 0);
*/
            }

            getBaseImgSize(args) {
                if(args.img == null) {
                    return {width: this._imgElem.naturalWidth, height: this._imgElem.naturalHeight};
                } else {
                    return {width: args.img.naturalWidth, height: args.img.naturalHeight};
                }
            }

            calcSmallNumCalcBasedOnTheRatio(baseImgWidth, baseImgHeight) {

                if(baseImgWidth >= baseImgHeight) {
                    return baseImgHeight / baseImgWidth;
                } else {
                    return baseImgWidth / baseImgHeight;
                }
            }

            findAspectRatio(imgWidth) {
                return (baseImgWidth) => {
                    return imgWidth / baseImgWidth;
                }
            }

            judgeImgWidthExceedsTheCanvasWidth(width) {

                const bodyElem = document.getElementsByTagName('body');

                if(width >= bodyElem[0].clientWidth) {
                    return bodyElem[0].clientWidth;
                } else {
                    return width;
                }
            }

            calcImgHeight(baseImgWidth, baseImgHeight, imgWidth, smallNumCalcBasedOnTheRatio) {
                if(baseImgWidth >= baseImgHeight) {
                    return imgWidth * smallNumCalcBasedOnTheRatio;
                } else if(baseImgWidth <= baseImgHeight) {
                    return imgWidth / smallNumCalcBasedOnTheRatio;
                }
            }

/*
            findGreatestCommonDivisor(x) {
                return (y) => {
                    if(y === 0) return x;
                    return findGreatestCommonDivisor(y)(x % y);
                }
            }
*/
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
    const imgElem = new Image();
    const slideBarOfScalingElem = document.getElementById('slide_bar_of_scaling');

    const scale1 = new Scale(slideBarOfScalingElem);
    const preview1 = new Preview();
    const imgSelector1 = new ImgSelector(idImgElem);
    const canvas1 = new Canvas(canvasElem);
    const clippedImg1 = new ClippedImg(canvasContainerElem, canvasElem, baseImgElem, imgElem, '2d');

    scale1.addObserver(clippedImg1);
    preview1.addObserver(clippedImg1);
    imgSelector1.addObserver(clippedImg1);
    canvas1.addObserver(clippedImg1);

/*
    clippedImg1.setImg(baseImgElem);
*/





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