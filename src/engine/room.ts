import { Actor, ActorInstance } from './actor';
import { GameLifecycleCallback } from './vastgame';

export class Room {

    private static currentActorID = 0;

    static define(): Room {
        return new Room();
    }

    private actors = new Map<number, ActorInstance>();

    start: GameLifecycleCallback;

    onStart(start: GameLifecycleCallback): void {
        this.start = start;
    }

    createActor(actorConfig: Actor, x?: number, y?: number): ActorInstance {
        let newActorID = ++Room.currentActorID;
        let newActor: ActorInstance = actorConfig.createInstance(newActorID);

        this.actors.set(newActorID, newActor);

        newActor.create(newActor);

        return newActor;
    }

    // TODO: call as part of main game loop
    step(): void {

    }
}