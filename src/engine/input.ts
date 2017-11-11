import { Key } from './enum';

export class Input {
    private static clickHandlers: ConcreteEventHandler<MouseEvent>[] = [];
    private static keyboardHandlers: { [code: number]: ConcreteEventHandler<KeyboardEvent> } = {};

    private static _clickActive: boolean = false;
    static get clickActive(): boolean {
        return Input._clickActive;
    }

    static init() {

        let handleClick = function(this: any, ev: MouseEvent) {
            Input._clickActive = true;

            if (Input.clickHandlers.length) {

                Input.clickHandlers.forEach((handler: ConcreteEventHandler<MouseEvent>) => {
                    
                    if (handler.isAlive) {
                        handler.callback(ev);
                    }
                });
            }
        };

        let handleClickEnd = function () {
            Input._clickActive = false;
        };

        document.body.onmousedown = handleClick;
        document.body.onmouseup = handleClickEnd;
        document.body.ontouchend = handleClickEnd;

        document.body.onkeydown = (ev: KeyboardEvent) => {
            let handler: ConcreteEventHandler<KeyboardEvent> = this.keyboardHandlers[ev.keyCode || ev.code];

            if (!handler) {
                handler = this.keyboardHandlers[Key.Any];
            }

            if (handler && handler.isAlive) {
                handler.callback(ev);
            }
        };
    }

    static registerClickHandler(callback: (event: MouseEvent) => void): ConcreteEventHandler<MouseEvent> {
        let clickHandler = new ConcreteEventHandler<MouseEvent>(callback);;
        Input.clickHandlers.push(clickHandler);

        return clickHandler;
    }

    static registerKeyHandler(key: Key, callback: (event: KeyboardEvent) => void): ConcreteEventHandler<KeyboardEvent> {
        let keyHandler = new ConcreteEventHandler<KeyboardEvent>(callback);
        Input.keyboardHandlers[key] = keyHandler
        
        return keyHandler;
    }
}

export interface EventHandler {
    callback: (event: any) => void;
    dispose: () => void;
}

class ConcreteEventHandler<T> implements EventHandler {
    isAlive: boolean = true;

    constructor(public callback: (event: T) => void) {
    }
    
    dispose() {
        this.isAlive = false;
    }
}
