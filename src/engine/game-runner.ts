import { GameCanvasOptions, GameCanvas } from './canvas';
import { GameState } from './enum';
import { GameContext } from './game-context';
import { GameOptions } from './vastgame';

const DefaultFPS = 60;

export class GameRunner {
    private state: GameState = GameState.Paused;
    readonly targetFPS: number;

    constructor(private options: GameOptions) {
        this.targetFPS = options.targetFPS || DefaultFPS;
    }

    get isRunning(): boolean {
        return this.state === GameState.Running;
    }

    pause(): void {
        this.state = GameState.Paused;
    }

    start(gameContext: GameContext): void {
        let stepSize: number = 1 / this.targetFPS;
        let offset: number = 0;
        let previous: number = window.performance.now();

        let canvasDrawingContext = gameContext.getCanvasContext();

        let gameLoop: FrameRequestCallback = (): void => {
            let room = gameContext.getCurrentRoom();
            let current: number = window.performance.now();
            
            offset += (Math.min(1, (current - previous) / 1000));
            
            while (offset > stepSize) {

                if (this.isRunning) {
                    gameContext.checkAndFireEvents();
                    room.step();
                }
                else {
                    return;
                }

                offset -= stepSize;
            }

            if (this.isRunning) {
                canvasDrawingContext.clear();
                room.draw(canvasDrawingContext);
            }

            previous = current;
            requestAnimationFrame(gameLoop);
        };

        // start the game loop
        this.state = GameState.Running;
        requestAnimationFrame(gameLoop);
    }
}
