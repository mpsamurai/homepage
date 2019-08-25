(() => {
    'use strict';

    const menuElem = document.getElementsByClassName('menu');
    menuElem[0].style.position = 'static';

    const ImgSelector = (() => {
        return class {
            constructor(idImgElem) {
                const self = this;
                this._observerList = [];
                this._idImgElem = idImgElem;
                this._idImgElem.addEventListener('change', (e) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        self.switchImg(e.target.result, self);
                    }
                    reader.readAsDataURL(e.target.files[0]);
                }, false);
            }

            get observerList() {
                return this._observerList;
            }

            set observerList(val) {
                this._observerList = val;
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

            switchImg(data, _this) {
                const img = new Image();
                img.onload = () => {
                    for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                        _this.observerList[i].imgElem = img;
                        _this.observerList[i].scaleObj.slideBarOfScalingElem.value = 1;
                        _this.observerList[i].init({img: img, scale: 1});
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
                this._observerList = [];
                this._slideBarOfScalingElem = slideBarOfScalingElem;
                this._slideBarOfScalingElem.scale;
                this._slideBarOfScalingElem.min = 0.01;
                this._slideBarOfScalingElem.max = 2;
                this._slideBarOfScalingElem.step = 'any';

                this._slideBarOfScalingElem.addEventListener('input', (e) => {
                    self.scaleImg({scale: self.slideBarOfScalingElem.scale * (1 * e.target.value), obj: self});
                }, false);
            }

            get observerList() {
                return this._observerList;
            }

            set observerList(val) {
                this._observerList = val;
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
            constructor(trimCanvasElem, clippedImgCoordinate, context) {
                const self = this;
                this._observerList = [];
                this._trimCanvasElem = trimCanvasElem;
                this._clippedImgCoordinate = clippedImgCoordinate;
                this._trimCanvasContext = trimCanvasElem.getContext(context);
            }

            get observerList() {
                return this._observerList;
            }

            set observerList(val) {
                this._observerList = val;
            }

            get trimCanvasElem() {
                return this._trimCanvasElem;
            }

            set trimCanvasElem(val) {
                this._trimCanvasElem = val;
            }

            get clippedImgCoordinate() {
                return this._clippedImgCoordinate;
            }

            set clippedImgCoordinate(val) {
                this._clippedImgCoordinate = val;
            }

            get trimCanvasContext() {
                return this._trimCanvasContext;
            }

            set trimCanvasContext(val) {
                this._trimCanvasContext = val;
            }

            addObserver(obj) {
                this.observerList.push(obj);
            }

            notifyObserver() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].update('preview');
                }
            }

            previewImg(clippedImgObj)  {
                return (img) => {
                    return (coordinate) => {
                        return (scale) => {
                            const size = this.setImgClippingInfo(clippedImgObj)(coordinate)(scale);
                            this.displayPreview(this.setSizeOfPreview)(img)(size);
                            return size;
                        }
                    }
                }
            }

            setImgClippingInfo(clippedImgObj) {
                return (coordinate) => {
                    return (scale) => {
                        const xStartingPoint = Math.min(coordinate.xStartingPoint / scale, coordinate.xEndPoint / scale);
                        const xEndPoint = Math.max(coordinate.xStartingPoint / scale, coordinate.xEndPoint / scale);
                        const yStartingPoint = Math.min(coordinate.yStartingPoint / scale, coordinate.yEndPoint / scale);
                        const yEndPoint = Math.max(coordinate.yStartingPoint / scale, coordinate.yEndPoint / scale);

                        const width = xEndPoint - xStartingPoint;
                        const height = yEndPoint - yStartingPoint;

                        clippedImgObj.croppedImgInfo = {"x": xStartingPoint, "y": yStartingPoint, "w": width, "h": height}

                        return clippedImgObj.croppedImgInfo;
                    }
                }
            }

            displayPreview(func) {
                return (img) => {
                    return (size) => {
                        func(this.trimCanvasElem)(size);
                        this.trimCanvasContext.drawImage(
                            img,
                            size.x,
                            size.y,
                            size.w,
                            size.h,
                            0,
                            0,
                            size.w,
                            size.h,
                        );
                    }
                }
            }

            setSizeOfPreview(trimCanvasElem) {
                return (size) => {
                    trimCanvasElem.setAttribute('width', size.w);
                    trimCanvasElem.setAttribute('height', size.h);
                }
            }

            judgeWhereStartPointIs(xStartingPoint) {
                return (xEndPoint) => {
                    return (yStartingPoint) => {
                        return (yEndPoint) => {
                            return (scale) => {
                                if(xStartingPoint <= xEndPoint && yStartingPoint <= yEndPoint) {
                                    this.setSizeOfPreview(xEndPoint - xStartingPoint)(yEndPoint - yStartingPoint)(scale);
                                    return {x: xStartingPoint, y: yStartingPoint};
                                } else if(xStartingPoint <= xEndPoint && yStartingPoint >= yEndPoint) {
                                    this.setSizeOfPreview(xEndPoint - xStartingPoint)(yStartingPoint - yEndPoint)(scale);
                                    return {x: xStartingPoint, y: yEndPoint};
                                } else if(xStartingPoint >= xEndPoint && yStartingPoint <= yEndPoint) {
                                    this.setSizeOfPreview(xEndPoint - xStartingPoint)(yStartingPoint - yEndPoint)(scale);
                                    return {x: xEndPoint, y: yStartingPoint};
                                } else if(xStartingPoint >= xEndPoint && yStartingPoint >= yEndPoint) {
                                    this.setSizeOfPreview(xEndPoint - xStartingPoint)(yStartingPoint - yEndPoint)(scale);
                                    return {x: xEndPoint, y: yEndPoint};
                                }
                            }
                        }
                    }
                }
            }
        }
    })();

    const Canvas = (() => {
        return class {
            constructor(canvasContainerElem, canvasElem, offScreenCanvasElem, context) {
                const self = this;
                this._observerList = [];
                this._canvasContainerElem = canvasContainerElem;
                this._canvasElem = canvasElem;
                this._offScreenCanvasElem = offScreenCanvasElem;
                this._canvasContext = this.canvasElem.getContext(context);
                this._offScreenCanvasContext = this.offScreenCanvasElem.getContext(context);
                this._canvasElemPosition = this.canvasElem.getBoundingClientRect();
                this._coordinate = {};

                this.drawRectangle(this.canvasContainerElem)(this.canvasElem)(this.offScreenCanvasElem)(this.canvasElemPosition);

            }

            get observerList() {
                return this._observerList;
            }

            set observerList(val) {
                this._observerList = val;
            }

            get canvasContainerElem() {
                return this._canvasContainerElem;
            }

            set canvasContainerElem(val) {
                this._canvasContainerElem = val;
            }

            get canvasElem() {
                return this._canvasElem;
            }

            set canvasElem(val) {
                this._canvasElem = val;
            }

            get offScreenCanvasElem() {
                return this._offScreenCanvasElem;
            }

            set offScreenCanvasElem(val) {
                this._offScreenCanvasElem = val;
            }

            get canvasContext() {
                return this._canvasContext;
            }

            set canvasContext(val) {
                this._canvasContext = val;
            }

            get offScreenCanvasContext() {
                return this._offScreenCanvasContext;
            }

            set offScreenCanvasContext(val) {
                this._offScreenCanvasContext = val;
            }

            get canvasElemPosition() {
                return this._canvasElemPosition;
            }

            set canvasElemPosition(val) {
                this._canvasElemPosition = val;
            }

            get canvasElement() {
                return this._canvasElement;
            }

            set canvasElement(val) {
                this._canvasElement = val;
            }

            get coordinate() {
                return this._coordinate;
            }

            set coordinate(val) {
                this._coordinate = val;
            }

            drawRectangle(canvasContainerElem) {
                return (canvasElem) => {
                    return (offScreenCanvasElem) => {
                        return (canvasElemPosition) => {
                            const valAdjustRectangleSelectionSize = this.adjustRectangleSelectionSize.bind(null)(this);
                            this.startRectangleSelected(canvasContainerElem)(canvasElem)(canvasElemPosition)(valAdjustRectangleSelectionSize);
                        }
                    }
                }
            }

            startRectangleSelected(canvasContainerElem) {
                return (canvasElem) => {
                    return (canvasElemPosition) => {
                        return (valAdjustRectangleSelectionSize) => {
                            const canvasBorderWidth = canvasContainerElem.style.borderWidth.slice(0, 2);
                            canvasElem.elemYCoordinate = canvasElemPosition.top + window.pageYOffset;
                            canvasElem.canvasBorderWidth = canvasBorderWidth;
                            canvasElem.xStartingPoint;
                            canvasElem.yStartingPoint;
                            canvasElem.addEventListener('mousedown', (e) => {

                                e.target.xStartingPoint = e.pageX - canvasElem.offsetLeft - canvasElem.canvasBorderWidth + canvasContainerElem.scrollLeft;
                                e.target.yStartingPoint = e.pageY - canvasElem.offsetTop - canvasElem.elemYCoordinate + canvasContainerElem.scrollTop;
                                e.target.containerScrollTop = canvasContainerElem.scrollTop;
                                e.target.containerScrollLeft = canvasContainerElem.scrollLeft;

                                canvasElem.addEventListener('mousemove', valAdjustRectangleSelectionSize);

                                canvasElem.addEventListener('mouseup', (e) => {
                                    canvasElem.removeEventListener('mousemove', valAdjustRectangleSelectionSize);
                                    this.notifyRectangleSelectionComplete(this.coordinate);

                                });

                                canvasElem.addEventListener('mouseout', (e) => {
                                    canvasElem.removeEventListener('mousemove', valAdjustRectangleSelectionSize);
                                    this.notifyRectangleSelectionComplete(this.coordinate);
                                });
                            });
                        }
                    }
                }
            }

            adjustRectangleSelectionSize(_this) {
                return (e) => {
                    e.target.xEndPoint = e.pageX - canvasElem.offsetLeft - canvasElem.canvasBorderWidth + canvasContainerElem.scrollLeft;
                    e.target.yEndPoint = e.pageY - canvasElem.offsetTop - canvasElem.elemYCoordinate + canvasContainerElem.scrollTop;

                    _this.canvasContext.clearRect(0, 0, canvasElem.width, canvasElem.height);
                    _this.redraw();
                    _this.canvasContext.drawImage(_this.createRectangleByOffScreen(e), 0, 0);
                }
            }

            createRectangleByOffScreen(e) {

                const xStartingPoint = e.srcElement.xStartingPoint;
                const yStartingPoint = e.srcElement.yStartingPoint;
                const xCurrentPoint = e.srcElement.xEndPoint - xStartingPoint;
                const yCurrentPoint = e.srcElement.yEndPoint - yStartingPoint;

                this.offScreenCanvasContext.strokeRect(
                    xStartingPoint,
                    yStartingPoint,
                    xCurrentPoint,
                    yCurrentPoint
                );

                this.coordinate = {
                    xStartingPoint: e.srcElement.xStartingPoint,
                    yStartingPoint: e.srcElement.yStartingPoint,
                    xEndPoint: e.srcElement.xEndPoint,
                    yEndPoint: e.srcElement.yEndPoint,
                    xScrollPoint: e.srcElement.containerScrollLeft,
                    yScrollPoint: e.srcElement.containerScrollTop
                }

                return this.offScreenCanvasElem;
            }

            addObserver(obj) {
                this.observerList.push(obj);
            }

            redraw() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].setImg({img: this.observerList[i].imgElem, scale: this.observerList[i].imgScale});
                }
            }

            notifyRectangleSelectionComplete(coordinate) {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].makePreviewObjPreview(coordinate);
                }
            }
        }
    })();

    const ClippedImg = (() => {
        return class {
            constructor(baseImgElem, imgElem, scaleObj, canvasObj, clippedImgCoordinate, context) {
                const self = this;
                this._observerList = [];
                this._baseImgElem = baseImgElem;
                this._imgElem = imgElem;
                this._imgSize;
                this._croppedImgInfo = {};
                this._imgScale;
                this._scaleObj = scaleObj;
                this._canvasContainerWidth = canvasObj.canvasContainerElem.clientWidth;
                this._canvasObj = canvasObj;
                this._canvasElem = canvasObj.canvasElem;
                this._clippedImgCoordinate = clippedImgCoordinate;
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
                this.canvasObj.canvasElem.setAttribute('width', this.imgSize.width * args.scale);
                this.canvasObj.canvasElem.setAttribute('height', this.imgSize.height * args.scale);
                this.canvasObj.offScreenCanvasElem.setAttribute('width', this.imgSize.width * args.scale);
                this.canvasObj.offScreenCanvasElem.setAttribute('height', this.imgSize.height * args.scale);
                this.imgScale = args.scale
                this.canvasContext.scale(args.scale, args.scale);
                this.canvasContext.drawImage(args.img, 0, 0);
                this.canvasContext.scale(1 / args.scale, 1 / args.scale);
            }

            get observerList() {
                return this._observerList;
            }

            set observerList(val) {
                this._observerList = val;
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

            get croppedImgInfo() {
                return this._croppedImgInfo;
            }

            set croppedImgInfo(val) {
                this._croppedImgInfo = val;
            }

            get imgScale() {
                return this._imgScale;
            }

            set imgScale(val) {
                this._imgScale = val;
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

            get clippedImgCoordinate() {
                return this._clippedImgCoordinate;
            }

            set clippedImgCoordinate(val) {
                this._clippedImgCoordinate = val;
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

            addObserver(obj) {
                this.observerList.push(obj);
            }

            makePreviewObjPreview(coordinate) {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    //this.observerList[i].previewImg(this.imgElem, coordinate, this.imgScale);
                    this.croppedImgInfo = this.observerList[i].previewImg(this)(this.imgElem)(coordinate)(this.imgScale);
                    this.setImgCroppingDataForm(this.croppedImgInfo);
                }
            }

            setImgCroppingDataForm(croppedImgInfo) {
                this.clippedImgCoordinate.value = JSON.stringify(this.croppedImgInfo);
            }
        }
    })();

    const canvasContainerElem = document.getElementById('canvas_container');
    canvasContainerElem.style.borderWidth = 30 + 'px';
    const canvasElem = document.getElementById('canvas');
    const offScreenCanvasElem = document.createElement('canvas');
    const trimCanvasElem = document.getElementById('trimming_canvas');
    const baseImgElem = document.getElementById('base_image');
    const idImgElem = document.getElementById('id_image');
    const clippedImgCoordinate = document.getElementById('coordinate');
    const imgElem = new Image();
    const slideBarOfScalingElem = document.getElementById('slide_bar_of_scaling');

    const scale1 = new Scale(slideBarOfScalingElem);
    const preview1 = new Preview(trimCanvasElem, clippedImgCoordinate, '2d');
    const imgSelector1 = new ImgSelector(idImgElem);
    const canvas1 = new Canvas(canvasContainerElem, canvasElem, offScreenCanvasElem, '2d');
    const clippedImg1 = new ClippedImg(baseImgElem, imgElem, scale1, canvas1, clippedImgCoordinate, '2d');

    scale1.addObserver(clippedImg1);
    imgSelector1.addObserver(clippedImg1);
    canvas1.addObserver(clippedImg1);
    clippedImg1.addObserver(preview1);
})();