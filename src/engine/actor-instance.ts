import { Actor, ActorEventCallback } from './Actor';
import { Boundary } from './boundary';
import { ActorState, Direction } from './enum';
import { DeferredEvent } from './events';
import { Room } from './room';
import { Sprite } from './sprite';
import { SpriteAnimation } from './sprite-animation';
import { MathUtil } from './util';

export interface ActorInstanceDrawEvent {
    (self: ActorInstance): void;
}

export class ActorInstance {
    private state: ActorState;
    private spriteAnimation: SpriteAnimation;

    previousX: number;
    previousY: number;
    speed: number = 0;
    direction: number = Direction.Right;
    visible: boolean = true;

    constructor(private room: Room, public parent: Actor, public id: number, public x: number = 0, public y: number = 0) {
        this.state = ActorState.Active;
        this.previousX = this.x;
        this.previousY = this.y;

        if (this.parent.sprite) {
            this.spriteAnimation = new SpriteAnimation(this.parent.sprite);
        }
    }

    get hasMoved(): boolean {
        return (this.x !== this.previousX || this.y !== this.previousY);
    }

    get isActive(): boolean {
        return (this.state === ActorState.Active);
    }

    get boundary(): Boundary {
        return this.parent.boundary;
    }

    get animation(): SpriteAnimation {
        return this.spriteAnimation;
    }

    drawSprite(sprite: Sprite, x: number, y: number, frame: number = 0) {
        this.room.drawSprite(sprite, x, y, frame);
    }

    raiseEvent(eventName: string, eventArgs?: any): void {
        // register an event to fire immediately
        this.raiseEventWhen(eventName, () => true, eventArgs);
    }

    raiseEventIn(eventName: string, delay: number, eventArgs?: any): void {
        setTimeout(() => {
            this.raiseEvent(eventName, eventArgs);
        }, delay);
    }

    raiseEventWhen(eventName: string, conditionCallback: () => boolean, eventArgs: any = {}): void {
        this.parent.setGameContextEventArgs(eventArgs);

        let callback: ActorEventCallback = this.parent.actorEventHandlers[eventName];

        if (!callback) {
            throw new Error(`Attempting to raise undefined Event: ${eventName}`);
        }

        DeferredEvent.register(new DeferredEvent(conditionCallback, callback.bind(null, this, eventArgs)));
    }

    destroy(): void {
        this.state = ActorState.Destroyed;
    }

    collidesWith(other: ActorInstance): boolean {

        if (this.hasMoved && this.boundary && other.boundary) {
            return this.boundary.atPosition(this.x, this.y).collidesWith(other.boundary.atPosition(other.x, other.y));
        }

        return false;
    }

    getMovementOffsetX(): number {
        return MathUtil.getLengthDirectionX(this.speed * 100, this.direction) / 100;
    }

    getMovementOffsetY(): number {
        return MathUtil.getLengthDirectionY(this.speed * 100, this.direction) / 100;
    }

    setPositionRelative(x: number, y: number): void {
        this.setPosition(this.x + x, this.y + y);
    }

    setPosition(x: number, y: number): void {
        this.previousX = this.x;
        this.previousY = this.y;

        this.x = x;
        this.y = y;
    }

    move(speed: number, direction?: Direction): void {
        this.speed = speed;
        this.direction = direction;
    }

    occupiesPosition(x: number, y: number): boolean {
        return this.boundary ? this.boundary.atPosition(this.x, this.y).containsPosition(x, y) : false;
    }
}