import { Actor, ActorInstance, ActorOptions } from './../engine/actor';
import { Boundary } from './../engine/boundary';
import { Room } from './../engine/room';
import { Vastgame } from './../engine/vastgame';

export class ActorBuilder {
    private static currentInstanceID = 1;
    private static testRoom = new Room();

    static newInstance(x?: number, y?: number, options?: ActorOptions): ActorInstance {
        let actorName = 'TestActor' + ActorBuilder.currentInstanceID;
        let actor = Actor.define(actorName, options);

        return new ActorInstance(this.testRoom, actor, ActorBuilder.currentInstanceID++, x, y);
    }

    static newInstanceOf(actor: Actor, x?: number, y?: number, options?: ActorOptions): ActorInstance {
        return new ActorInstance(this.testRoom, actor, ActorBuilder.currentInstanceID++, x, y);
    }
}