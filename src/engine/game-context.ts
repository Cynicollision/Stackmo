import { Actor } from './actor';
import { CanvasHTML2D } from './canvas';
import { DeferredEvent } from './events';
import { Room } from './room';

export class GameContext {
    private readonly actors: { [index: number]: Actor } = {};
    private readonly events: { [index: number]: DeferredEvent } = {};

    private canvas: CanvasHTML2D;
    private currentRoom: Room;

    get room(): Room {
        return this.currentRoom;
    }

    setCanvas(canvas: CanvasHTML2D): void {
        this.canvas = canvas;
    }

    defineActor(name: string, actor: Actor): void {
        if (this.actors[name]) {
            throw new Error(`Actor ${name} has already been defined.`);
        }

        this.actors[name] = actor;
    }

    getActor(name: string): Actor {
        if (!this.actors[name]) {
            throw new Error(`Actor ${name} has not been defined.`);
        }

        return this.actors[name];
    }

    registerEvent(event: DeferredEvent): void {
        this.events[this.nextEventID()] = event;
    }

    checkAndFireEvents(): void {
        
        for (let eventID in this.events) {
            let event = this.events[eventID];

            if (event.conditionCallback()) {
                event.actionCallback();

                if (event.fireOnce) {
                    delete this.events[eventID];
                }
            }
        }
    }

    setCurrentRoom(room: Room): void {
        this.canvas.onMouseDown(event => room.handleClick(event));
        this.currentRoom = room;
    }

    private nextEventID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();
}
