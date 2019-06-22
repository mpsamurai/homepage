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
/*
                this.coordinate.xStartingPoint;
                this.coordinate.yStartingPoint;
                this.coordinate.xCurrentPoint;
                this.coordinate.yCurrentPoint;
*/

                this.elementXCoordinate = this.canvasElemPosition.left + window.pageXOffset;
                this.elementYCoordinate = this.canvasElemPosition.top + window.pageYOffset;
                this.xStartingPoint;
                this.yStartingPoint;
                this.xCurrentPoint;
                this.yCurrentPoint;


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


/*
                document.addEventListener('mousedown', (e) => {
                    this.xStartingPoint = e.pageX - this.canvasElem.offsetLeft;
                    this.yStartingPoint = e.pageY - this.canvasElem.offsetTop;
                    console.log(this.xStartingPoint);
                    console.log(this.yStartingPoint);
                    document.addEventListener('mousemove', valAdjustRectangleSelectionSize);
                });
*/




            }

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


/*
                            console.log('startX: ' + coordinate.xStartingPoint);
                            console.log('startY: ' + coordinate.xStartingPoint);
                            console.log('currentX: ' + coordinate.xStartingPoint);
                            console.log('currentY: ' + coordinate.xStartingPoint);
*/

                            self.canvasContext.drawImage(self.createRectangleByOffScreen(elemYCoordinate)(coordinate), 0, 0);


/*
                        console.log(e);
                        console.log('***' + self);
                        console.log('***' + test1);
                        console.log('***' + test2);
*/
                        }
                    }






                }


/*
                self.xCurrentPoint = e.pageX - self.canvasElem.offsetLeft;
                self.yCurrentPoint = e.pageY - self.canvasElem.offsetTop;
*/







/*
                self.canvasContext.drawImage(self.createRectangleByOffScreen(self.xStartingPoint, self.yStartingPoint, self.xCurrentPoint, self.yCurrentPoint), 0, 0);
*/



/*
                _this.xCurrentPoint = e.pageX - _this.canvas.offsetLeft;
                _this.yCurrentPoint = e.pageY - _this.canvas.offsetTop;

                _this.xCurrentPoint = _this.judgeRectangleSelectionMaximumSizeOfX(_this.xCurrentPoint, _this.canvas.canvasWidth, _this.elementXCoordinate);
                _this.yCurrentPoint = _this.judgeRectangleSelectionMaximumSizeOfY(_this.yCurrentPoint, _this.canvas.canvasHeight + _this.elementYCoordinate, _this.elementYCoordinate);

                _this.canvas.setImage();
                _this.canvas.canvasContext.drawImage(_this.createRectangleByOffScreen(_this.xStartingPoint, _this.yStartingPoint, _this.xCurrentPoint, _this.yCurrentPoint), 0, 0);
*/
            }






            createRectangleByOffScreen(elemYCoordinate) {
                return (coordinate) => {

                    this.offScreenCanvasContext.fillRect(coordinate.xStartingPoint, coordinate.yStartingPoint, coordinate.xCurrentPoint - coordinate.xStartingPoint, coordinate.yCurrentPoint - coordinate.yStartingPoint);
                    return this.offScreenCanvasElem;
                }

/*
                this.offScreenCanvasElem.width = 10000;
                this.offScreenCanvasElem.height = 10000;

                console.log('offScreenCanvas: ' + this.offScreenCanvasElem.width);
                console.log('offScreenCanvas: ' + this.offScreenCanvasElem.height);
*/

//                this.offScreenCanvasContext.strokeRect(xStartingPoint, yStartingPoint - this.elementYCoordinate, xCurrentPoint - xStartingPoint, yCurrentPoint - yStartingPoint);
            }

            judgeRectangleSelectionMaximumSizeOfX(currentPoint, maximumSize, minimumSize) {
                if(currentPoint >= maximumSize) {
                    return maximumSize - 1;
                } else if(currentPoint <= minimumSize) {
                    return 1;
                } else {
                    return currentPoint;
                }
            }

            judgeRectangleSelectionMaximumSizeOfY(currentPoint, maximumSize, minimumSize) {
                if(currentPoint >= maximumSize) {
                    return maximumSize - 1;
                } else if(currentPoint <= this.elementYCoordinate) {
                    return this.elementYCoordinate + 1;
                } else {
                    return currentPoint;
                }
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

            notifyObserver() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    //this.observerList[i].canvasElem = this.canvasElem;
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