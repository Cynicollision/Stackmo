import { CanvasOptions, GameCanvas } from './canvas';
import { GameState } from './enum';
import { GameContext } from './game-context';
import { GameOptions } from './vastgame';

const DefaultFPS = 30;

export class GameRunner {
    private state: GameState = GameState.Paused;

    constructor(private canvas: GameCanvas, private options: GameOptions) {
    }

    get isRunning(): boolean {
        return this.state === GameState.Running;
    }

    pause(): void {
        this.state = GameState.Paused;
    }

    start(context: GameContext): void {
        let room = context.room;
        let stepSize: number = 1 / this.options.targetFPS || DefaultFPS;
        let offset: number = 0;
        let previous: number = window.performance.now();

        let gameLoop: FrameRequestCallback = (): void => {

            let current: number = window.performance.now();
            offset += (Math.min(1, (current - previous) / 1000));
            
            while (offset > stepSize) {

                if (this.isRunning) {
                    room.step();
                }
                else {
                    return;
                }

                offset -= stepSize;
            }

            if (this.isRunning) {
                this.canvas.drawRoom(room);
            }

            previous = current;
            requestAnimationFrame(gameLoop);
        };

        // start the game loop
        this.state = GameState.Running;
        requestAnimationFrame(gameLoop);
        room._onStart();
    }
}
