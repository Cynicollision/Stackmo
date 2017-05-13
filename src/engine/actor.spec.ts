import { Actor, ActorInstance } from './actor';
import { Room } from './room';

describe('Actor', () => {

    let TestActor: Actor;
    let testInstance: ActorInstance;
    let testRoom: Room;

    beforeEach(() => {
        TestActor = new Actor({
            typeName: 'testActor',
        });

        testRoom = new Room();
        testInstance = testRoom.createActor(TestActor);
    });

    it('tracks instances of the Actor', () => {
        expect(TestActor.instances[0]).toBe(testInstance);
    });

    it('the parent of its instances', () => {
        expect(testInstance.parent).toBe(TestActor);
    })
});
