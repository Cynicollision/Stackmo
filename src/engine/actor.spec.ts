import { Actor } from './actor';
import { ActorInstance } from './actor-instance';
import { Direction } from './enum';

describe('Actor', () => {

    let TestActor: Actor;
    let testInstance: ActorInstance;

    beforeEach(() => {
        TestActor = new Actor({
            typeName: 'testActor',
        });

        testInstance = TestActor.createInstance(0, 0, 0);
    });

    it('tracks instances of the Actor', () => {
        expect(TestActor.instanceMap.has(testInstance.id)).toBe(true);
    });

    it('destroys an instance by id', () => {
        TestActor.destroyInstance(testInstance.id);
        expect(TestActor.instanceMap.has(testInstance.id)).toBe(false);
    });
});
