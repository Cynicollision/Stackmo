import { Actor, ActorInstance, ActorOptions } from './../engine/actor';
import { Boundary } from './../engine/boundary';

export class ActorBuilder {

    private static currentInstanceID = 1;

    private static newInstance(x, y, options?: ActorOptions): ActorInstance {
        let actorName = 'TestActor' + ActorBuilder.currentInstanceID;
        let actor = Actor.define(actorName, options);

        return actor.createInstance(ActorBuilder.currentInstanceID++, x, y);
    }

    static instance(x?: number, y?: number, options?: ActorOptions): ActorInstance {
        return this.newInstance(x, y, options);
    }
}