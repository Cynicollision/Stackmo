import { Actor, ActorInstance } from './actor';
import { Room } from './room';

export interface GameLifecycleCallback {
    // TODO
    (): void;
}

export class Vastgame {

    static start(room: Room) {
        room.start();
    }
}

export * from './actor';
export * from './room';

