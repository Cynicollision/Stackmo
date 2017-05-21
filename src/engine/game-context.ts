import { Actor } from './actor';
import { CanvasHTML2D } from './canvas';
import { Room } from './room';

export class GameContext {
    private actorMap = new Map<string, Actor>();
    private canvas: CanvasHTML2D;
    private currentRoom: Room;

    get room(): Room {
        return this.currentRoom;
    }

    setCanvas(canvas: CanvasHTML2D): void {
        this.canvas = canvas;
    }

    defineActor(name: string, actor: Actor): void {
        if (this.actorMap.has(name)) {
            throw new Error(`Actor ${name} has already been defined.`);
        }

        this.actorMap.set(name, actor);
    }

    getActor(name: string): Actor {
        if (!this.actorMap.has(name)) {
            throw new Error(`Actor ${name} has not been defined.`);
        }

        return this.actorMap.get(name);
    }

    setCurrentRoom(room: Room): void {
        this.canvas.onMouseDown(event => room.handleClick(event));
        this.currentRoom = room;
    }
}