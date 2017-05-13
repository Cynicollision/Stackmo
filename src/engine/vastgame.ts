import { Actor, ActorInstance } from './actor';
import { CanvasHTML2D, GameCanvas } from './canvas';
import { GameRunner } from './runner';
import { Room } from './room';

// export public modules
export * from './actor';
export * from './room';

export interface GameLifecycleCallback {
    (): void;
}

export class Vastgame {

    static start(initialRoom: Room, canvasElementID: string) {
        new VastgameHTML2D(canvasElementID).start(initialRoom);
    }
}

export interface IVastgame {
    start: (initialRoom: Room) => void;
}

class VastgameHTML2D implements IVastgame {
    
    constructor(private canvasElementID: string) {
    }

    start(initialRoom: Room) {
        let gameCanvas = this.initGameCanvas(this.canvasElementID);
        let gameRunner = new GameRunner(gameCanvas, initialRoom);
        gameRunner.start();
    }

    private initGameCanvas(elementID: string): GameCanvas {
        return new CanvasHTML2D(<HTMLCanvasElement>document.getElementById(elementID));
    }
}
