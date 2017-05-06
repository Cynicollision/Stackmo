
interface LifecycleCallback {
    (self: ActorInstance): void;
}

export class ActorInstance {

    constructor(id: number) {
        this.id = id;
    }

    id: number;
    
    onCreate: LifecycleCallback;
    onStep: LifecycleCallback;
    onDestroy: LifecycleCallback;
}

export class Actor {
    private create: LifecycleCallback;
    private step: LifecycleCallback;
    private destroy: LifecycleCallback;

    onCreate(create: LifecycleCallback): void {
        this.create = create;
    }

    onStep(step: LifecycleCallback): void {
        this.step = step;
    }

    onDestroy(destroy: LifecycleCallback): void {
        this.destroy = destroy;
    }

    getInstance(id: number): ActorInstance {
        let actor = new ActorInstance(id);
        actor.onCreate = this.create;
        actor.onStep = this.step;

        return actor;
    }
 }