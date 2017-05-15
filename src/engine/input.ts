export interface ClickEvent {
    button: number;
    x: number;
    y: number;
}

export class InputHandler {

    constructor(private canvasElement: HTMLCanvasElement) {
    }

    onMouseDown(callback: (event: ClickEvent) => void): void {
        this.canvasElement.onmousedown = <any>((ev: MouseEvent) => {
            callback({ button: ev.button, x: ev.pageX, y: ev.pageY });
        });
    }
}
