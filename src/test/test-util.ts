import { Actor, ActorOptions } from './../engine/actor';
import { ActorInstance } from './../engine/actor-instance';
import { Boundary } from './../engine/boundary';
import { GameCanvasContext } from './../engine/canvas';
import { Room } from './../engine/room';
import { Vastgame } from './../engine/vastgame';

export class ActorBuilder {
    private static currentInstanceID = 1;
    static TestRoom = Room.define('testRoom');

    static newInstance(x?: number, y?: number, options?: ActorOptions): ActorInstance {
        let actorName = 'TestActor' + ActorBuilder.currentInstanceID;
        let actor = Actor.define(actorName, options);

        return new ActorInstance(this.TestRoom, actor, ActorBuilder.currentInstanceID++, x, y);
    }
}

export class FakeCanvasContext implements GameCanvasContext {
    origin: [number, number];
    clear(): void {
    }
    fill(width: number, height: number, color: string): void {
    }
    fillArea(x: number, y: number, width: number, height: number, color: string): void {
    }
    drawImage(image: HTMLImageElement, srcX: number, srcY: number, destX: number, destY: number, width: number, height: number, options?: any): void {
    }
}