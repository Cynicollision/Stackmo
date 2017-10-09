import { Actor } from './actor';
import { GameContext } from './game-context';

export enum SpriteTransformation {
    Opacity = 0,
}

export class Sprite {
    private transformatons: { [index: number]: number } = {};

    static define(name: string, options: SpriteOptions): Sprite {
        let sprite = new Sprite(options);
        GameContext.defineSprite(name, sprite);

        return sprite;
    }

    static get(name: string): Sprite {
        return GameContext.getSprite(name);
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
}

export interface SpriteOptions {
    imageSource: string;
    height: number;
    width: number;
    frameBorder?: number;
}

export class SpriteAnimation {
    private current: number = 0;
    private timer: any;

    constructor(readonly sprite: Sprite) {
        this.current = 0;
    }
    
    get frame(): number { 
        return this.current;
    }

    start(start: number, end: number, delay?: number): void {
        this.stop();
        this.current = start;

        this.timer = setInterval(() => {
            this.current = this.current === end ? start : this.current + 1;
        }, delay);
    }

    stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    set(frame: number): void {
        this.stop();
        this.current = frame;
    }
}
