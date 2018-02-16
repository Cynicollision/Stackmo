import { Key } from './enum';

export class Input {
    private static clickHandlers: ConcreteEventHandler<PointerInputEvent>[] = [];
    private static keyboardHandlers: { [code: number]: ConcreteEventHandler<KeyboardEvent> } = {};
    private static keyboardActivity: { [code: number]: boolean } = {};

    private static _activePointerEvent: PointerInputEvent = null;
    static get clickActive(): boolean {
        return !!Input._activePointerEvent;
    }

    static get activePointerEvent(): PointerInputEvent {
        return Input._activePointerEvent;
    }
    
    static init() {

        function trackActiveMousePosition(this: any, ev: MouseEvent) {
            Input._activePointerEvent.currentX = getMouseEventX(ev);
            Input._activePointerEvent.currentY = getMouseEventY(ev);
        };

        function trackActiveTouchPosition(ev: TouchEvent) {
            document.body.onmousemove = null;
            Input._activePointerEvent.currentX = getTouchEventX(ev);
            Input._activePointerEvent.currentY = getTouchEventY(ev);
        };

        let raisePointerEvent = (ev: PointerInputEvent) => {
            if (Input._activePointerEvent) {
                return;
            }

            Input._activePointerEvent = ev;
            document.body.onmousemove =  trackActiveMousePosition;
            document.body.ontouchmove = trackActiveTouchPosition;

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
            document.body.onmousemove = null;
            document.body.ontouchmove = null;
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
            let keyCode = ev.keyCode || ev.code
            let handler: ConcreteEventHandler<KeyboardEvent> = this.keyboardHandlers[keyCode];

            if (handler && handler.isAlive && !this.keyboardActivity[keyCode]) {
                this.keyboardActivity[keyCode] = true;
                handler.callback(ev);
            }

            let globalHandler = this.keyboardHandlers[Key.Any];
            if (globalHandler && globalHandler.isAlive && !this.keyboardActivity[Key.Any])           {
                this.keyboardActivity[Key.Any] = true;
                globalHandler.callback(ev);
            }
        };
        document.body.onkeyup = (ev: KeyboardEvent) => {
            let keyCode = ev.keyCode || ev.code
            let handler: ConcreteEventHandler<KeyboardEvent> = this.keyboardHandlers[keyCode];
            this.keyboardActivity[Key.Any] = false;

            if (handler && handler.isAlive) {
                this.keyboardActivity[keyCode] = false;
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

    static keyDown(key: Key): boolean {
        return !!this.keyboardActivity[key];
    }
}

export interface EventHandler {
    callback: (event: any) => void;
    dispose: () => void;
}

export class ConcreteEventHandler<T> implements EventHandler {
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

    currentX: number;
    currentY: number;

    static fromMouseEvent(ev: MouseEvent): PointerInputEvent {
        let x = getMouseEventX(ev);
        let y = getMouseEventY(ev);
        return { x: x, y: y, currentX: x, currentY: y };
    }

    static fromTouchEvent(ev: TouchEvent): PointerInputEvent {
        let x = getTouchEventX(ev);
        let y = getTouchEventY(ev);
        return { x: x, y: y, currentX: x, currentY: y };
    }
}

function getMouseEventX(ev: MouseEvent): number {
    return ev.offsetX;
}

function getMouseEventY(ev: MouseEvent): number {
    return ev.offsetY;
}

function getTouchEventX(ev: TouchEvent): number {
    let touch = ev.touches[0];
    return touch ? touch.clientX : 0
}

function getTouchEventY(ev: TouchEvent): number {
    let touch = ev.touches[0];
    return touch ? touch.clientY : 0
}