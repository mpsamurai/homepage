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

            const offscreen = document.createElement('canvas');
            offscreen.width = canvas.width;
            offscreen.height = canvas.height;
            const offscreenCtx = offscreen.getContext('2d');
            offscreenCtx.fillRect(0, 0, 30, 30);

            return offscreen;

        }

        drawRectangle() {
            const $canvas = document.getElementById('canvas');
            const ctx = $canvas.getContext('2d');
            ctx.drawImage(this.createRectangleByOffScreen(), 0, 0);
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