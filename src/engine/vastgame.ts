import { CanvasHTML2D, GameCanvas } from './canvas';
import { GameContext } from './game-context';
import { InputHandler } from './input';
import { Room } from './room';
import { GameOptions, GameRunner } from './runner';
import { Util } from './util';

// export public modules
export * from './actor';
export * from './boundary';
export * from './enum';
export { GameOptions } from './runner';
export * from './room';
export * from './sprite';

const FPS = 30;

class VastgameHTML2D {
    private canvasElementID: string;
    private context: GameContext;
    private options: GameOptions;
    private runner: GameRunner;

    constructor() {
        this.context = new GameContext();
    }

    setCanvas(canvasElementID: string) {
        this.canvasElementID = canvasElementID;
    }

    setOptions(options: GameOptions) {
        this.options = options || {};
        this.options.targetFPS = this.options.targetFPS || FPS;
    }

    start(initialRoom: Room) {
        let element = <HTMLCanvasElement>document.getElementById(this.canvasElementID);
        let canvas = new CanvasHTML2D(element);
        let inputHandler = new InputHandler(element);

        this.runner = new GameRunner(canvas, inputHandler, this.options);
        this.runner.setRoom(initialRoom);
        this.runner.start();
    }

    getContext(): GameContext {
        return this.context;
    }
}

export class Vastgame {
    private static game = new VastgameHTML2D();

    static init(canvasElementID: string, options?: GameOptions): VastgameHTML2D {
        Vastgame.game.setCanvas(canvasElementID);
        Vastgame.game.setOptions(options);

        return Vastgame.game;
    }

    static getContext(): GameContext {
        return Vastgame.game.getContext();
    }
}

