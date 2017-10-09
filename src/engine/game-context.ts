import { Actor } from './actor';
import { CanvasHTML2D } from './canvas';
import { DeferredEvent } from './events';
import { Room } from './room';
import { Sprite } from './sprite';

export class GameContext {
    private static _instance: GameContext = new GameContext();

    private readonly actors: { [index: string]: Actor } = {};
    private readonly events: { [index: number]: DeferredEvent } = {};
    private readonly rooms: { [index: string]: Room } = {};
    private readonly sprites: { [index: string]: Sprite} = {};

    private canvas: CanvasHTML2D;
    private currentRoom: Room;

    static setCanvas(canvas: CanvasHTML2D): void {
        this._instance.canvas = canvas;
    }

    // actors
    static defineActor(name: string, actor: Actor): void {
        if (this._instance.actors[name]) {
            throw new Error(`Actor ${name} has already been defined.`);
        }

        this._instance.actors[name] = actor;
    }

    static getActor(name: string): Actor {
        if (!this._instance.actors[name]) {
            throw new Error(`Actor ${name} has not been defined.`);
        }

        return this._instance.actors[name];
    }

    // rooms
    static defineRoom(name: string, room: Room): void {
        if (this._instance.rooms[name]) {
            throw new Error(`Room ${name} has already been defined.`);
        }

        this._instance.rooms[name] = room;
    }

    static getRoom(name: string): Room {
        if (!this._instance.rooms[name]) {
            throw new Error(`Room ${name} has not been defined.`);
        }

        return this._instance.rooms[name];
    }

    static getCurrentRoom(): Room {
        return this._instance.currentRoom;
    }

    static setCurrentRoom(room: Room): void {
        this._instance.canvas.onMouseDown(event => room.handleClick(event));
        this._instance.currentRoom = room;
    }

    // sprites
    static defineSprite(name: string, sprite: Sprite): void {
        if (this._instance.sprites[name]) {
            throw new Error(`Sprite ${name} has already been defined.`);
        }

        this._instance.sprites[name] = sprite;
    }

    static getSprite(name: string): Sprite {
        if (!this._instance.sprites[name]) {
            throw new Error (`Sprite ${name} has not been defined.`);
        }

        return this._instance.sprites[name];
    }

    // events
    static registerEvent(event: DeferredEvent): void {
        this._instance.events[this._instance.nextEventID()] = event;
    }

    static checkAndFireEvents(): void {
        
        for (let eventID in this._instance.events) {
            let event = this._instance.events[eventID];

            if (event.conditionCallback()) {
                event.actionCallback();

                if (event.fireOnce) {
                    delete this._instance.events[eventID];
                }
            }
        }
    }

    private nextEventID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();
}
