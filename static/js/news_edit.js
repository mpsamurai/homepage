window.onload = function() {

};

(() => {
    'use strict';

    const menuElement = document.getElementsByClassName('menu');
    menuElement[0].style.position = 'static';

    const ImageSelector = (() => {
        return class {
            constructor(idImageElement) {
                const self = this;
                this.observerList = [];
                this._idImageElement = idImageElement;
                this._idImageElement.addEventListener('change', () => {
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

    const ClippedImage = (() => {
        return class {
            constructor(canvasContainerElement, canvasElement, baseImageElement, context) {
                this._canvasContainerElement = canvasContainerElement;
                this._canvasElement = canvasElement;
                this._baseImageElement = baseImageElement;
                this._canvasContext = canvasElement.getContext(context);
            }

            setImage(baseImageElement) {
                const img = new Image();
                const canvasContainerWidth = canvasContainerElement.clientWidth;
                const baseImageWidth = baseImageElement.naturalWidth;
                const baseImageHeight = baseImageElement.naturalHeight;

                const aspectRatio = this.findAspectRatio(canvasContainerWidth)(baseImageWidth);
                canvasElement.setAttribute('width', baseImageWidth * aspectRatio);
                canvasElement.setAttribute('height', baseImageHeight * aspectRatio);
                this._canvasContext.scale(aspectRatio, aspectRatio)
                this._canvasContext.drawImage(baseImageElement, 0, 0);
            }

            findAspectRatio(containerWidth) {
                return (imageWidth) => {
                    return containerWidth / imageWidth;
                }
            }

            update(value) {
                console.log('clippedImage ' + value);
            }
        }
    })();

    const canvasContainerElement = document.getElementById('canvas_container');
    const canvasElement = document.getElementById('canvas');
    const offScreenCanvasElement = document.createElement('canvas');
    const baseImageElement = document.getElementById('base_image');
    const idImageElement = document.getElementById('id_image');
    const slideBarOfScalingElement = document.getElementById('slide_bar_of_scaling');

    const scale1 = new Scale();
    const preview1 = new Preview();
    const imageSelector1 = new ImageSelector(idImageElement);
    const canvas1 = new Canvas(canvasElement);
    const clippedImage1 = new ClippedImage(canvasContainerElement, canvasElement, baseImageElement, '2d');

    scale1.addObserver(clippedImage1);
    preview1.addObserver(clippedImage1);
    imageSelector1.addObserver(clippedImage1);
    canvas1.addObserver(clippedImage1);

    clippedImage1.setImage(baseImageElement);





})();