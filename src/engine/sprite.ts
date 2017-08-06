export class Sprite {

    static define(options: SpriteOptions): Sprite {
        return new Sprite(options);
    }

    readonly image: HTMLImageElement;
    readonly height: number;
    readonly width: number;
    readonly animation: SpriteAnimation;

    constructor(options: SpriteOptions) {
        this.image = new Image();
        this.image.src = options.imageSource;
        this.height = options.height;
        this.width = options.width;
        this.animation = new SpriteAnimation(options.frame, options.frameBorder);
    }
}

export interface SpriteOptions {
    imageSource: string;
    height: number;
    width: number;
    frame?: number;
    frameBorder?: number;
}

class SpriteAnimation {
    private current: number = 0;
    private paused: boolean;

    constructor(frame: number = 0, readonly frameBorder: number = 0) {
        this.current = frame;
    }
    
    get frame(): number { 
        return this.current;
    }

    start(start: number, end: number, delay?: number): void {
        this.current = start;

        let animate = (): void => {
            if (!this.paused) {
                this.current = this.current === end ? start : this.current + 1;
            }
        };

        setInterval(() => {
            animate();
        }, delay);
    }

    pause(): void {
        this.paused = true;
    }

    resume(): void {
        this.paused = false;
    }
}