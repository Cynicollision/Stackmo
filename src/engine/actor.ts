import { Sprite } from './sprite';

interface CollisionCollback {
    (self: ActorInstance, other: ActorInstance): void;
}

interface LifecycleCallback {
    (self: ActorInstance): void;
}

export interface ActorOptions {
    typeName?: string;
    sprite?: Sprite;
}

export class ActorInstance {
    id: number;
    parent: Actor;
    
    create: LifecycleCallback;
    step: LifecycleCallback;
    destroy: LifecycleCallback;

    x: number = 0;
    y: number = 0;

    get sprite(): Sprite {
        return this.parent.sprite;
    }

    constructor(source: Actor, id: number) {
        this.parent = source;
        this.id = id;
    }
}

export class Actor {

    static define(options?: ActorOptions): Actor {
        return new Actor(options);
    }

    private create: LifecycleCallback;
    private step: LifecycleCallback;
    private destroy: LifecycleCallback;
    private collisionHandlers: CollisionCollback[] = [];

    readonly instances: ActorInstance[] = [];
    readonly typeName: string;
    readonly sprite: Sprite;

    constructor(options?: ActorOptions) {
        options = options || {};

        this.typeName = options.typeName;
        this.sprite = options.sprite;
    }

    onCreate(create: LifecycleCallback): void {
        this.create = create;
    }

    onStep(step: LifecycleCallback): void {
        this.step = step;
    }

    onDestroy(destroy: LifecycleCallback): void {
        this.destroy = destroy;
    }

    onCollide(collision: CollisionCollback): void {
        this.collisionHandlers.push(collision);
    }

    createInstance(id: number): ActorInstance {
        let actor = this.newActorInstance(id);
        this.instances.push(actor);

        return actor;
    }

    private newActorInstance(id: number): ActorInstance {
        let actor = new ActorInstance(this, id);
        actor.create = this.create;
        actor.step = this.step;
        actor.destroy = this.destroy;

        return actor;
    }
 }