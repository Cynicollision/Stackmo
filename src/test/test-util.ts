import { Actor, ActorInstance, ActorOptions } from './../engine/actor';
import { Boundary } from './../engine/boundary';

export class ActorBuilder {

    private static currentInstanceID = 1;

    static newInstance(x?, y?, options?: ActorOptions): ActorInstance {
        let actorName = 'TestActor' + ActorBuilder.currentInstanceID;
        let actor = Actor.define(actorName, options);

        return new ActorInstance(actor, ActorBuilder.currentInstanceID++, x, y);
    }
}