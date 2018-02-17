import { DeferredEvent } from './../../engine/events';
import { Vastgame } from './../../engine/vastgame';

describe('Events', () => {

    it('registering a DeferredEvent is called an disposed of appropriately', () => {
        let shouldFire: boolean;
        let condition = () => shouldFire;

        let callbackSpy = jasmine.createSpy('eventCallback');
        DeferredEvent.register(new DeferredEvent(condition, callbackSpy, true));

        shouldFire = false;
        Vastgame._getContext().checkAndFireEvents();
        expect(callbackSpy).not.toHaveBeenCalled();

        shouldFire = true;
        Vastgame._getContext().checkAndFireEvents();
        expect(callbackSpy).toHaveBeenCalled();

        Vastgame._getContext().checkAndFireEvents();
        Vastgame._getContext().checkAndFireEvents();

        expect(callbackSpy).toHaveBeenCalledTimes(1);
    });
});
