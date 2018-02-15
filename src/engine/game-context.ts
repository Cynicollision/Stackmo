import { Actor } from './actor';
import { GameCanvas, GameCanvasContext } from './canvas';
import { DeferredEvent } from './events';
import { Input, ConcreteEventHandler, PointerInputEvent } from './input';
import { Room } from './room';
import { Sprite } from './sprite';

export class GameContext {
    private readonly actors: { [index: string]: Actor } = {};
    private readonly events: { [index: number]: DeferredEvent } = {};
    private readonly rooms: { [index: string]: Room } = {};
    private readonly sprites: { [index: string]: Sprite} = {};

    private currentRoom: Room;
    private currentRoomClickHandler: ConcreteEventHandler<PointerInputEvent>;

    constructor(private canvas: GameCanvas) {
    }

    getCanvasContext(): GameCanvasContext {
        return this.canvas.getContext();
    }

    // actors
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

    // events
    private nextEventID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();

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

    // rooms
    defineRoom(name: string, room: Room): void {
        if (this.rooms[name]) {
            throw new Error(`Room ${name} has already been defined.`);
        }

        this.rooms[name] = room;
    }

    getRoom(name: string): Room {
        if (!this.rooms[name]) {
            throw new Error(`Room ${name} has not been defined.`);
        }

        return this.rooms[name];
    }

    getCurrentRoom(): Room {
        return this.currentRoom;
    }

    setCurrentRoom(room: Room): void {
        this.currentRoom = room;

        // dipose previous room's click handler
        if (this.currentRoomClickHandler) {
            this.currentRoomClickHandler.dispose();
        }

        this.currentRoomClickHandler = Input.registerClickHandler(ev => room.handleClick(ev));
    }

    // sprites
    defineSprite(name: string, sprite: Sprite): void {
        if (this.sprites[name]) {
            throw new Error(`Sprite ${name} has already been defined.`);
        }

        this.sprites[name] = sprite;
    }

    getSprite(name: string): Sprite {
        if (!this.sprites[name]) {
            throw new Error (`Sprite ${name} has not been defined.`);
        }

        return this.sprites[name];
    }
}
