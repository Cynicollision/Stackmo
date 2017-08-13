import { GameContext } from './game-context';

export class DeferredEvent {

    static register(event: DeferredEvent): void {
        GameContext.registerEvent(event);
    }

    constructor(
        public readonly conditionCallback: () => boolean,
        public readonly actionCallback: () => any,
        public readonly fireOnce: boolean = true) {
    }
}