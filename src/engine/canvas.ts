import { ActorInstance } from './actor';
import { Background, Room } from './room';
import { Sprite, SpriteAnimation, SpriteTransformation } from './sprite';
import { View } from './view';

const DefaultHeight = 480;
const DefaultWidth = 640;

export interface GameCanvasOptions {
    height: number;
    width: number;
}

export interface ActorInstanceDrawEvent {
    (self: ActorInstance): void;
}

export interface RoomDrawEvent {
    (self: Room): void;
}

export interface GameCanvas {
    init(options: GameCanvasOptions): void;
    getContext(): GameCanvasContext;
}

export class GameCanvasHTML2D implements GameCanvas {
    readonly gameCanvasContext: GameCanvasContext;

    constructor(public readonly canvasElement: HTMLCanvasElement) {
        this.gameCanvasContext = new GameCanvasContext2D(this.canvasElement);
    }

    getContext(): GameCanvasContext {
        return this.gameCanvasContext;
    }

    init(options: GameCanvasOptions) {
        if (this.canvasElement) {
            this.canvasElement.height = options.height;
            this.canvasElement.width = options.width;
        }
    }
}

export interface GameCanvasContext {
    clear(): void;
    fill(x: number, y: number, width: number, height: number, color: string): void;
    drawSprite(sprite: Sprite, x: number, y: number, frame?: number): void;
}

export class GameCanvasContext2D implements GameCanvasContext {

    constructor(private canvasElement: HTMLCanvasElement) {
    }

    private get canvasContext2D(): CanvasRenderingContext2D {
        return this.canvasElement.getContext('2d');
    }

    clear() {
        this.canvasContext2D.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    fill(x: number, y: number, width: number, height: number, color: string) {
        this.canvasContext2D.beginPath();
        this.canvasContext2D.rect(x, y, width, height);
        this.canvasContext2D.fillStyle = color;
        this.canvasContext2D.fill();
    }

    drawSprite(sprite: Sprite, x: number, y: number, frame: number = 0): void {
        const defaultOpacity = 1;

        let image = sprite.image;
        let frameBorder = sprite.frameBorder || 0;
        let width = sprite.width;
        let height = sprite.height;

        let frameOffset = frame * frameBorder;

        // set opacity
        let opacity = sprite.getTransform(SpriteTransformation.Opacity);
        let previousOpacity: number = null;

        if (opacity !== defaultOpacity && opacity !== null && opacity !== undefined) {
            previousOpacity = this.canvasContext2D.globalAlpha;
            this.canvasContext2D.globalAlpha = opacity;
        }

        this.canvasContext2D.drawImage(image, frame * width + frameOffset, 0, width, height, Math.floor(x), Math.floor(y), width, height);

        // reset opacity
        if (previousOpacity !== null) {
            this.canvasContext2D.globalAlpha = previousOpacity;
        }
    }
}
