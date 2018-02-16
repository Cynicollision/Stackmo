import { ActorInstance, ActorInstanceDrawEvent } from './actor-instance';
import { Boundary } from './boundary';
import { PointerInputEvent } from './input';
import { Sprite } from './sprite';
import { Vastgame } from './vastgame';

export interface ActorLifecycle {
    onCreate: LifecycleCallback;
    onStep: LifecycleCallback;
    onDestroy: LifecycleCallback;
}

export interface LifecycleCallback {
    (self: ActorInstance): void;
}

export interface ActorEventCallback {
    (self?: ActorInstance, eventArgs?: any): void;
}

export interface ActorOptions {
    boundary?: Boundary;
    sprite?: Sprite;
}

interface ClickEventCallback {
    (self: ActorInstance, event: PointerInputEvent): void;
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
    private onDrawCallback: ActorInstanceDrawEvent;

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

    setGameContextEventArgs(eventArgs: any): void {
        eventArgs.game = {
            currentRoom: Vastgame.getContext().getCurrentRoom(),
        };
    }

    // create
    onCreate(callback: LifecycleCallback): void {
        this.onCreateCallback = callback;
    }

    callCreate(selfInstance: ActorInstance): void {
        if (this.onCreateCallback) {
            this.onCreateCallback(selfInstance);
        }
    }

    // step
    step(selfInstance: ActorInstance) {
        if (this.onStepCallback) {
            this.onStepCallback(selfInstance);
        }

        selfInstance.previousX = selfInstance.x;
        selfInstance.previousY = selfInstance.y;
    }

    onStep(callback: LifecycleCallback): void {
        this.onStepCallback = callback;
    }

    // draw
    onDraw(callback: ActorInstanceDrawEvent): void {
        this.onDrawCallback = callback;
    }

    callDraw(selfInstance: ActorInstance): void {
        if (this.onDrawCallback) {
            this.onDrawCallback(selfInstance);
        }
    }

    // click/tap
    onClick(callback: ClickEventCallback): void {
        this.onClickCallback = callback;
    }

    callClick(selfInstance: ActorInstance, event: PointerInputEvent): void {
        if (this.onClickCallback) {
            this.onClickCallback(selfInstance, event);
        }
    }

    // destroy
    onDestroy(callback: LifecycleCallback): void {
        this.onDestroyCallback = callback;
    }

    callDestroy(selfInstance: ActorInstance): void {
        if (this.onDestroyCallback) {
            this.onDestroyCallback(selfInstance);
        }
    }

    // collisions and other events
    onCollide(actorName: string, callback: CollisionCallback): void {
        this.collisionHandlers[actorName] = callback;
    }

    onEvent(eventName: string, callback: ActorEventCallback): void {
        this.actorEventHandlers[eventName] = callback;
    }
}
