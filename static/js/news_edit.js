window.onload = function() {

};

(function() {
    'use strict';

    const menuElement = document.getElementsByClassName('menu');
    menuElement[0].style.position = 'static';

/*
    class Canvas {
        constructor(_canvasElement, _offScreenCanvasElement, _baseImageElement, context) {
            this.canvasElement = _canvasElement;
            this._canvasWidth;
            this._canvasHeight;
            this.offScreenCanvasElement = _offScreenCanvasElement;
            this.canvasContext = _canvasElement.getContext(context);
            this.offScreenCanvasContext = _offScreenCanvasElement.getContext(context);
        }

        set _canvasWidth(_canvasWidth) {
            this.canvasWidth = _canvasWidth;
        }

        get _canvasWidth() {
            return this.canvasWidth;
        }

        initialize() {
            const self = this;
            this.canvasImage.image = this.canvasImage.baseImageElement;
            this.canvasImage.setImage(this.canvasContext, this.canvasImage.image, self);
        }


        walk() {
            console.log(this.canvasWidth + 'が歩いてます');
        }







        setCanvasWidth(image) {
            this.canvasElement.setAttribute('width', image.width);
            this.offScreenCanvasElement.setAttribute('width', image.width);
        }

        setCanvasHeight(image) {
            this.canvasElement.setAttribute('height', image.height);
            this.offScreenCanvasElement.setAttribute('height', image.height);
        }
    }
*/


const Canvas = (() => {
   const private_ = {
      value: Symbol('value'),
      value: Symbol('canvasElement'),
   };


   return class {

        constructor(_canvasElement, _offScreenCanvasElement, _baseImageElement, context) {



            this[private_.value] = 'no value';
            this[private_.canvasElement] = _canvasElement;



/*
            this.canvasElement = _canvasElement;
*/
            this._canvasWidth;
            this._canvasHeight;
            this.offScreenCanvasElement = _offScreenCanvasElement;
            this.canvasContext = _canvasElement.getContext(context);
            this.offScreenCanvasContext = _offScreenCanvasElement.getContext(context);
        }



        set canvasElement(_canvasElement) {
            this[private_.canvasWidth] = _canvasWidth;
        }

        get _canvasWidth() {
            this[private_.canvasWidth];
        }



      get value() {
         return this[private_.value];
      }
      set value(x) {
         this[private_.value] = 'value: ' + x;
      }



        set _canvasWidth(_canvasWidth) {
            this.canvasWidth = _canvasWidth;
        }

        get _canvasWidth() {
            return this.canvasWidth;
        }

        initialize() {
            const self = this;
            this.canvasImage.image = this.canvasImage.baseImageElement;
            this.canvasImage.setImage(this.canvasContext, this.canvasImage.image, self);
        }

        walk() {
            console.log(this.canvasWidth + 'が歩いてます');
        }
   };
})();



    class CanvasImage {
        constructor(_image, _baseImageElement, _canvas) {
            const self = this;
            this.image = _image;
            this.baseImageElement = _baseImageElement;
            this.image.src = this.baseImageElement.src;
            this.canvas = _canvas;
            this.image.addEventListener('load', function() {
                self.initialize();
            });
        }

        initialize() {
            console.log(1234);
/*
            this.canvas.setCanvasWidth(this.image);
            this.canvas.setCanvasHeight(this.image);
*/
            this.setImage();
        }

        setImage() {
            this.canvas.canvasContext.drawImage(this.image, 0, 0);
        }
    }

    class ImageSelection {
        constructor(_idImageElement, _canvas) {
            const self = this;
            this.idImageElement = _idImageElement;
            this.canvas = _canvas;
            this.idImageElement.addEventListener("change", function(e){
                const reader = new FileReader();
                reader.onload = function (e) {
                    self.switchImage(e.target.result, self);
                }
                reader.readAsDataURL(e.target.files[0]);
            },false);
            console.log(self);
        }

        switchImage(data, self) {

            const image = new Image();

            image.onload = function() {
                self.canvas.canvasContext.clearRect(0, 0, image.width, image.height);
                self.canvas.canvasContext.drawImage(image, 0, 0);
            }
            image.src = data;
            console.log(this.canvas.width);











/*
            image.src = this.canvas.baseImageElement.src;
            this.canvas.canvasContext.drawImage(image, 0, 0);
*/


        }







/*
        selectedFile(input) {
            const self = this;
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = this.loadedFile.bind(null, self);
            reader.readAsDataURL(file);
        }

        loadedFile(_self, e) {
            const image = new Image();
            image.src = e.target.result;

            image.onload = () => {
                console.log(1);
                _self.canvas.canvasContext.clearRect(0, 0, _self.canvas.canvasWidth, _self.canvas.canvasHeight);


                _self.canvas.setImage(image);

                _self.canvas.canvasContext.drawImage(image, 0, 0);
            }
        }
*/

    }

    const canvasElement = document.getElementById('canvas');
    const offScreenCanvasElement = document.createElement('canvas');
    const baseImageElement = document.getElementById('base_image');
    const idImageElement = document.getElementById('id_image');
    const image = new Image();
    const canvas1 = new Canvas(canvasElement, offScreenCanvasElement, baseImageElement, '2d');
    const canvasImage1 = new CanvasImage(image, baseImageElement, canvas1);
    const imageSelection1 = new ImageSelection(idImageElement, canvas1);

canvas1.walk();

/*
    const rectangleSelection1 = new RectangleSelection(canvas1, '2d');
    rectangleSelection1.drawRectangle();

    const imageSelection1 = new ImageSelection(canvas1, idImageElement);


    imageSelection1.switchImage();
*/


/*
    class RectangleSelection {
        constructor(_canvas, context) {
            this.canvas = _canvas;
            this.canvasElementPosition = this.canvas.canvasElement.getBoundingClientRect();
            this.elementXCoordinate = this.canvasElementPosition.left + window.pageXOffset;
            this.elementYCoordinate = this.canvasElementPosition.top + window.pageYOffset;
            this.xStartingPoint;
            this.yStartingPoint;
            this.xCurrentPoint;
            this.yCurrentPoint;
        }

        drawRectangle() {
            const valAdjustRectangleSelectionSize = this.adjustRectangleSelectionSize.bind(null, this);
            this.startRectangleSelected(valAdjustRectangleSelectionSize);
            this.endRectangleSelected(valAdjustRectangleSelectionSize);
        }

        startRectangleSelected(valAdjustRectangleSelectionSize) {
            document.addEventListener('mousedown', (e) => {
                this.xStartingPoint = e.pageX - this.canvas.canvasElement.offsetLeft;
                this.yStartingPoint = e.pageY - this.canvas.canvasElement.offsetTop;
                document.addEventListener('mousemove', valAdjustRectangleSelectionSize);
            });
        }

        endRectangleSelected(valAdjustRectangleSelectionSize) {
            document.addEventListener('mouseup', (e) => {
                document.removeEventListener('mousemove', valAdjustRectangleSelectionSize);
            });
        }

        adjustRectangleSelectionSize(_this, e) {
            _this.xCurrentPoint = e.pageX - _this.canvas.canvasElement.offsetLeft;
            _this.yCurrentPoint = e.pageY - _this.canvas.canvasElement.offsetTop;

            _this.xCurrentPoint = _this.judgeRectangleSelectionMaximumSizeOfX(_this.xCurrentPoint, _this.canvas.canvasWidth, _this.elementXCoordinate);
            _this.yCurrentPoint = _this.judgeRectangleSelectionMaximumSizeOfY(_this.yCurrentPoint, _this.canvas.canvasHeight + _this.elementYCoordinate, _this.elementYCoordinate);

            _this.canvas.canvasContext.clearRect(0, 0, _this.canvas.canvasWidth, _this.canvas.canvasHeight);
            _this.canvas.offScreenCanvasContext.clearRect(0, 0, _this.canvas.canvasWidth, _this.canvas.canvasHeight);
            _this.canvas.setImage();
            _this.canvas.canvasContext.drawImage(_this.createRectangleByOffScreen(_this.xStartingPoint, _this.yStartingPoint, _this.xCurrentPoint, _this.yCurrentPoint), 0, 0);
        }

        createRectangleByOffScreen(xStartingPoint, yStartingPoint, xCurrentPoint, yCurrentPoint) {
            this.canvas.offScreenCanvasContext.strokeRect(xStartingPoint, yStartingPoint - this.elementYCoordinate, xCurrentPoint - xStartingPoint, yCurrentPoint - yStartingPoint);
            return this.canvas.offScreenCanvasElement;
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
    }

    class ImageSelection {
        constructor(_canvas, _idImageElement) {
            this.canvas = _canvas;
            this.idImageElement = _idImageElement;
        }

        switchImage() {
            const image = new Image();
            const self = this;
            image.src = this.canvas.baseImageElement.src;
            this.canvas.canvasContext.drawImage(image, 0, 0);

            this.idImageElement.addEventListener("change", function(e){

                self.selectedFile(this);
            },false);
        }

        selectedFile(input) {
            const self = this;
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = this.loadedFile.bind(null, self);
            reader.readAsDataURL(file);
        }

        loadedFile(_self, e) {
            const image = new Image();
            image.src = e.target.result;

            image.onload = () => {
                console.log(1);
                _self.canvas.canvasContext.clearRect(0, 0, _self.canvas.canvasWidth, _self.canvas.canvasHeight);


                _self.canvas.setImage(image);

                _self.canvas.canvasContext.drawImage(image, 0, 0);


            }
        }





        switchImage() {

            const image = new Image();
            const self = this;
            image.src = this.canvas.baseImageElement.src;

            this.canvas.canvasContext.drawImage(image, 0, 0);

            this.idImageElement.addEventListener("change", function(e){
                self.selectedFile(self);
            },false);


            const image = new Image();
            const self = this;
            image.src = this.canvas.baseImageElement.src;
            console.log(image.src);

            this.ctx.drawImage(img, 0, 0);

            this.changeImageBtn.addEventListener("change", function(e){
                self.onFileSelected(this);
            },false);
        }

        selectedFile(input) {
            const self = this;

            console.log(input.files);
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = this.loadedFile.bind(null, self);
            reader.readAsDataURL(file);
        }

        loadedFile(_self, e) {
            const img = new Image();

            img.onload = () => {
                _self.baseCanvas.setAttribute('width', img.naturalWidth);
                _self.baseCanvas.setAttribute('height', img.naturalHeight);
                document.getElementById('base_canvas').getContext('2d').drawImage(img, 0, 0);
            }
            img.src = e.target.result;
            console.log(img.naturalHeight);
        }

    }
*/

    class Notification {

    }



/*
    imageSelection1.switchImage();
*/


})();