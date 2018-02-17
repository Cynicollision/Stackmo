const DefaultHeight = 480;
const DefaultWidth = 640;

export interface GameCanvasOptions {
    height: number;
    width: number;
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

export interface CanvasDrawOptions {
    opacity?: number;
    tileX?: boolean;
    tileY?: boolean;
}

export interface GameCanvasContext {
    origin: [number, number];
    clear(): void;
    fill(width: number, height: number, color: string): void;
    fillArea(x: number, y: number, width: number, height: number, color: string): void;
    drawImage(image: HTMLImageElement, srcX: number, srcY: number, destX: number, destY: number, width: number, height: number, options?: CanvasDrawOptions): void;
}

export class GameCanvasContext2D implements GameCanvasContext {
    origin: [number, number];

    constructor(private canvasElement: HTMLCanvasElement) {
        this.origin = [0, 0];
    }

    private get canvasContext2D(): CanvasRenderingContext2D {
        return this.canvasElement.getContext('2d');
    }

    clear() {
        this.canvasContext2D.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    fill(width: number, height: number, color: string) {
        let [x, y] = this.origin;
        this.fillArea(x, y, width, height, color);
    }

    fillArea(x: number, y: number, width: number, height: number, color: string) {
        this.canvasContext2D.beginPath();
        this.canvasContext2D.rect(x, y, width, height);
        this.canvasContext2D.fillStyle = color;
        this.canvasContext2D.fill();
    }

    drawImage(image: HTMLImageElement, srcX: number, srcY: number, destX: number, destY: number, width: number, height: number, options: CanvasDrawOptions = {}): void {
        // set opacity
        const defaultOpacity = 1;
        let previousOpacity: number = null;

        if (options.opacity !== defaultOpacity && options.opacity !== null && options.opacity !== undefined) {
            previousOpacity = this.canvasContext2D.globalAlpha;
            this.canvasContext2D.globalAlpha = options.opacity;
        }

        // draw the image relative to the origin
        let [originX, originY] = this.origin;

        if (options.tileX || options.tileY) {
            let repetition = options.tileX && options.tileY ? 'repeat' : options.tileX ? 'repeat-x' : 'repeat-y';
            let pattern = this.canvasContext2D.createPattern(image, repetition);
            this.canvasContext2D.fillStyle = pattern;
            this.canvasContext2D.fillRect(originX + destX, originY + destY, this.canvasContext2D.canvas.width, this.canvasContext2D.canvas.height);
        }
        else {
            this.canvasContext2D.drawImage(image, srcX, srcY, width, height, Math.floor(originX + destX), Math.floor(originY + destY), width, height);
        }

        // reset opacity
        if (previousOpacity !== null) {
            this.canvasContext2D.globalAlpha = previousOpacity;
        }
    }
}
