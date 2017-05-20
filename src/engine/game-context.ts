import { Actor } from './actor';

// TODO: add current room, remove from GameRunner
export class GameContext {
    private actorMap = new Map<string, Actor>();

    defineActor(name: string, actor: Actor): void {
        if (this.actorMap.has(name)) {
            throw new Error(`Actor ${name} has already been defined.`);
        }

        this.actorMap.set(name, actor);
    }

    getActor(name: string): Actor {
        if (!this.actorMap.has(name)) {
            throw new Error(`Actor ${name} has not been defined.`);
        }

        return this.actorMap.get(name);
    }
}