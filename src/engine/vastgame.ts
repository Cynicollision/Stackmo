import { CanvasHTML2D, GameCanvas } from './canvas';
import { GameRunner, GameOptions } from './runner';
import { Room } from './room';
import { Util } from './util';

// export public modules
export * from './actor';
export * from './boundary';
export * from './enum';
export { GameOptions } from './runner';
export * from './room';
export * from './sprite';

export interface GameLifecycleCallback {
    (): void;
}

export class Vastgame {

    static init(canvasElementID: string, options?: GameOptions): IVastgame {
        return new VastgameHTML2D(canvasElementID, options);
    }
}

interface IVastgame {
    start: (initialRoom: Room) => void;
}

class VastgameHTML2D implements IVastgame {
    
    private options: GameOptions;

    constructor(private canvasElementID: string, options?: GameOptions) {
        this.options = options || {};
        this.options.targetFPS = Util.getValueOrDefault(this.options.targetFPS, 60);
    }

    start(initialRoom: Room) {
        let gameCanvas = this.initGameCanvas(this.canvasElementID);
        let gameRunner = new GameRunner(gameCanvas, this.options, initialRoom);
        gameRunner.start();
    }

    private initGameCanvas(elementID: string): GameCanvas {
        return new CanvasHTML2D(<HTMLCanvasElement>document.getElementById(elementID));
    }
}
