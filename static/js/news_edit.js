(function() {
    'use strict';

    const menuElement = document.getElementsByClassName('menu');
    console.log(menuElement[0]);
    menuElement[0].style.position = 'static';

    class Canvas {
        constructor(_canvasElement, _offScreenCanvasElement, _baseImageElement, context) {
            this.canvasElement = _canvasElement;
            this.offScreenCanvasElement = _offScreenCanvasElement;
            this.canvasContext = _canvasElement.getContext(context);
            this.offScreenCanvasContext = _offScreenCanvasElement.getContext(context);
            this.baseImageElement = _baseImageElement;
        }

        drawImage() {
            const image = new Image();

            image.onload = function() {
                const width = image.naturalWidth;
                const height = image.naturalHeight;
            }

            image.src = this.baseImageElement.src;

            this.canvasElement.setAttribute('width', image.width);
            this.canvasElement.setAttribute('height', image.height);
            this.offScreenCanvasElement.setAttribute('width', image.width);
            this.offScreenCanvasElement.setAttribute('height', image.height);

            this.canvasContext.drawImage(image, 0, 0);
        }
    }

    class RectangleSelection {
        constructor(_canvas, context) {
            this.canvas = _canvas;
            this.canvasElementPosition = this.canvas.canvasElement.getBoundingClientRect();
            this.elementXCoordinate = this.canvasElementPosition.left + window.pageXOffset;
            this.elementYCoordinate = this.canvasElementPosition.top + window.pageYOffset;
            this.canvasWidth = _canvas.canvasElement.clientWidth;
            this.canvasHeight = _canvas.canvasElement.clientHeight;
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

            _this.xCurrentPoint = _this.judgeRectangleSelectionMaximumSizeOfX(_this.xCurrentPoint, _this.canvasWidth, _this.elementXCoordinate);
            _this.yCurrentPoint = _this.judgeRectangleSelectionMaximumSizeOfY(_this.yCurrentPoint, _this.canvasHeight + _this.elementYCoordinate, _this.elementYCoordinate);

            _this.canvas.canvasContext.clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
            _this.canvas.offScreenCanvasContext.clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
            _this.canvas.drawImage();
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

    }

    class Notification {

    }

    const canvasElement = document.getElementById('canvas');
    const offScreenCanvasElement = document.createElement('canvas');
    const baseImageElement = document.getElementById('base_image');
    const canvas1 = new Canvas(canvasElement, offScreenCanvasElement, baseImageElement, '2d');
    canvas1.drawImage();

    const rectangleSelection1 = new RectangleSelection(canvas1, '2d');
    rectangleSelection1.drawRectangle();

})();