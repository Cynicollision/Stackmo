import { Key } from './enum';

export class Input {
    private static clickHandlers: ConcreteEventHandler<PointerInputEvent>[] = [];
    private static keyboardHandlers: { [code: number]: ConcreteEventHandler<KeyboardEvent> } = {};

    private static _activePointerEvent: PointerInputEvent = null;
    static get clickActive(): boolean {
        return !!Input._activePointerEvent;
    }

    static init() {

        let raisePointerEvent = (ev: PointerInputEvent) => {
            if (Input._activePointerEvent) {
                return;
            }

            Input._activePointerEvent = ev;

            if (Input.clickHandlers.length) {

                Input.clickHandlers.forEach((handler: ConcreteEventHandler<PointerInputEvent>) => {
                    if (handler.isAlive) {
                        handler.callback(ev);
                    }
                });
            }
        };

        let endPointerEvent = () => {
            Input._activePointerEvent = null;
        };

        // register mouse/touch input 
        document.body.onmousedown = function(this: any, ev: MouseEvent) {
            raisePointerEvent(PointerInputEvent.fromMouseEvent(ev));
        };
        document.body.ontouchstart = function (ev: TouchEvent) {
            document.body.onmousedown = null;
            raisePointerEvent(PointerInputEvent.fromTouchEvent(ev));
        };
        document.body.onmouseup = endPointerEvent;
        document.body.ontouchend = endPointerEvent;

        // register keyboard input
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

    static registerClickHandler(callback: (event: PointerInputEvent) => void): ConcreteEventHandler<PointerInputEvent> {
        let clickHandler = new ConcreteEventHandler<PointerInputEvent>(callback);;
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

export class PointerInputEvent {
    x: number;
    y: number;

    static fromMouseEvent(ev: MouseEvent): PointerInputEvent {
        console.log('CLICK at x = ' + ev.offsetX + ', y = ' + ev.offsetY);
        // console.log('ev.type = ' + ev.type);
        return { x: ev.offsetX, y: ev.offsetY };
    }

    static fromTouchEvent(ev: TouchEvent): PointerInputEvent {
        let touch = ev.touches[0];
        let x = touch ? touch.clientX : 0;
        let y = touch ? touch.clientY : 0;
        console.log('TOUCH at x = ' + x + ', y = ' + y);
        // console.log('ev.type = ' + ev.type);
        return { x: x, y: y};
    }
}