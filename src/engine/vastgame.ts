import { CanvasHTML2D, GameCanvas } from './canvas';
import { InputHandler } from './input';
import { Room } from './room';
import { GameRunner, GameOptions } from './runner';
import { Util } from './util';

// export public modules
export * from './actor';
export * from './boundary';
export * from './enum';
export { GameOptions } from './runner';
export * from './room';
export * from './sprite';

const FPS = 30;

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
        this.options.targetFPS = this.options.targetFPS || FPS;
    }

    start(initialRoom: Room) {
        let element = <HTMLCanvasElement>document.getElementById(this.canvasElementID);
        let canvas = new CanvasHTML2D(element);
        let inputHandler = new InputHandler(element);

        let gameRunner = new GameRunner(canvas, inputHandler, this.options);
        gameRunner.setRoom(initialRoom);
        gameRunner.start();
    }
}
