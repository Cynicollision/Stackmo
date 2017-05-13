import { GameCanvas } from './canvas';
import { Room } from './room';

export enum GameState {
    Running = 1,
    Paused = 2,
}

export class GameRunner {

    state: GameState = GameState.Paused;

    constructor (private canvas: GameCanvas, private room: Room) {
    }

    setRoom(room: Room) {
        this.room = room;
    }

    isRunning(): boolean {
        return this.state === GameState.Running;
    }

    start(): void {
        let offset: number = 0;
        let stepSize: number = 1 / 60;
        let previous: number;

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

        // start the game
        this.state = GameState.Running;
        this.room.start();

        previous = window.performance.now();
        requestAnimationFrame(gameLoop);
    }
}
