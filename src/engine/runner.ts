import { GameState } from './enum';
import { GameCanvas } from './canvas';
import { Room } from './room';

export interface GameLifecycleCallback {
    (): void;
}

export interface GameOptions {
    targetFPS?: number;
}

export class GameRunner {

    state: GameState = GameState.Paused;

    constructor (private canvas: GameCanvas, private options: GameOptions, private room: Room) {
    }

    setRoom(room: Room) {
        this.room = room;
    }

    isRunning(): boolean {
        return this.state === GameState.Running;
    }

    start(): void {

        let gameLoop: FrameRequestCallback = (): void => {

            let current: number = window.performance.now();
            offset += (Math.min(1, (current - previous) / 1000));
            
            while (offset > stepSize) {

                if (this.isRunning()) {
                    this.room.step();
                }

                offset -= stepSize;
            }

            if (this.isRunning()) {
                this.canvas.drawRoom(this.room);
            }

            previous = current;
            requestAnimationFrame(gameLoop);
        };

        let stepSize: number = 1 / this.options.targetFPS;
        let offset: number = 0;
        let previous: number;

        // start the game
        this.state = GameState.Running;
        this.room._onStart();

        previous = window.performance.now();
        requestAnimationFrame(gameLoop);
    }
}
