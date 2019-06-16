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

            get idImgElem() {
                return this._idImgElem;
            }

            set idImgElem(val) {
                this._idImgElem = val;
            }

            addObserver(obj) {
                this.observerList.push(obj);
            }

            switchImg(data, self) {
                const img = new Image();
                img.onload = () => {
                    for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                        self.observerList[i].imgElem = img;
                        self.observerList[i].scaleObj.slideBarOfScalingElem.value = 1;
                        self.observerList[i].init({img: img, scale: 1});
                    }
                }
                img.src = data;
            }
        }
    })();

    const Scale = (() => {
        return class {
            constructor(slideBarOfScalingElem) {
                const self = this;
                this.observerList = [];
                this._slideBarOfScalingElem = slideBarOfScalingElem;
                this._slideBarOfScalingElem.scale;
                this._slideBarOfScalingElem.min = 0.01;
                this._slideBarOfScalingElem.max = 2;
                this._slideBarOfScalingElem.step = 'any';

                this._slideBarOfScalingElem.addEventListener('input', (e) => {
                    self.scaleImg({scale: self.slideBarOfScalingElem.scale * (1 * e.target.value), obj: self});
                }, false);
            }

            get slideBarOfScalingElem() {
                return this._slideBarOfScalingElem;
            }

            set slideBarOfScalingElem(val) {
                this._slideBarOfScalingElem = val;
            }

            addObserver(obj) {
                this.observerList.push(obj);
            }

            scaleImg(args) {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].setImg({img: this.observerList[i].imgElem, scale: args.scale, obj: args.obj});
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
            constructor(canvasContainerElem, canvasElem, baseImgElem, imgElem, scaleObj, context) {
                const self = this;
                this._canvasContainerWidth = canvasContainerElem.clientWidth;
                this._canvasElem = canvasElem;
                this._baseImgElem = baseImgElem;
                this._imgElem = imgElem;
                this._imgSize;
                this._scaleObj = scaleObj;
                this._canvasContext = canvasElem.getContext(context);
                this.imgElem.src = baseImgElem.src;

                this.imgElem.onload = () => {
                    self.init({img: this.imgElem});
                }
            }

            init(args) {
                const aspectRatio = this.calcRatio(args.img.naturalWidth)(args.img.naturalHeight);
                this.imgSize = {width: args.img.naturalWidth, height: args.img.naturalHeight}

                let ratioImgWidthAdjustedToContainer;

                ratioImgWidthAdjustedToContainer = this.calcRatio(this.canvasContainerWidth)(this.imgSize.width);

                this._scaleObj._slideBarOfScalingElem.scale = ratioImgWidthAdjustedToContainer;

                this.setImg({img: args.img, scale: ratioImgWidthAdjustedToContainer});
            }

            setImg(args) {
                this.canvasElem.setAttribute('width', this.imgSize.width * args.scale);
                this.canvasElem.setAttribute('height', this.imgSize.height * args.scale);

                this.canvasContext.scale(args.scale, args.scale);
                this.canvasContext.drawImage(args.img, 0, 0);
                this.canvasContext.scale(1 / args.scale, 1 / args.scale);
            }

            get canvasContainerWidth() {
                return this._canvasContainerWidth;
            }

            set canvasContainerWidth(val) {
                this._canvasContainerWidth = val;
            }

            get canvasElem() {
                return this._canvasElem;
            }

            set canvasElem(val) {
                this._canvasElem = val;
            }

            get baseImgElem() {
                return this._baseImgElem;
            }

            set baseImgElem(val) {
                this._baseImgElem = val;
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

            get slideBarOfScalingElem() {
                return this._slideBarOfScalingElem;
            }

            set slideBarOfScalingElem(val) {
                this._slideBarOfScalingElem = val;
            }

            get scaleObj() {
                return this._scaleObj;
            }

            set scaleObj(val) {
                this._scaleObj = val;
            }

            get canvasContext() {
                return this._canvasContext;
            }

            set canvasContext(val) {
                this._canvasContext = val;
            }

            calcRatio(val1) {
                return (val2) => {
                    return val1 / val2;
                }
            }

            update(value) {
                console.log('clippedImage ' + value);
            }
        }
    })();

    const bodyElem = document.getElementsByTagName('body');
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
    const clippedImg1 = new ClippedImg(canvasContainerElem, canvasElem, baseImgElem, imgElem, scale1, '2d');

    scale1.addObserver(clippedImg1);
    preview1.addObserver(clippedImg1);
    imgSelector1.addObserver(clippedImg1);
    canvas1.addObserver(clippedImg1);

})();