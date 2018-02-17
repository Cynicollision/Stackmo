import { Actor, ActorEventCallback } from './actor';
import { Boundary } from './boundary';
import { ActorState } from './enum';
import { DeferredEvent } from './events';
import { Room } from './room';
import { Sprite, DrawSpriteOptions } from './sprite';
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
    direction: number = 0;
    visible: boolean = true;

    constructor(private room: Room, public parent: Actor, public id: number, public x: number = 0, public y: number = 0) {
        this.state = ActorState.Active;

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

    drawSprite(sprite: Sprite, x: number, y: number, options: DrawSpriteOptions) {
        this.room.drawSprite(sprite, x, y, options);
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

    collidesWith(other: ActorInstance): boolean {

        if (this.hasMoved && this.boundary && other.boundary) {
            return this.boundary.atPosition(this.x, this.y).collidesWith(other.boundary.atPosition(other.x, other.y));
        }

        return false;
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

    move(speed: number, direction?: number): void {
        this.speed = speed;
        this.direction = direction;
    }

    _applyMovement(): void {
        if (this.speed !== 0) {
            let offsetX = Math.round(MathUtil.getLengthDirectionX(this.speed * 100, this.direction) / 100);
            let offsetY = Math.round(MathUtil.getLengthDirectionY(this.speed * 100, this.direction) / 100);
    
            if (offsetX !== 0 || offsetY !== 0) {
                this.setPositionRelative(offsetX, offsetY);
            }
        }
    }

    occupiesPosition(x: number, y: number): boolean {
        return this.boundary ? this.boundary.atPosition(this.x, this.y).containsPosition(x, y) : false;
    }

    destroy(): void {
        this.state = ActorState.Destroyed;
    }
}