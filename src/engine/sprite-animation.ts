import { GameCanvasContext } from './canvas';
import { Sprite } from './sprite';

export enum SpriteTransformation {
    Opacity = 0,
    Frame = 1,
}

export class SpriteAnimation {
    private transformatons: { [index: number]: number } = {};
    private timer: any;

    depth: number = 0;

    private _paused: boolean = true;
    get paused(): boolean {
        return this._paused;
    }

    constructor(readonly sprite: Sprite) {
        this.setTransform(SpriteTransformation.Frame, 0);
        this.setTransform(SpriteTransformation.Opacity, 1);
    }

    start(start: number, end: number, delay?: number): void {
        this.stop();
        this.setTransform(SpriteTransformation.Frame, start);

        this._paused = false;
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
        this._paused = true;
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
