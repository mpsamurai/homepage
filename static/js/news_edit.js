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
            constructor(canvasContainerElem, canvasElem, offScreenCanvasElem, context) {
                const self = this;
                this.observerList = [];
/*
                this._canvasElement = canvasElement;
*/

                this.canvasContainerElem = canvasContainerElem;
                this.canvasElem = canvasElem;

                this.offScreenCanvasElem = offScreenCanvasElem;

                this.canvasContext = this.canvasElem.getContext(context);
                this.offScreenCanvasContext = this.offScreenCanvasElem.getContext(context);
                this.canvasElemPosition = this.canvasElem.getBoundingClientRect();
                this.coordinate = {};
                this.coordinate.xCoordinateOfElem = this.canvasElemPosition.left + window.pageXOffset;
                this.coordinate.yCoordinateOfElem = this.canvasElemPosition.top + window.pageYOffset;

                this.drawRectangle(this.canvasContainerElem)(this.canvasElem)(this.offScreenCanvasElem)(this.canvasElemPosition)(this.coordinate);

            }

            drawRectangle(canvasContainerElem) {
                return (canvasElem) => {
                    return (offScreenCanvasElem) => {
                        return (canvasElemPosition) => {
                            return (coordinate) => {
                                const valAdjustRectangleSelectionSize = this.adjustRectangleSelectionSize.bind(null)(this);

                                this.startRectangleSelected(canvasContainerElem)(canvasElem)(canvasElemPosition)(coordinate)(valAdjustRectangleSelectionSize);
                                this.endRectangleSelected(canvasContainerElem)(canvasElem)(canvasElemPosition)(coordinate)(valAdjustRectangleSelectionSize);





/*
                                this.startRectangleSelected(canvasContainerElem)(canvasElem)(canvasElemPosition)(coordinate)(valAdjustRectangleSelectionSize);
                                this.endRectangleSelected(canvasContainerElem)(canvasElem)(canvasElemPosition)(coordinate)(valAdjustRectangleSelectionSize);
*/
                            }
                        }
                    }
                }



//                this.endRectangleSelected(valAdjustRectangleSelectionSize);




/*
                const valAdjustRectangleSelectionSize = this.adjustRectangleSelectionSize.bind(null, this);
                this.startRectangleSelected(valAdjustRectangleSelectionSize);
                this.endRectangleSelected(valAdjustRectangleSelectionSize);
*/

            }

            startRectangleSelected(canvasContainerElem) {
                return (canvasElem) => {
                    return (canvasElemPosition) => {
                        return (coordinate) => {
                            return (valAdjustRectangleSelectionSize) => {
                                const canvasBorderWidth = canvasContainerElem.style.borderWidth.slice(0, 2);
                                canvasElem.elemYCoordinate = canvasElemPosition.top + window.pageYOffset;
                                canvasElem.canvasBorderWidth = canvasBorderWidth;
                                canvasElem.xStartingPoint;
                                canvasElem.yStartingPoint;
                                canvasElem.addEventListener('mousedown', (e) => {

                                    e.target.xStartingPoint = e.pageX - canvasElem.offsetLeft - canvasElem.canvasBorderWidth;
                                    e.target.yStartingPoint = e.pageY - canvasElem.offsetTop - canvasElem.elemYCoordinate + canvasContainerElem.scrollTop;
                                    e.target.containerScrollTop = canvasContainerElem.scrollTop;

                                    canvasElem.addEventListener('mousemove', valAdjustRectangleSelectionSize);
                                });
                            }
                        }
                    }
                }
            }

/*
            startRectangleSelected(canvasContainerElem) {
                return (canvasElem) => {
                    return (canvasElemPosition) => {
                        return (coordinate) => {
                            return (valAdjustRectangleSelectionSize) => {

                                const canvasBorderWidth = canvasContainerElem.style.borderWidth.slice(0, 2);
                                canvasElem.elemYCoordinate = canvasElemPosition.top + window.pageYOffset;
                                canvasElem.coordinate = coordinate;
                                canvasElem.canvasBorderWidth = canvasBorderWidth;
                                canvasElem.addEventListener('mousedown', (e) => {

                                    e.target.coordinate.xStartingPoint = e.pageX - canvasElem.offsetLeft - canvasElem.canvasBorderWidth;
                                    e.target.coordinate.yStartingPoint = e.pageY - canvasElem.offsetTop - canvasElem.elemYCoordinate;

                                    canvasElem.addEventListener('mousemove', valAdjustRectangleSelectionSize(canvasElem.elemYCoordinate)(e.target.coordinate));
                                });
                            }
                        }
                    }
                }
            }
*/

            endRectangleSelected(canvasContainerElem) {
                return (canvasElem) => {
                    return (canvasElemPosition) => {
                        return (coordinate) => {
                            return (valAdjustRectangleSelectionSize) => {
                                canvasElem.addEventListener('mouseup', (e) => {
                                    canvasElem.removeEventListener('mousemove', valAdjustRectangleSelectionSize);
                                });
                                canvasElem.addEventListener('mouseout', (e) => {
                                    canvasElem.removeEventListener('mousemove', valAdjustRectangleSelectionSize);
                                });
                            }
                        }
                    }
                }
            }

