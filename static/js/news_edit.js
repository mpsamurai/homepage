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
                        self.observerList[i].imgElem = img;
                        self.observerList[i].setImg({scale: 1});
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
                this._slideBarOfScalingElem.value = 1;
                this._slideBarOfScalingElem.min = 0.01;
                this._slideBarOfScalingElem.max = 2;
                this._slideBarOfScalingElem.step = 'any';
                this._slideBarOfScalingElem.addEventListener('input', (e) => {
                    self.scaleImg({scale: e.target.value});
                }, false);
            }

            addObserver(obj) {
                this.observerList.push(obj);
            }

            scaleImg() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].setImg({scale: this._slideBarOfScalingElem.value});
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
                this._canvasSize;
                this._imgSize;
                this._canvasContext = canvasElem.getContext(context);
                this.imgElem.src = baseImgElem.src;



                this.imgElem.addEventListener('load', function() {
                    self.setImg({scale: 1});
                });
            }

            setImg(args) {




                console.log(args.scale);

                // 倍率変更



                this.imgSize = {width: this.imgElem.naturalWidth, height: this.imgElem.naturalHeight}
                this.canvasContext.clearRect(0, 0, this.imgSize.width, this.imgSize.height);
                const smallNumCalcBasedOnTheRatio = this.calcSmallNumCalcBasedOnTheRatio(this.imgSize.width)(this.imgSize.height);



                console.log(this.imgSize.width, this.imgSize.height);

                console.log(smallNumCalcBasedOnTheRatio);



                console.log(args.scale);


                this.canvasElem.setAttribute('width', this.imgElem.naturalWidth * args.scale);
                this.canvasElem.setAttribute('height', (this.imgElem.naturalWidth * args.scale) * smallNumCalcBasedOnTheRatio);

                const scale = args.scale;
                this._canvasContext.scale(scale, scale);

                // 再描画
                this._canvasContext.drawImage(this._imgElem, 0, 0);

                // 変換マトリクスを元に戻す
                this._canvasContext.scale(1 / scale, 1 / scale);







/*
                console.log('args.img: ' + args.img);

                const canvasContainerWidth = canvasContainerElem.clientWidth;

                const baseImgSize = this.getBaseImgSize(args);

                const smallNumCalcBasedOnTheRatio = this.calcSmallNumCalcBasedOnTheRatio(baseImgSize.width)(baseImgSize.height);
                const imgWidth = this.judgeImgWidthExceedsTheCanvasWidth(baseImgSize.width);
                let aspectRatio = this.findAspectRatio(imgWidth)(baseImgSize.width);

                console.log('aspectRatio: ' + aspectRatio + ' scale: ' + args.scale);

                const imgHeight = this.calcImgHeight(baseImgSize.width, baseImgSize.height, imgWidth, smallNumCalcBasedOnTheRatio);

                canvasElem.setAttribute('width', imgWidth);
                canvasElem.setAttribute('height', imgHeight);

                var test = aspectRatio * args.scale;

                this._canvasContext.scale(test, test)

                if(args.img == null) {
                    this._canvasContext.drawImage(this._imgElem, 0, 0);
                } else {
                    this._canvasContext.drawImage(args.img, 0, 0);
                }
*/

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

            get canvasContainerElem() {
                return this._canvasContainerElem;
            }

            set canvasContainerElem(elem) {
                this._canvasContainerElem = elem;
            }

            get canvasElem() {
                return this._canvasElem;
            }

            set canvasElem(elem) {
                this._canvasElem = elem;
            }

            get baseImgElem() {
                return this._baseImgElem;
            }

            set baseImgElem(elem) {
                this._baseImgElem = elem;
            }











            get canvasSize() {
                return this._canvasSize;
            }

            set canvasSize(val) {
                this._canvasSize = val;
            }






            get imgSize() {
                return this._imgSize;
            }

            set imgSize(val) {
                this._imgSize = val;
            }



            get imgElem() {
                return this._imgElem;
            }

            set imgElem(val) {
                this._imgElem = val;
            }

            get canvasContext() {
                return this._canvasContext;
            }

            set canvasContext(val) {
                this._canvasContext = val;
            }









            getBaseImgSize(args) {
                if(args.img == null) {
                    return {width: this._imgElem.naturalWidth, height: this._imgElem.naturalHeight};
                } else {
                    return {width: args.img.naturalWidth, height: args.img.naturalHeight};
                }
            }

            calcSmallNumCalcBasedOnTheRatio(baseImgWidth) {
                return (baseImgHeight) => {
                    return baseImgHeight / baseImgWidth;
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