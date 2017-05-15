import { Actor } from './actor';
import { ActorInstance } from './actor-instance';
import { Room } from './room';

describe('Room', () => {
    let TestActor: Actor;
    let testInstance: ActorInstance;
    let testRoom: Room;

    beforeEach(() => {
        TestActor = buildTestActorWithLifecycle();
        testRoom = new Room();

        testInstance = testRoom.createActor(TestActor);
    });

    it('instantiates actors with numeric IDs and tracks instances', () => {
        let instances = testRoom.getInstances();

        expect(instances.some(instance => instance.id === testInstance.id)).toBe(true);
        expect(testInstance.id).toBe(1);
        expect(testRoom.createActor(TestActor).id).toBe(2);
    });

    describe('on step', () => {

        it('releases destroyed actors', () => {
            testInstance.destroy();
            testRoom.step();

            let instances = testRoom.getInstances();
            expect(instances.some(instance => instance.id === testInstance.id)).toBe(false);
        });
    });
});

function buildTestActorWithLifecycle(): Actor {
    let actor = new Actor();

    actor.onCreate(() => null);
    actor.onStep(() => null);
    actor.onDestroy(() => null);

    return actor;
}