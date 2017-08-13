import { CanvasHTML2D, CanvasOptions, GameCanvas } from './canvas';
import { GameContext } from './game-context';
import { GameRunner } from './game-runner';
import { Room } from './room';

// export public modules
export * from './actor';
export * from './boundary';
export * from './enum';
export { Grid, GridCell } from './grid';
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
    private runner: GameRunner;

    init(canvasElementID, options: GameOptions = {}): void {
        let element = <HTMLCanvasElement>document.getElementById(canvasElementID);
        let canvas = new CanvasHTML2D(element);
        canvas.init(options.canvas);

        GameContext.setCanvas(canvas);
        this.runner = new GameRunner(canvas, options);
    }

    start(room: Room) {
        this.setRoom(room);
        this.runner.start();
    }

    setRoom(room: Room) {
        GameContext.setCurrentRoom(room);

        if (room.hasStart) {
            room.callStart();
        }
    }
}

export class Vastgame {
    private static readonly game = new VastgameHTML2D();

    static init(canvasElementID: string, options?: GameOptions): VastgameHTML2D {
        this.game.init(canvasElementID, options);

        return this.game;
    }

    static get(): VastgameHTML2D {
        return this.game;
    }

    // static getContext(): GameContext {
    //     return this.game.getContext();
    // }
}
