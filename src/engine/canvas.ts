import { ScaleMode } from './enum';
import { Room } from './room';
import { Sprite } from './sprite';

export interface CanvasOptions {
    height?: number;
    scale?: number | ScaleMode;
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
const DefaultScale = ScaleMode.None;

export class CanvasHTML2D implements GameCanvas {
    private scale: number = 1;

    constructor(public readonly canvasElement: HTMLCanvasElement) {
    }

    private get context(): CanvasRenderingContext2D {
        return this.canvasElement.getContext('2d');
    }

    get height(): number {
        return this.canvasElement.height / this.scale;
    }

    get width(): number {
        return this.canvasElement.width / this.scale;
    }

    init(options: CanvasOptions = {}): void {
        // set defaults
        options.height = options.height || DefaultHeight;
        options.scale = options.scale || DefaultScale;
        options.width = options.width || DefaultWidth;

        this.scale = <number>options.scale;

        if (options.scale === ScaleMode.Fill) {
            this.canvasElement.height = window.innerHeight;
            this.canvasElement.width = window.innerWidth;
        }
        else {
            this.canvasElement.height = options.height * options.scale;
            this.canvasElement.width = options.width * options.scale;
        }
    }

    onMouseDown(callback: (event: ClickEvent) => void): void {
        this.canvasElement.onmousedown = <any>((ev: MouseEvent) => {
            callback({ button: ev.button, x: ev.pageX, y: ev.pageY });
        });
    }

    drawRoom(room: Room) {

        // clear the canvas
        this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        // draw sprites
        room.getInstances().forEach(instance => {
            if (instance.sprite) {
                this.drawSprite(instance.sprite, instance.x, instance.y);
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