import { Actor } from './../../engine/actor';
import { ActorInstance } from './../../engine/actor-instance';
import { Boundary } from './../../engine/boundary';
import { GameCanvasContext } from './../../engine/canvas';
import { PointerInputEvent } from './../../engine/input';
import { Room, Background, RoomBehavior } from './../../engine/room';
import { FakeCanvasContext } from './../test-util';

class TestRoomBehavior implements RoomBehavior {
    preHandleClickCalled = false;
    postHandleClickCalled = false;
    postStepCalled = false;
    preDrawCalled = false;

    preHandleClick(event: PointerInputEvent): void {
        this.preHandleClickCalled = true;
    }
    postHandleClick(event: PointerInputEvent): void {
        this.postHandleClickCalled = true;
    }
    postStep(self: Room): void {
        this.postStepCalled = true;
    }
    preDraw(self: Room, canvasContext: GameCanvasContext): void {
        this.preDrawCalled = true;
    }
}

describe('Room', () => {
    let TestRoom: Room = Room.define('Room_TestRoom');
    let TestActor: Actor = Actor.define('Room_TestActor');
    let AlternateActor: Actor = Actor.define('Room_TestActor2');

    afterEach(() => {
        TestRoom.end();
    });

    it('can store Room-level properties by name', () => {
        TestRoom.set('someProp', { score: 123 });
        expect(TestRoom.get('someProp').score).toBe(123);
    });

    it('can set a background', () => {
        TestRoom.setBackground('#000', 640, 400, '#111');
        expect(TestRoom.background.color).toBe('#000');
        expect(TestRoom.background.width).toBe(640);
        expect(TestRoom.background.height).toBe(400);
        expect(TestRoom.background.pageColor).toBe('#111');
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

    it('can get actor instances at a given position', () => {
        TestActor.boundary = new Boundary(20, 20);
        AlternateActor.boundary = new Boundary(20, 20);

        let testInstance1 = TestRoom.createActor('Room_TestActor', 0, 0);
        let testInstance2 = TestRoom.createActor('Room_TestActor2', 5, 5);

        expect(TestRoom.getInstancesAtPosition(10, 10).length).toBe(2);
    });

    describe('can determine if a given position is free', () => {

        let testInstance1: ActorInstance;
        let testInstance2: ActorInstance;

        beforeEach(() => {
            TestActor.boundary = new Boundary(20, 20);
            AlternateActor.boundary = new Boundary(20, 20);

            testInstance1 = TestRoom.createActor('Room_TestActor', 0, 0);
            testInstance2 = TestRoom.createActor('Room_TestActor2', 5, 5);
        });

        afterEach(() => {
            TestActor.boundary = null;
            AlternateActor.boundary = null;
        });

        it('of any actor instances', () => {
            expect(TestRoom.isPositionFree(10, 10)).toBe(false);
            expect(TestRoom.isPositionFree(30, 30)).toBe(true);
        });

        it('of any actor instances of specific types', () => {
           expect(TestRoom.isPositionFree(3, 3, [TestActor])).toBe(false);
           expect(TestRoom.isPositionFree(3, 3, [AlternateActor])).toBe(true);
        });
    });

    describe('on start', () => {

        it('catches errors in user-defined functionality', () => {
            TestRoom.onStart(() =>  { throw 'For testing'; });

            function testStart() {
                TestRoom._callStart();
            }

            expect(testStart).toThrow('Room: Room_TestRoom.start');
        });
    });

    describe('on step', () => {

        it('releases destroyed actors', () => {
            let testInstance: ActorInstance = TestRoom.createActor('Room_TestActor');

            testInstance.destroy();
            TestRoom.step();

            let instances = TestRoom.getInstances();
            expect(instances.some(instance => instance.id === testInstance.id)).toBe(false);
        });

        it('applies actor instance movement for instances that have moved', () => {
            let testInstance: ActorInstance = TestRoom.createActor('Room_TestActor');
            let originalX = testInstance.x;
            testInstance.speed = 10;

            TestRoom.step();

            expect(testInstance.x).toBeGreaterThan(originalX);
            originalX = testInstance.x;
            testInstance.speed = 0;

            TestRoom.step();

            expect(testInstance.x).toEqual(originalX);
        });

        it('calls behaviors\'s post-step functionality', () => {
            let testBehavior = new TestRoomBehavior();
            TestRoom.use(testBehavior);
            
            TestRoom.step();

            expect(testBehavior.postStepCalled).toBe(true);
        });

        it('catches errors in user-defined collision handlers', () => {
            TestActor.boundary = new Boundary(20, 20);
            AlternateActor.boundary = new Boundary(20, 20);
            TestActor.onCollide(AlternateActor.name, () =>  { throw 'For testing'; });

            let testInstance1: ActorInstance = TestRoom.createActor('Room_TestActor');
            let testInstance2: ActorInstance = TestRoom.createActor('Room_TestActor2');

            testInstance1.x = testInstance2.x;
            testInstance1.y = testInstance2.y;

            function testCollision() {
                TestRoom.step();
            }

            expect(testCollision).toThrow(`Actor: Room_TestRoom[${testInstance1.id}].collision(Room_TestActor2)`);
        });
    });

    describe('on draw', () => {
        
        it('calls behaviors\'s pre-draw functionality', () => {
            let testBehavior = new TestRoomBehavior();
            TestRoom.use(testBehavior);

            TestRoom.draw(new FakeCanvasContext());

            expect(testBehavior.preDrawCalled).toBe(true);
        });

        it('catches errors in user-defined functionality', () => {
            TestRoom.onDraw(() =>  { throw 'For testing'; });

            function testDraw() {
                TestRoom._callDraw();
            }

            expect(testDraw).toThrow('Room: Room_TestRoom.draw');
        });
    });

    afterEach(() => {
        TestActor.onCollide(AlternateActor.name, null);
        TestActor.boundary = null;
        AlternateActor.boundary = null;
    });
});
