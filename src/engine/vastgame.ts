import { GameCanvasHTML2D, CanvasOptions, GameCanvas } from './canvas';
import * as Enum from './enum';
import { Input } from './input';
import { GameContext } from './game-context';
import { GameRunner } from './game-runner';
import { Room } from './room';

// export public modules
export { Actor, ActorInstance } from './actor';
export { Boundary } from './boundary';
export { Enum }
export { Input } from './input';
export { Grid, GridCell } from './grid';
export { Room } from './room';
export { Sprite, SpriteTransformation } from './sprite';
export { View } from './view';

export interface GameLifecycleCallback {
    (args: any): void;
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
        let canvas = new GameCanvasHTML2D(element);
        canvas.init(options.canvas);

        GameContext.setCanvas(canvas);
        this.runner = new GameRunner(canvas, options);
    }

    start(roomID: string) {
        this.setRoom(roomID);
        this.runner.start();
    }

    setRoom(roomID: string, startArgs?: any) {
        let room = Room.get(roomID);
        
        let previousRoom = GameContext.getCurrentRoom();
        if (previousRoom) {
            previousRoom.end();
        }

        GameContext.setCurrentRoom(room);

        if (room.hasStart) {
            room.callStart(startArgs);
        }
    }
}

export class Vastgame {
    private static readonly game = new VastgameHTML2D();

    static start(canvasElementID: string, initialRoomID: string, options?: GameOptions): VastgameHTML2D {
        this.game.init(canvasElementID, options);
        this.game.start(initialRoomID);

        return this.game;
    }

    static setRoom(roomID: string, startArgs?: any) {
        this.game.setRoom(roomID, startArgs);
    }
}
