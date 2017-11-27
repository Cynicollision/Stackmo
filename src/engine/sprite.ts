import { Actor } from './actor';
import { Vastgame } from './vastgame';

export enum SpriteTransformation {
    Opacity = 0,
}

export class Sprite {
    private transformatons: { [index: number]: number } = {};

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

    constructor(options: SpriteOptions) {
        this.image = new Image();
        this.image.src = options.imageSource;
        this.height = options.height;
        this.width = options.width;
        this.frameBorder = options.frameBorder;

        this.setDefaultTransforms();
    }

    private setDefaultTransforms(): void {
        this.transformatons[SpriteTransformation.Opacity] = 1;
    }

    getTransform(transformation: SpriteTransformation): number {
        return this.transformatons[transformation];
    }

    transform(transformation: SpriteTransformation, delta: number): void {
        this.transformatons[transformation] += delta;
    }

    setTransform(transformation: SpriteTransformation, value: number): void {
        this.transformatons[transformation] = value;
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
    private currentFrame: number = 0;
    private timer: any;

    depth: number = 0;

    constructor(readonly sprite: Sprite) {
        this.currentFrame = 0;
    }
    
    get frame(): number { 
        return this.currentFrame;
    }

    get source(): Sprite {
        return this.sprite;
    }

    start(start: number, end: number, delay?: number): void {
        this.stop();
        this.currentFrame = start;

        this.timer = setInterval(() => {
            this.currentFrame = this.currentFrame === end ? start : this.currentFrame + 1;
        }, delay);
    }

    stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    set(frame: number): void {
        this.stop();
        this.currentFrame = frame;
    }  
}
