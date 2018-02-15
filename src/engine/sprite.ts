import { Actor } from './actor';
import { GameCanvasContext } from './canvas';
import { Vastgame } from './vastgame';

export enum SpriteTransformation {
    Opacity = 0,
    Frame = 1,
}

export class Sprite {
    
    static define(name: string, options: SpriteOptions): Sprite {
        let sprite = new Sprite(options);
        Vastgame.getContext().defineSprite(name, sprite);

        return sprite;
    }

    static get(name: string): Sprite {
        return Vastgame.getContext().getSprite(name);
    }

    readonly image: HTMLImageElement;
    readonly height: number;
    readonly width: number;
    readonly frameBorder: number;
    readonly defaultAnimation: SpriteAnimation;

    constructor(options: SpriteOptions) {
        this.image = new Image();
        this.image.src = options.imageSource;
        this.height = options.height;
        this.width = options.width;
        this.frameBorder = options.frameBorder;
        this.defaultAnimation = new SpriteAnimation(this);
    }

    getFrameImageSourceCoords(frame: number): [number, number] {
        let frameBorder = this.frameBorder || 0;
        let frameRow = 0;

        if (this.image.width) {
            let framesPerRow = Math.floor(this.image.width / this.width);
            while (this.width * frame >= framesPerRow * this.width) {
                frame -= framesPerRow;
                frameRow++;
            }
        }

        let frameXOffset = frame * frameBorder;
        let frameYOffset = frameRow * frameBorder;
        let srcX = frame * this.width + frameXOffset;
        let srcY = frameRow * this.height + frameYOffset;

        return [srcX, srcY];
    }
}

export interface SpriteOptions {
    imageSource: string;
    height: number;
    width: number;
    frameBorder?: number;
}

export class SpriteAnimation {
    private transformatons: { [index: number]: number } = {};
    private timer: any;

    depth: number = 0;

    constructor(readonly sprite: Sprite) {
        this.setTransform(SpriteTransformation.Frame, 0);
        this.setTransform(SpriteTransformation.Opacity, 1);
    }

    start(start: number, end: number, delay?: number): void {
        this.stop();
        this.setTransform(SpriteTransformation.Frame, start);

        this.timer = setInterval(() => {
            if (this.getTransform(SpriteTransformation.Frame) === end) {
                this.setTransform(SpriteTransformation.Frame, start);
            }
            else {
                this.transform(SpriteTransformation.Frame, 1);
            }
        }, delay);
    }

    stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    setFrame(frame: number): void {
        this.stop();
        this.setTransform(SpriteTransformation.Frame, frame);
    }

    draw(canvasContext: GameCanvasContext, x: number, y: number): void {
        let frame = this.getTransform(SpriteTransformation.Frame);
        let opacity = this.getTransform(SpriteTransformation.Opacity);
        let [srcX, srcY] = this.sprite.getFrameImageSourceCoords(frame);

        canvasContext.drawImage(this.sprite.image, srcX, srcY, x, y, this.sprite.width, this.sprite.height, opacity);
    }

    // transformations
    getTransform(transformation: SpriteTransformation): number {
        return this.transformatons[transformation];
    }

    transform(transformation: SpriteTransformation, delta: number): void {
        this.transformatons[transformation] += delta;
    }

    setTransform(transformation: SpriteTransformation, value: number): void {
        this.transformatons[transformation] = value;
    }
}
