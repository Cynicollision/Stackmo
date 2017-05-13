import { Room } from './room';

export interface GameCanvas {
    drawRoom(room: Room);
}

export class CanvasHTML2D implements GameCanvas {

    constructor(private canvasElement: HTMLCanvasElement) {
    }

    drawRoom(room: Room) {
        
    }
}