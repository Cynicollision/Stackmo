import { Actor } from './actor';
import { ActorInstance } from './actor-instance';
import { Direction } from './enum';

describe('Actor', () => {

    let TestActor: Actor;
    let testInstance: ActorInstance;

    beforeEach(() => {
        TestActor = new Actor('TestActor');
        TestActor.onDestroy(() => null);

        testInstance = TestActor.createInstance(0, 0, 0);
    });

    it('tracks instances of the Actor', () => {
        expect(TestActor.instanceMap.has(testInstance.id)).toBe(true);
    });

    it('destroys an instance by id and calls the lifecycle callback', () => {
        let onDestroySpy = spyOn(testInstance, '_onDestroy').and.callThrough();

        TestActor.destroyInstance(testInstance.id);
        
        expect(TestActor.instanceMap.has(testInstance.id)).toBe(false);
        expect(onDestroySpy).toHaveBeenCalled();
    });
});
