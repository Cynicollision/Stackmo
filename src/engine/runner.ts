import { Actor } from './actor';
import { GameState } from './enum';
import { GameCanvas } from './canvas';
import { InputHandler } from './input';
import { Room } from './room';

export interface GameLifecycleCallback {
    (): void;
}

export interface GameOptions {
    targetFPS?: number;
}

export class GameRunner {
    private room: Room; // TODO: consider moving to GameContext
    state: GameState = GameState.Paused;

    constructor(private canvas: GameCanvas, private inputHandler: InputHandler, private options: GameOptions) {
        // TODO: consider moving to setRoom
        this.inputHandler.onMouseDown(event => this.room.handleClick(event));
    }

    get isRunning(): boolean {
        return this.state === GameState.Running;
    }

    setRoom(room: Room): void {
        this.room = room;
        this.room._onStart();
    }

    start(): void {

        let gameLoop: FrameRequestCallback = (): void => {

            let current: number = window.performance.now();
            offset += (Math.min(1, (current - previous) / 1000));
            
            while (offset > stepSize) {

                if (this.isRunning) {
                    this.room.step();
                }

                offset -= stepSize;
            }

            if (this.isRunning) {
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
        previous = window.performance.now();
        requestAnimationFrame(gameLoop);
    }
}
