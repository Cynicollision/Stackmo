export interface SpriteOptions {
    imageSource: string;
    height: number;
    width: number;
    frame?: number;
}

export class Sprite {

    static define(options: SpriteOptions): Sprite {
        return new Sprite(options);
    }

    readonly image: HTMLImageElement;
    readonly height: number;
    readonly width: number;
    
    frame: number;

    constructor(options: SpriteOptions) {
        this.image = new Image();
        this.image.src = options.imageSource;
        this.height = options.height;
        this.width = options.width;
        this.frame = options.frame || 0;
    }    
}