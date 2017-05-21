import { ActorInstance } from './actor-instance';
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
