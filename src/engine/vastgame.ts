import { GameCanvasHTML2D, GameCanvasOptions, GameCanvas } from './canvas';
import * as Enum from './enum';
import { Input } from './input';
import { GameContext } from './game-context';
import { GameRunner } from './game-runner';
import { Room } from './room';

// export public modules
export { Actor } from './actor';
export { ActorInstance } from './actor-instance';
export { Boundary } from './boundary';
export { Enum }
export { Input } from './input';
export { Grid, GridCell } from './grid';
export { Room } from './room';
export { GridRoomBehavior, ViewedRoomBehavior } from './room-ext';
export { Sprite } from './sprite';
export { SpriteAnimation, SpriteTransformation } from './sprite-animation';
export { View } from './view';

export interface GameLifecycleCallback {
    (args: any): void;
}

export interface GameOptions {
    canvas?: GameCanvasOptions;
    targetFPS?: number;
}

class VastgameHTML2D {
    private context: GameContext;
    private runner: GameRunner;

    init(canvasElementID, options) {
        Input.init();
        
        let element = <HTMLCanvasElement>document.getElementById(canvasElementID);
        let canvas: GameCanvas = new GameCanvasHTML2D(element);
        canvas.init(options.canvas);

        this.context = new GameContext(canvas);
        this.runner = new GameRunner(options);
    }

    getContext(): GameContext {
        return this.context;
    }

    start(roomID: string) {
        this.setRoom(roomID);
        this.runner.start(this.context);
    }

    setRoom(roomID: string, startArgs?: any) {
        let room = Room.get(roomID);
        
        let previousRoom = this.context.getCurrentRoom();
        if (previousRoom) {
            previousRoom.end();
        }

        this.context.setCurrentRoom(room);

        room.callStart(startArgs);
    }
}

export class Vastgame {
    private static readonly game = new VastgameHTML2D();

    static init(canvasElementID: string, options: GameOptions) {
        this.game.init(canvasElementID, options);
    }

    static start(initialRoomID: string, ): VastgameHTML2D {
        this.game.start(initialRoomID);

        return this.game;
    }

    static getContext(): GameContext {
        return this.game.getContext();
    }

    static setRoom(roomID: string, startArgs?: any) {
        this.game.setRoom(roomID, startArgs);
    }
}
