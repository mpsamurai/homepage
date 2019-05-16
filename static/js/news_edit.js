(function() {
    'use strict';

    class Canvas {
        constructor(_$canvas, _context) {
            this.$canvas = _$canvas;
            this.context = this.$canvas.getContext(_context);
        }
    }

    class RectangleSelection {
        constructor(_canvas) {
            this.canvas = _canvas;
            this.xStartingPoint;
            this.yStartingPoint;
            this.xEndPoint;
            this.yEndPoint;
        }

        createRectangleByOffScreen() {
            const offScreen = document.createElement('canvas');
            offScreen.width = canvas.width;
            offScreen.height = canvas.height;
            const offScreenContext = offScreen.getContext('2d');
            offScreenContext.fillRect(0, 0, 30, 30);
            return offScreen;
        }

        drawRectangle() {
            const $canvas = document.getElementById('canvas');
            const context = $canvas.getContext('2d');
            this.startRectangleSelected();
            this.endRectangleSelected();
            context.drawImage(this.createRectangleByOffScreen(), 0, 0);
        }

        startRectangleSelected(canvas, func) {
            document.addEventListener('mousedown', () => {
                console.log(1234);
                document.addEventListener('mousemove', this.moveRectangleSelected);
            });
        }

        endRectangleSelected(canvas, func) {
            document.addEventListener('mouseup', () => {
                console.log(1234);
                document.removeEventListener('mousemove', this.moveRectangleSelected);
            });
        }

        moveRectangleSelected(canvas) {
            console.log(1234);
        }

        removeRectangleSelected(canvas, func) {
            console.log('remove');
            document.removeEventListener('mousemove', this.moveRectangleSelected);
        }










/*
        createCanvasForDrawing() {
            var mycanvas = document.createElement('canvas');
            var mycontext = mycanvas.getContext('2d');

            mycontext.fillRect(20, 20, 80, 40);

            console.log(this.canvas.context);
            this.selectImageRectangle();
        }

        selectImageRectangle() {
            this.canvas.context.fillRect(20, 20, 80, 40);
        }
*/












/*
        selectImageRectangle() {

            const keyMove = (_self) => {
                document.addEventListener("mousemove", (e) => {
                    console.log(1234);
                });
            }

            const removeHandler = () => {
                document.removeEventListener("mousemove", keyMove);
            }

            document.addEventListener("mousedown", (e) => {
                this.xStartingPoint = e.clientX - canvas.offsetLeft;
                this.yStartingPoint = e.clientY - canvas.offsetTop;
                keyMove(this);
            });

            document.addEventListener("mousemove", (e) => {
                this.xStartingPoint = e.clientX - canvas.offsetLeft;
                this.yStartingPoint = e.clientY - canvas.offsetTop;
            });

            document.addEventListener("mouseup", (e) => {
                this.xStartingPoint = e.clientX - canvas.offsetLeft;
                this.yStartingPoint = e.clientY - canvas.offsetTop;
                removeHandler();
            });
        }
*/

    }

    class Image {

    }

    class ImageSelection {

    }


    class Notification {

    }

    const $canvas = document.getElementById('canvas');
    const canvas1 = new Canvas($canvas, '2d');

    const rectangleSelection1 = new RectangleSelection(canvas1);
    rectangleSelection1.drawRectangle();



})();