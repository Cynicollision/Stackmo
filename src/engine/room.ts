import { Actor, ActorInstance } from './actor';
import { GameLifecycleCallback } from './vastgame';

export class Room {

    private static nextActorInstanceID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();

    static define(): Room {
        return new Room();
    }

    private readonly actorInstances = new Map<number, ActorInstance>();

    start: GameLifecycleCallback;

    get instances(): ActorInstance[] {
        return Array.from(this.actorInstances.values());
    }

    onStart(start: GameLifecycleCallback): void {
        this.start = start;
    }

    createActor(actorConfig: Actor, x?: number, y?: number): ActorInstance {
        let newActorInstanceID = Room.nextActorInstanceID();
        let newInstance: ActorInstance = actorConfig.createInstance(newActorInstanceID);
        newInstance.x = x || 0;
        newInstance.y = y || 0;

        this.actorInstances.set(newActorInstanceID, newInstance);
            
        if (newInstance.create) {
            newInstance.create(newInstance);   
        }

        return newInstance;
    }

    step(): void {
        console.log('room.step!');

        this.instances.forEach(instance => {

            if (instance.speed !== 0) {
                instance.doMovement();
            }

            if (instance.step) {
                instance.step(instance);
            }
        });
    }
}
