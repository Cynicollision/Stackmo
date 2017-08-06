import { Actor, ActorInstance } from './../../engine/actor';
import { Room } from './../../engine/room';

describe('Room', () => {
    let TestActor: Actor;
    let testInstance1: ActorInstance;
    let testRoom: Room;

    beforeEach(() => {
        TestActor = buildTestActorWithLifecycle();
        testRoom = new Room();

        testInstance1 = testRoom.createActor(TestActor);
    });

    it('instantiates actors with numeric IDs and tracks instances', () => {
        let instances = testRoom.getInstances();

        expect(instances.some(instance => instance.id === testInstance1.id)).toBe(true);
        expect(testInstance1.id).toBe(1);
        expect(testRoom.createActor(TestActor).id).toBe(2);
    });

    describe('on step', () => {

        it('releases destroyed actors', () => {
            testInstance1.destroy();
            testRoom.step();

            let instances = testRoom.getInstances();
            expect(instances.some(instance => instance.id === testInstance1.id)).toBe(false);
        });
    });
});

function buildTestActorWithLifecycle(): Actor {
    let actor = new Actor('TestActor');

    actor.onCreate(() => null);
    actor.onStep(() => null);
    actor.onDestroy(() => null);

    return actor;
}