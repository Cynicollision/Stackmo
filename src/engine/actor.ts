import { ActorInstance } from './actor-instance';
import { Boundary } from './boundary';
import { Direction } from './enum';
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
    typeName?: string;
}

interface CollisionCollback {
    (self: ActorInstance, other: ActorInstance): void;
}

export class Actor {

    static define(options?: ActorOptions): Actor {
        return new Actor(options);
    }

    private _onCreate: LifecycleCallback;
    private _onStep: LifecycleCallback;
    private _onDestroy: LifecycleCallback;
    readonly collisionHandlers: Map<Actor, CollisionCollback>;
    readonly instanceMap: Map<number, ActorInstance>;

    readonly boundary: Boundary;
    readonly typeName: string;
    readonly sprite: Sprite;

    constructor(options?: ActorOptions) {
        options = options || {};

        this.boundary = options.boundary;
        this.sprite = options.sprite;
        this.typeName = options.typeName;

        this.collisionHandlers = new Map<Actor, CollisionCollback>();
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

    onCollide(actor: Actor, callback: CollisionCollback): void {
        this.collisionHandlers.set(actor, callback);
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
