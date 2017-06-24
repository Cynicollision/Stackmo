import { CanvasHTML2D, CanvasOptions, GameCanvas } from './canvas';
import { GameContext } from './game-context';
import { GameRunner } from './game-runner';
import { Room } from './room';
import { Util } from './util';

// export public modules
export * from './actor';
export { ActorInstance } from './actor-instance';
export * from './boundary';
export * from './enum';
export * from './room';
export * from './sprite';

export interface GameLifecycleCallback {
    (): void;
}

export interface GameOptions {
    canvas?: CanvasOptions;
    targetFPS?: number;
}

class VastgameHTML2D {
    private context: GameContext;
    private runner: GameRunner;

    constructor() {
        this.context = new GameContext();
    }

    init(canvasElementID, options: GameOptions = {}): void {
        let element = <HTMLCanvasElement>document.getElementById(canvasElementID);
        let canvas = new CanvasHTML2D(element);
        canvas.init(options.canvas);

        this.context.setCanvas(canvas);
        this.runner = new GameRunner(canvas, options);
    }

    start(room: Room) {
        this.context.setCurrentRoom(room);
        this.runner.start(this.context);
    }

    getContext(): GameContext {
        return this.context;
    }
}

export class Vastgame {
    private static readonly game = new VastgameHTML2D();

    static init(canvasElementID: string, options?: GameOptions): VastgameHTML2D {
        Vastgame.game.init(canvasElementID, options);

        return Vastgame.game;
    }

    static getContext(): GameContext {
        return Vastgame.game.getContext();
    }
}

