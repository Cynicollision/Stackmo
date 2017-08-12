import { Boundary } from './boundary';
import { ClickEvent } from './canvas';
import { ActorState, Direction } from './enum';
import { DeferredEvent } from './events';
import { Sprite, SpriteAnimation } from './sprite';
import { MathUtil } from './util';
import { Vastgame } from './vastgame';

export interface ActorLifecycle {
    onCreate: LifecycleCallback;
    onStep: LifecycleCallback;
    onDestroy: LifecycleCallback;
}

export interface LifecycleCallback {
    (self: ActorInstance): void;
}

export interface ActorEvent {
    name: string;
    callback: ActorEventCallback;
}

export interface ActorEventCallback {
    (self?: ActorInstance, eventArgs?: any): void;
}

export interface ActorOptions {
    boundary?: Boundary;
    sprite?: Sprite;
}

interface ClickEventCallback {
    (self: ActorInstance, event: ClickEvent): void;
}

export interface CollisionCallback {
    (self: ActorInstance, other: ActorInstance): void;
}

export class Actor {

    static define(name: string, options?: ActorOptions): Actor {
        let actor = new Actor(name, options);
        Vastgame.getContext().defineActor(name, actor);

        return actor;
    }

    static get(name: string): Actor {
        return Vastgame.getContext().getActor(name);
    }

    // lifecycle callbacks
    private onCreateCallback: LifecycleCallback;
    private onStepCallback: LifecycleCallback;
    private onDestroyCallback: LifecycleCallback;

    // input callbacks
    private onClickCallback: ClickEventCallback;

    // game event handlers
    readonly collisionHandlers: { [index: string]: CollisionCallback } = {};
    readonly actorEventHandlers: { [index: string] : ActorEventCallback } = {};

    readonly boundary: Boundary;
    readonly name: string;
    readonly sprite: Sprite;

    constructor(name: string, options: ActorOptions = {}) {
        this.boundary = options.boundary;
        this.name = name;
        this.sprite = options.sprite;
    }

    get hasCreate(): boolean {
        return !!this.onCreateCallback;
    }

    onCreate(callback: LifecycleCallback): void {
        this.onCreateCallback = callback;
    }

    callCreate(selfInstance: ActorInstance): void {
        this.onCreateCallback(selfInstance);
    }

    get hasStep(): boolean {
        return !!this.onStepCallback;
    }

    onStep(callback: LifecycleCallback): void {
        this.onStepCallback = callback;
    }

    callStep(selfInstance: ActorInstance): void {
        this.onStepCallback(selfInstance);
    }

    get hasDestroy(): boolean {
        return !!this.onDestroyCallback;
    }

    onDestroy(callback: LifecycleCallback): void {
        this.onDestroyCallback = callback;
    }

    callDestroy(selfInstance: ActorInstance): void {
        this.onDestroyCallback(selfInstance);
    }

    get hasClick(): boolean {
        return !!this.onClickCallback;
    }

    onClick(callback: ClickEventCallback): void {
        this.onClickCallback = callback;
    }

    callClickCallback(selfInstance: ActorInstance, event: ClickEvent): void {
        this.onClickCallback(selfInstance, event);
    }

    onCollide(actorName: string, callback: CollisionCallback): void {
        this.collisionHandlers[actorName] = callback;
    }

    onEvent(eventName: string, callback: ActorEventCallback): void {
        this.actorEventHandlers[eventName] = callback;
    }
}

export class ActorInstance {
    private state: ActorState;

    previousX: number;
    previousY: number;
    speed: number = 0;
    direction: number = Direction.Right;

    readonly spriteAnimation: SpriteAnimation;

    constructor(public parent: Actor, public id: number, public x: number = 0, public y: number = 0) {
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

    get sprite(): Sprite {
        return this.parent.sprite;
    }

    raiseEvent(eventName: string, eventArgs?: any): void {
        // register an event to fire immediately
        this.raiseEventWhen(eventName, () => true, eventArgs);
    }

    raiseEventWhen(eventName: string, conditionCallback: () => boolean, eventArgs: any = {}): void {
        this.setGameContextEventArgs(eventArgs);

        let callback: ActorEventCallback = this.parent.actorEventHandlers[eventName];

        if (!callback) {
            throw new Error(`Attempting to raise undefined Event: ${eventName}`);
        }

        DeferredEvent.register(new DeferredEvent(conditionCallback, callback.bind(null, this, eventArgs)));
    }

    private setGameContextEventArgs(eventArgs: any): void {
        eventArgs.game = {
            currentRoom: Vastgame.getContext().room,
        };
    }

    destroy(): void {
        this.state = ActorState.Destroyed;
    }

    doPostStep(): void {
        this.previousX = this.x;
        this.previousY = this.y;
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
