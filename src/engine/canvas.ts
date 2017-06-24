import { Room } from './room';
import { Sprite } from './sprite';

export interface CanvasOptions {
    height?: number;
    width?: number;
}

export interface ClickEvent {
    button: number;
    x: number;
    y: number;
}

export interface GameCanvas {
    drawRoom(room: Room);
}

const DefaultHeight = 480;
const DefaultWidth = 640;

export class CanvasHTML2D implements GameCanvas {

    constructor(public readonly canvasElement: HTMLCanvasElement) {
    }

    private get context(): CanvasRenderingContext2D {
        return this.canvasElement.getContext('2d');
    }

    get height(): number {
        return this.canvasElement.height;
    }

    get width(): number {
        return this.canvasElement.width;
    }

    init(options: CanvasOptions = {}): void {
        this.canvasElement.height = options.height || DefaultHeight;
        this.canvasElement.width = options.width || DefaultWidth;
    }

    onMouseDown(callback: (event: ClickEvent) => void): void {
        this.canvasElement.onmousedown = <any>((ev: MouseEvent) => {
            callback({ button: ev.button, x: ev.pageX, y: ev.pageY });
        });
    }

    drawRoom(room: Room) {

        // clear the canvas
        this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        // get view offset
        let view = room.getView();
        let offsetX = 0;
        let offsetY = 0;

        if (view) {
            view.updatePosition();

            offsetX = view.x;
            offsetY = view.y;
        }

        // draw sprites
        room.getInstances().forEach(instance => {
            if (instance.sprite) {
                this.drawSprite(instance.sprite, instance.x - offsetX, instance.y - offsetY);
            }
        });
    }

    private drawSprite(sprite: Sprite, x: number, y: number): void {
        let image = sprite.image;
        let frame = sprite.frame;
        let width = sprite.width;
        let height = sprite.height;

        this.context.drawImage(image, frame * width, 0, width, height, x, y, width, height);
    }
}