import { ActorInstance } from './actor';
import { Background, Room } from './room';
import { Sprite, SpriteAnimation } from './sprite';
import { View } from './view';

export interface CanvasOptions {
    height?: number;
    width?: number;
}

export interface CanvasClickEvent {
    button: number;
    x: number;
    y: number;
}

export interface ActorInstanceDrawEvent {
    (self: ActorInstance, context: GameCanvasContext): void;
}

export interface RoomDrawEvent {
    (context: GameCanvasContext): void;
}

export interface GameCanvas {
    drawRoom(room: Room);
    drawSprite(sprite: Sprite, x: number, y: number, frame: number): void;
}

const DefaultHeight = 480;
const DefaultWidth = 640;

export class CanvasHTML2D implements GameCanvas {
    private gameCanvasContext: GameCanvasContext;

    constructor(public readonly canvasElement: HTMLCanvasElement) {
        this.gameCanvasContext = new GameCanvasContext(this);
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

    onMouseDown(callback: (event: CanvasClickEvent) => void): void {
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

        // call room draw event callback
        if (room.hasDraw) {
            room.callDraw(this.gameCanvasContext);
        }

        room.getInstances().forEach(instance => {
            // call actor draw event callbacks
            if (instance.parent.hasDraw) {
                instance.parent.callDraw(instance, this.gameCanvasContext);
            }

            // draw sprites
            if (instance.sprite) {
                this.drawSprite(instance.sprite, instance.x - offsetX, instance.y - offsetY, instance.spriteAnimation.frame);
            }
        });
    }

    private getViewOffset(view: View): [number, number] {
        let offsetX = view ? view.x : 0;
        let offsetY = view ? view.y : 0;

        return [offsetX, offsetY];
    }

    drawSprite(sprite: Sprite, x: number, y: number, frame: number = 0): void {
        let image = sprite.image;
        let frameBorder = sprite.frameBorder || 0;
        let width = sprite.width;
        let height = sprite.height;

        let frameOffset = frame * frameBorder;

        this.context.drawImage(image, frame * width + frameOffset, 0, width, height, Math.floor(x), Math.floor(y), width, height);
    }

    drawSpriteViewRelative(sprite: Sprite, x: number, y: number, frame: number, view: View): void {
        let [offsetX, offsetY] = this.getViewOffset(view);
        this.drawSprite(sprite, x - offsetX, y - offsetY, frame);
    }
}

export class GameCanvasContext {

    constructor(private gameCanvas: CanvasHTML2D) {
    }

    drawSprite(sprite: Sprite, x: number, y: number, frame: number = 0, view?: View) {
        this.gameCanvas.drawSpriteViewRelative(sprite, x, y, frame, view);
    }
}