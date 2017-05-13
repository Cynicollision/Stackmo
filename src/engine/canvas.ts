import { Room } from './room';
import { Sprite } from './sprite';

export interface GameCanvas {
    drawRoom(room: Room);
}

export class CanvasHTML2D implements GameCanvas {

    constructor(private canvasElement: HTMLCanvasElement) {
    }

    private get context(): CanvasRenderingContext2D {
        return this.canvasElement.getContext('2d');
    }

    drawRoom(room: Room) {
        let actorInstances = room.getActorInstances();

        actorInstances.forEach(instance => {
            
            if (instance.sprite) {
                this.drawSprite(instance.sprite, instance.x, instance.y);
            }
        });
    }

    private drawSprite(sprite: Sprite, x: number, y: number): void {
        let image = sprite.image;
        let frame = sprite.frame;
        let width = sprite.width;
        let height = sprite.height;

        this.context.drawImage(image, frame * width, 0, width, height, x, y, width, height);
    }
}