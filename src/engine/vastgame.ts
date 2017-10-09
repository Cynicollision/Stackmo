import { CanvasHTML2D, CanvasOptions, GameCanvas } from './canvas';
import { Input } from './input';
import { GameContext } from './game-context';
import { GameRunner } from './game-runner';
import { Room } from './room';

// export public modules
export { Actor, ActorInstance } from './actor';
export { Boundary } from './boundary';
export * from './enum';
export { Input } from './input';
export { Grid, GridCell } from './grid';
export { Room } from './room';
export { Sprite, SpriteTransformation } from './sprite';
export { View } from './view';

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
        Input.init();
        
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
        let previousRoom = GameContext.getCurrentRoom();
        if (previousRoom) {
            previousRoom.end();
        }

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
}
