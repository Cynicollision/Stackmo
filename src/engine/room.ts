import { Actor } from './actor';
import { ActorInstance } from './actor-instance';
import { ClickEvent } from './input';
import { GameLifecycleCallback } from './runner';
import { Util } from './util';

export class Room {

    private static nextActorInstanceID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();

    static define(): Room {
        return new Room();
    }

    private readonly actorInstanceMap = new Map<number, ActorInstance>();

    _onStart: GameLifecycleCallback;

    onStart(callback: GameLifecycleCallback): void {
        this._onStart = callback;
    }

    step(): void {

        this.getInstances().forEach(instance => {
            let parent = instance.parent;
            let hasCollisionHandler = !!parent.collisionHandlers.size;

            if (instance.isActive) {
                // apply actor movement
                if (instance.speed !== 0) {
                    instance.doMovement();
                }

                // call collision handlers
                if (hasCollisionHandler) {
                    this.checkCollisions(instance);
                }

                // call actor 'step' callbacks
                if (instance._onStep) {
                    instance._onStep(instance);
                }
            }
            else {
                // destroy instance
                instance.parent.destroyInstance(instance.id);
                this.actorInstanceMap.delete(instance.id);
            }
        });
    }

    private checkCollisions(selfInstance: ActorInstance): void {
        let parent = selfInstance.parent;
        
        Util.arrayFromMap(parent.collisionHandlers).forEach(kvp => {
            let [otherActor, callback] = kvp;

            otherActor.instanceMap.forEach(other => {
                if (selfInstance !== other && selfInstance.collidesWith(other)) {
                    callback(selfInstance, other);
                }
            });
        });
    }

    createActor(actorConfig: Actor, x?: number, y?: number): ActorInstance {
        let newActorInstanceID = Room.nextActorInstanceID();
        let newInstance: ActorInstance = actorConfig.createInstance(newActorInstanceID, x, y);

        this.actorInstanceMap.set(newActorInstanceID, newInstance);

        return newInstance;
    }

    getInstances(): ActorInstance[] {
        return Util.valuesFromMap(this.actorInstanceMap);
    }

    handleClick(event: ClickEvent): void {
        this.getInstances().forEach(instance => {
            let onClick = instance.parent._onClick;

            if (onClick && instance.occupiesPosition(event.x, event.y)) {
                onClick(instance, event);
            }
        });
    }
}
