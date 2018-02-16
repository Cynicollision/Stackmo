import { Actor } from './../../engine/actor';
import { ActorInstance } from './../../engine/actor-instance';
import { Room } from './../../engine/room';

describe('Room', () => {
    let TestRoom: Room = Room.define('Room_TestRoom');
    let TestActor: Actor = Actor.define('Room_TestActor');
    let AlternateActor: Actor = Actor.define('Room_TestActor2');

    afterEach(() => {
        TestRoom.end();
    });

    it('instantiates actors with numeric IDs and tracks instances', () => {
        let testInstance1: ActorInstance = TestRoom.createActor('Room_TestActor');
        let instances = TestRoom.getInstances();

        expect(instances.some(instance => instance.id === testInstance1.id)).toBe(true);
        expect(testInstance1.id).toBeGreaterThanOrEqual(1);
        expect(TestRoom.createActor('Room_TestActor').id).toBe(testInstance1.id + 1);
        expect(TestRoom.createActor('Room_TestActor').id).toBe(testInstance1.id + 2);
    });

    it('can return all actor instances', () => {
        let testInstance1: ActorInstance = TestRoom.createActor('Room_TestActor');
        let testInstance2: ActorInstance = TestRoom.createActor('Room_TestActor2');
        let testInstance3: ActorInstance = TestRoom.createActor('Room_TestActor2');

        expect(TestRoom.getInstances().length).toBe(3);
    });

    it('can return actor instances of a given type', () => {
        let testInstance1: ActorInstance = TestRoom.createActor('Room_TestActor');
        let testInstance2: ActorInstance = TestRoom.createActor('Room_TestActor2');
        let testInstance3: ActorInstance = TestRoom.createActor('Room_TestActor2');

        expect(TestRoom.getInstances([AlternateActor]).length).toBe(2);
    });

    it('can return a single actor instance by the given type', () => {
        let testInstance1: ActorInstance = TestRoom.createActor('Room_TestActor');
        let testInstance2: ActorInstance = TestRoom.createActor('Room_TestActor2');
        let testInstance3: ActorInstance = TestRoom.createActor('Room_TestActor2');

        expect(TestRoom.getInstance(TestActor)).toBe(testInstance1);
    });

    describe('on step', () => {

        it('releases destroyed actors', () => {
            let testInstance1: ActorInstance = TestRoom.createActor('Room_TestActor');

            testInstance1.destroy();
            TestRoom.step();

            let instances = TestRoom.getInstances();
            expect(instances.some(instance => instance.id === testInstance1.id)).toBe(false);
        });

        it('applies actor instance movement for instances that have moved', () => {
            let testInstance1: ActorInstance = TestRoom.createActor('Room_TestActor');
            let originalX = testInstance1.x;
            testInstance1.speed = 10;

            TestRoom.step();

            expect(testInstance1.x).toBeGreaterThan(originalX);
            originalX = testInstance1.x;
            testInstance1.speed = 0;

            TestRoom.step();

            expect(testInstance1.x).toEqual(originalX);
        });
    });
});
