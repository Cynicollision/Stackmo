export class Sprite {

    static define(options: SpriteOptions): Sprite {
        return new Sprite(options);
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