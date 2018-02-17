import { ActorInstance, ActorLifecycleDrawCallback } from './actor-instance';
import { Boundary } from './boundary';
import { PointerInputEvent } from './input';
import { Sprite } from './sprite';
import { Vastgame } from './vastgame';

export interface ActorLifecycle {
    onCreate: ActorLifecycleCallback;
    onStep: ActorLifecycleCallback;
    onDestroy: ActorLifecycleCallback;
}

export interface ActorLifecycleCallback {
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
    private onCreateCallback: ActorLifecycleCallback;
    private onStepCallback: ActorLifecycleCallback;
    private onDestroyCallback: ActorLifecycleCallback;
    private onDrawCallback: ActorLifecycleDrawCallback;

    // input callbacks
    private onClickCallback: ClickEventCallback;

    // game event handlers
    readonly collisionHandlers: { [index: string]: CollisionCallback } = {};
    readonly actorEventHandlers: { [index: string] : ActorEventCallback } = {};

    readonly name: string;
    sprite: Sprite;
    boundary: Boundary;

    constructor(name: string, options: ActorOptions = {}) {
        this.name = name;
        this.sprite = options.sprite;

        if (options.boundary) {
            this.boundary = options.boundary
        }
        else if (options.sprite) {
            this.boundary = Boundary.fromSprite(options.sprite);
        }
    }

    setGameContextEventArgs(eventArgs: any): void {
        eventArgs.game = {
            currentRoom: Vastgame._getContext().getCurrentRoom(),
        };
    }

    // create
    onCreate(callback: ActorLifecycleCallback): Actor {
        this.onCreateCallback = callback;
        return this;
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
    onStep(callback: ActorLifecycleCallback): Actor {
        this.onStepCallback = callback;
        return this;
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
    onDraw(callback: ActorLifecycleDrawCallback): Actor {
        this.onDrawCallback = callback;
        return this;
    }

    _callDraw(selfInstance: ActorInstance): void {
        if (this.onDrawCallback) {
            let canvasContext = Vastgame._getContext().getCanvasContext();
            try {
                this.onDrawCallback(selfInstance, canvasContext);
            }
            catch {
                throw `Actor: ${selfInstance.parent.name}[${selfInstance.id}].draw`;
            }
        }
    }

    // click/tap
    onClick(callback: ClickEventCallback): Actor {
        this.onClickCallback = callback;
        return this;
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
    onDestroy(callback: ActorLifecycleCallback): Actor {
        this.onDestroyCallback = callback;
        return this;
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
    onCollide(actorName: string, callback: CollisionCallback): Actor {
        this.collisionHandlers[actorName] = callback;
        return this;
    }

    onEvent(eventName: string, callback: ActorEventCallback): Actor {
        this.actorEventHandlers[eventName] = callback;
        return this;
    }
}