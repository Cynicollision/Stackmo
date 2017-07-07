import { Boundary } from './boundary';
import { ClickEvent } from './canvas';
import { Direction } from './enum';
import { Sprite } from './sprite';
import { Util } from './util';
import { Vastgame } from './vastgame';

export interface ActorLifecycle {
    onCreate: LifecycleCallback;
    onStep: LifecycleCallback;
    onDestroy: LifecycleCallback;
}

export interface LifecycleCallback {
    (self: ActorInstance): void;
}

export enum ActorState {
    Active = 1,
    Destroyed = 2,
}

export interface ActorOptions {
    boundary?: Boundary;
    sprite?: Sprite;
}

interface ClickEventCallback {
    (self: ActorInstance, event: ClickEvent): void;
}

interface CollisionCallback {
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

    private _onCreate: LifecycleCallback;
    private _onStep: LifecycleCallback;
    private _onDestroy: LifecycleCallback;

    readonly collisionHandlers: Map<string, CollisionCallback>;
    readonly instanceMap: Map<number, ActorInstance>;

    readonly boundary: Boundary;
    readonly name: string;
    readonly sprite: Sprite;

    _onClick: ClickEventCallback;

    constructor(name: string, options: ActorOptions = {}) {
        this.boundary = options.boundary;
        this.name = name;
        this.sprite = options.sprite;

        this.collisionHandlers = new Map<string, CollisionCallback>();
        this.instanceMap = new Map<number, ActorInstance>();
    }

    onCreate(callback: LifecycleCallback): void {
        this._onCreate = callback;
    }

    onStep(callback: LifecycleCallback): void {
        this._onStep = callback;
    }

    onDestroy(callback: LifecycleCallback): void {
        this._onDestroy = callback;
    }

    onCollide(actorName: string, callback: CollisionCallback): void {
        this.collisionHandlers.set(actorName, callback);
    }

    onClick(callback: ClickEventCallback): void {
        this._onClick = callback;
    }

    createInstance(id: number, x?: number, y?: number): ActorInstance {
        let newInstance = this.newActorInstance(id, x, y);
        this.instanceMap.set(id, newInstance);

        if (newInstance._onCreate) {
            newInstance._onCreate(newInstance);   
        }

        return newInstance;
    }

    destroyInstance(id: number): void {
        let instance = this.instanceMap.get(id);

        if (!instance) {
            throw new Error('destroyInstance called with invalid instance ID.');
        }

        this.instanceMap.delete(id);

        if (instance._onDestroy) {
            instance._onDestroy(instance);
        }
    }

    private newActorInstance(id: number, x: number = 0, y: number = 0): ActorInstance {

        let actor = new ActorInstance(this, id, x, y, {
            onCreate: this._onCreate,
            onStep: this._onStep,
            onDestroy: this._onDestroy,
        });

        return actor;
    }
}

export class ActorInstance {
    private state: ActorState;

    _onCreate: LifecycleCallback;
    _onStep: LifecycleCallback;
    _onDestroy: LifecycleCallback;

    previousX: number;
    previousY: number;
    speed: number = 0;
    direction: number = Direction.Right;

    constructor(public parent: Actor, public id: number, public x: number, public y: number, lifecycle: ActorLifecycle) {
        this._onCreate = lifecycle.onCreate;
        this._onStep = lifecycle.onStep;
        this._onDestroy = lifecycle.onDestroy;
        
        this.state = ActorState.Active;
        this.previousX = this.x;
        this.previousY = this.y;
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

    destroy(): void {
        this.state = ActorState.Destroyed;
    }

    onPostStep(): void {
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
        return Util.Math.getLengthDirectionX(this.speed * 100, this.direction) / 100;
    }

    getMovementOffsetY(): number {
        return Util.Math.getLengthDirectionY(this.speed * 100, this.direction) / 100;
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

    occupiesPosition(x: number, y: number): boolean {
        return this.boundary ? this.boundary.atPosition(this.x, this.y).containsPosition(x, y) : false;
    }
}
