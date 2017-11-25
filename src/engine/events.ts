import { Vastgame } from './vastgame';

export class DeferredEvent {

    static register(event: DeferredEvent): void {
        Vastgame.getContext().registerEvent(event);
    }

    constructor(
        public readonly conditionCallback: () => boolean,
        public readonly actionCallback: () => any,
        public readonly fireOnce: boolean = true) {
    }
}