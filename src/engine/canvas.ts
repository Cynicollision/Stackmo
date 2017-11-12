import { ActorInstance } from './actor';
import { Background, Room } from './room';
import { Sprite, SpriteAnimation, SpriteTransformation } from './sprite';
import { View } from './view';

export interface CanvasOptions {
    height?: number;
    width?: number;
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
const DefaultOpacity = 1;

export class GameCanvasHTML2D implements GameCanvas {
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

    // TODO: separate canvas interactions from room/instance logic
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

        let orderedInstances = room.getInstances().sort((a, b) => {
            return (b.spriteAnimation ? b.spriteAnimation.depth : 0) - (a.spriteAnimation ? a.animation.depth : 0);
        });

        orderedInstances.forEach(instance => {
            // call actor draw event callbacks
            if (instance.parent.hasDraw) {
                instance.parent.callDraw(instance, this.gameCanvasContext);
            }

            // draw sprites
            if (instance.animation && instance.visible) {
                this.drawSprite(instance.animation.source, instance.x - offsetX, instance.y - offsetY, instance.spriteAnimation.frame);
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

        let opacity = sprite.getTransform(SpriteTransformation.Opacity);
        let previousOpacity: number = null;

        if (opacity !== DefaultOpacity && opacity !== null && opacity !== undefined) {
            previousOpacity = this.context.globalAlpha;
            this.context.globalAlpha = opacity;
        }

        this.context.drawImage(image, frame * width + frameOffset, 0, width, height, Math.floor(x), Math.floor(y), width, height);

        // reset opacity
        if (previousOpacity !== null) {
            this.context.globalAlpha = previousOpacity;
        }
    }

    drawSpriteViewRelative(sprite: Sprite, x: number, y: number, frame: number, view: View): void {
        let [offsetX, offsetY] = this.getViewOffset(view);
        this.drawSprite(sprite, x - offsetX, y - offsetY, frame);
    }
}

export class GameCanvasContext {

    constructor(private gameCanvas: GameCanvasHTML2D) {
    }

    drawSprite(sprite: Sprite, x: number, y: number, frame: number = 0, view?: View) {
        this.gameCanvas.drawSpriteViewRelative(sprite, x, y, frame, view);
    }
}