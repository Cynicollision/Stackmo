import { Direction } from './enum';
import { Sprite } from './sprite';
import { Util } from './util';

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

export class ActorInstance {
    id: number;
    parent: Actor;
    
    create: LifecycleCallback;
    step: LifecycleCallback;
    destroy: LifecycleCallback;

    private previousX: number;
    private previousY: number;

    x: number = 0;
    y: number = 0;
    speed: number = 0;
    direction: number = Direction.Right;

    constructor(source: Actor, id: number) {
        this.parent = source;
        this.id = id;

        this.previousX = this.x;
        this.previousY = this.y;
    }

    get sprite(): Sprite {
        return this.parent.sprite;
    }
    
    get hasMoved(): boolean {
        return (this.x !== this.previousX || this.y !== this.previousY);
    }

    doMovement(): void {

        if (this.speed !== 0) {
            let offsetX = Math.round((Util.Math.getLengthDirectionX(this.speed, this.direction) / 1));
            let offsetY = Math.round((Util.Math.getLengthDirectionY(this.speed, this.direction) / 1));

            this.setPositionRelative(offsetX, offsetY);
        }
    }

    setPositionRelative(offsetX: number, offsetY: number): void {
        let newX = this.x + offsetX;
        let newY = this.y + offsetY;

        if (this.x !== newX) {
            this.previousX = this.x;
            this.x = newX;
        }

        if (this.y !== newY) {
            this.previousY = this.y;
            this.y = newY;
        }
    }
}
