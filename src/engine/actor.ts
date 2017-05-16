import { ActorInstance } from './actor-instance';
import { Boundary } from './boundary';
import { Direction } from './enum';
import { ClickEvent } from './input';
import { Sprite } from './sprite';
import { Util } from './util';

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

interface ActorOptions {
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

    static define(options?: ActorOptions): Actor {
        return new Actor(options);
    }

    private _onCreate: LifecycleCallback;
    private _onStep: LifecycleCallback;
    private _onDestroy: LifecycleCallback;

    readonly collisionHandlers: Map<Actor, CollisionCallback>;
    readonly instanceMap: Map<number, ActorInstance>;

    readonly boundary: Boundary;
    readonly typeName: string;
    readonly sprite: Sprite;

    _onClick: ClickEventCallback;

    constructor(options: ActorOptions = {}) {
        this.boundary = options.boundary;
        this.sprite = options.sprite;

        this.collisionHandlers = new Map<Actor, CollisionCallback>();
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

    onCollide(actor: Actor, callback: CollisionCallback): void {
        this.collisionHandlers.set(actor, callback);
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
