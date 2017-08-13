import { Background, Room } from './room';
import { Sprite, SpriteAnimation } from './sprite';
import { View } from './view';

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
            callback({ button: ev.button, x: ev.offsetX, y: ev.offsetY });
        });
    }

    drawRoom(room: Room) {
        
        // clear the canvas
        this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        // get view offset
        let [offsetX, offsetY] = this.getViewOffset(room.getView());

        // draw room background
        if (room.background) {
            this.context.beginPath();
            this.context.rect(-offsetX, -offsetY, room.background.width, room.background.height);
            this.context.fillStyle = room.background.color;
            this.context.fill();
        }

        room.getInstances().forEach(instance => {

            if (instance.sprite) {
                this.drawSprite(instance.sprite, instance.x - offsetX, instance.y - offsetY, instance.spriteAnimation);
            }
        });
    }

    private getViewOffset(view: View): [number, number] {
        let offsetX = view ? view.x : 0;
        let offsetY = view ? view.y : 0;

        return [offsetX, offsetY];
    }

    private drawSprite(sprite: Sprite, x: number, y: number, animation: SpriteAnimation): void {
        let image = sprite.image;
        let frameBorder = sprite.frameBorder || 0;
        let frame = animation.frame;
        let width = sprite.width;
        let height = sprite.height;

        let frameOffset = frame * frameBorder;

        this.context.drawImage(image, frame * width + frameOffset, 0, width, height, x, y, width, height);
    }
}