/*
            endRectangleSelected(valAdjustRectangleSelectionSize) {
                return (canvasElem) => {
                    return (canvasElemPosition) => {
                        return (coordinate) => {
                            return (valAdjustRectangleSelectionSize) => {

                                const canvasBorderWidth = canvasContainerElem.style.borderWidth.slice(0, 2);
                                canvasElem.elemYCoordinate = canvasElemPosition.top + window.pageYOffset;
                                canvasElem.coordinate = coordinate;
                                canvasElem.canvasBorderWidth = canvasBorderWidth;
                                document.addEventListener('mouseup', (e) => {



                                    canvasElem.removeEventListener('mousemove', valAdjustRectangleSelectionSize(canvasElem.elemYCoordinate)(e.target.coordinate));
                                });
                            }
                        }
                    }
                }
            }
*/






            adjustRectangleSelectionSize(_this) {
                return (e) => {


                    var y = e.srcElement.pageYOffset;
                    console.log(pageYOffset);

                    e.target.xCurrentPoint = e.pageX - canvasElem.offsetLeft - canvasElem.canvasBorderWidth;
                    e.target.yCurrentPoint = e.pageY - canvasElem.offsetTop - canvasElem.elemYCoordinate;



                    _this.canvasContext.clearRect(0, 0, 10000, 10000);
                    _this.redraw();

                    _this.canvasContext.drawImage(_this.createRectangleByOffScreen(e), 0, 0);


//                    self.canvasContext.drawImage(self.createRectangleByOffScreen(elemYCoordinate)(coordinate), 0, 0);



                }
            }






/*
            adjustRectangleSelectionSize(self) {
                return (elemYCoordinate) => {
                    return (coordinate) => {
                        return (e) => {
                            coordinate.xCurrentPoint = e.pageX - canvasElem.offsetLeft - canvasElem.canvasBorderWidth;
                            coordinate.yCurrentPoint = e.pageY - canvasElem.offsetTop - canvasElem.elemYCoordinate;

                            console.log('startX: ' + coordinate.xStartingPoint);
                            console.log('startY: ' + coordinate.yStartingPoint);
                            console.log('currentX: ' + coordinate.xCurrentPoint);
                            console.log('currentY: ' + coordinate.yCurrentPoint);

                            self.canvasContext.drawImage(self.createRectangleByOffScreen(elemYCoordinate)(coordinate), 0, 0);

                        }
                    }
                }
            }
*/

            createRectangleByOffScreen(e) {

                console.log(e);

                this.offScreenCanvasContext.strokeRect(e.srcElement.xStartingPoint, e.srcElement.yStartingPoint, e.srcElement.xCurrentPoint - e.srcElement.xStartingPoint, e.srcElement.yCurrentPoint - e.srcElement.yStartingPoint + e.srcElement.containerScrollTop);
                return this.offScreenCanvasElem;

/*
                this.offScreenCanvasElem.width = 10000;
                this.offScreenCanvasElem.height = 10000;

                console.log('offScreenCanvas: ' + this.offScreenCanvasElem.width);
                console.log('offScreenCanvas: ' + this.offScreenCanvasElem.height);
*/

//                this.offScreenCanvasContext.strokeRect(xStartingPoint, yStartingPoint - this.elementYCoordinate, xCurrentPoint - xStartingPoint, yCurrentPoint - yStartingPoint);
            }


            get canvasElement() {
                return this._canvasElement;
            }

            set canvasElement(val) {
                this._canvasElement = val;
            }

            addObserver(obj) {
                this.observerList.push(obj);
            }

            redraw() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].setImg({img: this.observerList[i].imgElem, scale: this.observerList[i].imgScale});
                }
            }
        }
    })();

    const ClippedImg = (() => {
        return class {
            constructor(baseImgElem, imgElem, scaleObj, canvasObj, context) {
                const self = this;
                this._baseImgElem = baseImgElem;
                this._imgElem = imgElem;
                this._imgSize;
                this._imgScale;
                this._scaleObj = scaleObj;
                this._canvasContainerWidth = canvasObj.canvasContainerElem.clientWidth;

                this._canvasObj = canvasObj;





                this._canvasElem = canvasObj.canvasElem;




                this._canvasContext = canvasObj.canvasContext;
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
                console.log(this.canvasObj);
                this.canvasObj.canvasElem.setAttribute('width', this.imgSize.width * args.scale);
                this.canvasObj.canvasElem.setAttribute('height', this.imgSize.height * args.scale);
                this.canvasObj.offScreenCanvasElem.setAttribute('width', this.imgSize.width * args.scale);
                this.canvasObj.offScreenCanvasElem.setAttribute('height', this.imgSize.height * args.scale);

                this.imgScale = args.scale
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












            get canvasObj() {
                return this._canvasObj;
            }

            set canvasObj(val) {
                this._canvasObj = val;
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

            get imgScale() {
                return this._imgScale;
            }

            set imgScale(val) {
                this._imgScale = val;
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

    const canvasContainerElem = document.getElementById('canvas_container');
    canvasContainerElem.style.borderWidth = 30 + 'px';
    const canvasElem = document.getElementById('canvas');
    const offScreenCanvasElem = document.createElement('canvas');
    const baseImgElem = document.getElementById('base_image');
    const idImgElem = document.getElementById('id_image');
    const imgElem = new Image();
    const slideBarOfScalingElem = document.getElementById('slide_bar_of_scaling');

    const scale1 = new Scale(slideBarOfScalingElem);
    const preview1 = new Preview();
    const imgSelector1 = new ImgSelector(idImgElem);
    const canvas1 = new Canvas(canvasContainerElem, canvasElem, offScreenCanvasElem, '2d');
    const clippedImg1 = new ClippedImg(baseImgElem, imgElem, scale1, canvas1, '2d');

    scale1.addObserver(clippedImg1);
    preview1.addObserver(clippedImg1);
    imgSelector1.addObserver(clippedImg1);
    canvas1.addObserver(clippedImg1);

    //canvas1.drawRectangle();
})();