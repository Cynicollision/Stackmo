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
        Vastgame._getContext().defineActor(name, actor);

        return actor;
    }

    static get(name: string): Actor {
        return Vastgame._getContext().getActor(name);
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

    readonly name: string;
    sprite: Sprite;
    boundary: Boundary;

    constructor(name: string, options: ActorOptions = {}) {
        this.boundary = options.boundary;
        this.name = name;
        this.sprite = options.sprite;
    }

    setGameContextEventArgs(eventArgs: any): void {
        eventArgs.game = {
            currentRoom: Vastgame._getContext().getCurrentRoom(),
        };
    }

    // create
    onCreate(callback: LifecycleCallback): void {
        this.onCreateCallback = callback;
    }

    _callCreate(selfInstance: ActorInstance): void {
        if (this.onCreateCallback) {
            try {
                this.onCreateCallback(selfInstance);
            }
            catch {
                throw `Actor: ${selfInstance.parent.name}[${selfInstance.id}].create`;
            }
        }
    }

    // step
    onStep(callback: LifecycleCallback): void {
        this.onStepCallback = callback;
    }

    _callStep(selfInstance: ActorInstance) {
        if (this.onStepCallback) {
            try {
                this.onStepCallback(selfInstance);
            }
            catch {
                throw `Actor: ${selfInstance.parent.name}[${selfInstance.id}].step`;
            }
        }

        selfInstance.previousX = selfInstance.x;
        selfInstance.previousY = selfInstance.y;
    }

    // draw
    onDraw(callback: ActorInstanceDrawEvent): void {
        this.onDrawCallback = callback;
    }

    _callDraw(selfInstance: ActorInstance): void {
        if (this.onDrawCallback) {
            try {
                this.onDrawCallback(selfInstance);
            }
            catch {
                throw `Actor: ${selfInstance.parent.name}[${selfInstance.id}].draw`;
            }
        }
    }

    // click/tap
    onClick(callback: ClickEventCallback): void {
        this.onClickCallback = callback;
    }

    _callClick(selfInstance: ActorInstance, event: PointerInputEvent): void {
        if (this.onClickCallback) {
            try {
                this.onClickCallback(selfInstance, event);
            }
            catch {
                throw `Actor: ${selfInstance.parent.name}[${selfInstance.id}].click`;
            }
        }
    }

    // destroy
    onDestroy(callback: LifecycleCallback): void {
        this.onDestroyCallback = callback;
    }

    _callDestroy(selfInstance: ActorInstance): void {
        if (this.onDestroyCallback) {
            try {
                this.onDestroyCallback(selfInstance);
            }
            catch {
                throw `Actor: ${selfInstance.parent.name}[${selfInstance.id}].destroy`;
            }
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