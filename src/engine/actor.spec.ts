import { Actor, ActorInstance } from './actor';
import { Direction } from './enum';
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
        testInstance = testRoom.createActor(TestActor, 0, 0);
    });

    it('tracks instances of the Actor', () => {
        expect(TestActor.instances[0]).toBe(testInstance);
    });

    it('the parent of its instances', () => {
        expect(testInstance.parent).toBe(TestActor);
    });

    describe('when applying motion', () => {

        it('changes relative x position when there is speed', () => {
            testInstance.direction = Direction.Right;
            testInstance.speed = 2;
            testInstance.doMovement();
            
            expect(testInstance.hasMoved).toBe(true);
            expect(testInstance.x > 0).toBe(true);
        });

        it('does not change relative x position when there is no speed', () => {
            testInstance.direction = Direction.Right

            testInstance.speed = 0;
            testInstance.doMovement();
            
            expect(testInstance.hasMoved).toBe(false);
            expect(testInstance.x).toBe(0);
        });
    });
});
