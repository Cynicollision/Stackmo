import { Key } from './enum';

export class EventHandler {
    isAlive: boolean = true;

    constructor(private id: number, public callback: Function) {
    }
    
    dispose() {
        this.isAlive = false;
    }
}

export class Input {
    private static clickHandlers: EventHandler[] = [];
    private static keyboardHandlers: { [code: number]: EventHandler } = {};

    private static nextEventID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();

    static init() {

        document.body.onclick = function(this: any, ev: MouseEvent) {

            if (Input.clickHandlers.length) {

                Input.clickHandlers.forEach((handler: EventHandler) => {
                    
                    if (handler.isAlive) {
                        handler.callback(ev.clientX, ev.clientY);
                    }
                });
            }
        };

        document.body.onkeydown = (event: KeyboardEvent) => {
            let handler: EventHandler = this.keyboardHandlers[event.keyCode || event.code];

            if (!handler) {
                handler = this.keyboardHandlers[Key.Any];
            }

            if (handler && handler.isAlive) {
                handler.callback();
            }
        };
    }

    static registerClickHandler(callback: Function): EventHandler {
        let eventID = Input.nextEventID()
        let clickHandler = new EventHandler(eventID, callback);;

        Input.clickHandlers.push(clickHandler);

        return clickHandler;
    }

    static registerKeyHandler(key: Key, callback: Function): EventHandler {
        let eventID = Input.nextEventID();
        let keyHandler = new EventHandler(eventID, callback);

        Input.keyboardHandlers[key] = keyHandler
        
        return keyHandler;
    }
}