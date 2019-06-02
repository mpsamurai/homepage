window.onload = function() {

};

(() => {
    'use strict';

    const menuElement = document.getElementsByClassName('menu');
    menuElement[0].style.position = 'static';

    const Subject = (() => {
        return class {
            constructor() {
                this.observerList = [];
            }

            addObserver(obj) {
                this.observerList.push(obj);
                console.log(this.observerList);
            }

            notifyObserver() {
                for (let i = 0, len = this.observerList.length; i < len; i++ ) {
                    this.observerList[i].update();
                }
            }
        }
    })();

    const Observer = (() => {
        return class {
            constructor() {
                console.log('observer');
            }

            update() {
                console.log('update');
            }
        }
    })();

    const subject1 = new Subject();
    const observer1 = new Observer();
    subject1.addObserver(observer1);
    const observer2 = new Observer();
    subject1.addObserver(observer2);
    subject1.addObserver(observer2);
    subject1.notifyObserver(observer2);


})();