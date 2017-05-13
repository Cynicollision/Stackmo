
interface CollisionCollback {
    (self: ActorInstance, other: ActorInstance): void;
}

interface LifecycleCallback {
    (self: ActorInstance): void;
}

export class ActorInstance {
    id: number;
    source: Actor;
    
    create: LifecycleCallback;
    step: LifecycleCallback;
    destroy: LifecycleCallback;

    constructor(source: Actor, id: number) {
        this.source = source;
        this.id = id;
    }
}

export class Actor {

    static define(): Actor {
        return new Actor();
    }

    private create: LifecycleCallback;
    private step: LifecycleCallback;
    private destroy: LifecycleCallback;

    private instances: ActorInstance[] = [];

    collisionHandlers: CollisionCollback[] = [];

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
        let actor = new ActorInstance(this, id);
        actor.create = this.create;
        actor.step = this.step;
        actor.destroy = this.destroy;

        this.instances.push(actor);

        return actor;
    }
 }