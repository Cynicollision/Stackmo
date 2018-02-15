import { Actor } from './../../engine/actor';
import { ActorInstance } from './../../engine/actor-instance';
import { Room } from './../../engine/room';

describe('Room', () => {
    let testInstance1: ActorInstance;
    let TestRoom: Room = Room.define('Room_TestRoom');
    let TestActor: Actor = Actor.define('Room_TestActor');

    beforeEach(() => {
        testInstance1 = TestRoom.createActor('Room_TestActor');
    });

    it('instantiates actors with numeric IDs and tracks instances', () => {
        let instances = TestRoom.getInstances();

        expect(instances.some(instance => instance.id === testInstance1.id)).toBe(true);
        expect(testInstance1.id).toBeGreaterThanOrEqual(1);
        expect(TestRoom.createActor('Room_TestActor').id).toBe(testInstance1.id + 1);
        expect(TestRoom.createActor('Room_TestActor').id).toBe(testInstance1.id + 2);
    });

    describe('on step', () => {

        it('releases destroyed actors', () => {
            testInstance1.destroy();
            TestRoom.step();

            let instances = TestRoom.getInstances();
            expect(instances.some(instance => instance.id === testInstance1.id)).toBe(false);
        });
    });
});
