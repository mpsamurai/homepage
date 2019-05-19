(function() {
    'use strict';

    const menuElement = document.getElementsByClassName('menu');
    console.log(menuElement[0]);
    menuElement[0].style.position = 'static';

    class Canvas {
        constructor(_canvasElement, _offScreenCanvasElement) {
            this.canvasElement = _canvasElement;
            this.offScreenCanvasElement = _offScreenCanvasElement;
        }
    }

    class RectangleSelection {
        constructor(_canvas, context) {
            this.canvas = _canvas;
            this.canvasContext = _canvas.canvasElement.getContext(context);
            this.offScreenCanvasContext = _canvas.offScreenCanvasElement.getContext(context);
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

            _this.canvasContext.clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
            _this.offScreenCanvasContext.clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
            _this.canvasContext.drawImage(_this.createRectangleByOffScreen(_this.xStartingPoint, _this.yStartingPoint, _this.xCurrentPoint, _this.yCurrentPoint), 0, 0);
        }

        createRectangleByOffScreen(xStartingPoint, yStartingPoint, xCurrentPoint, yCurrentPoint) {
            this.offScreenCanvasContext.strokeRect(xStartingPoint, yStartingPoint - this.elementYCoordinate, xCurrentPoint - xStartingPoint, yCurrentPoint - yStartingPoint);
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

    class Image {

    }

    class ImageSelection {

    }


    class Notification {

    }

    const canvasElement = document.getElementById('canvas');
    const offScreenCanvasElement = document.createElement('canvas');

    const canvas1 = new Canvas(canvasElement, offScreenCanvasElement);

    const rectangleSelection1 = new RectangleSelection(canvas1, '2d');
    rectangleSelection1.drawRectangle();



})();