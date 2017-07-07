import { Actor, ActorInstance } from './actor';
import { Boundary } from './boundary';
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

describe('ActorInstance', () => {
    let options = { boundary: new Boundary(5, 5) };
    let TestActorA: Actor = Actor.define('TestActorA', options);
    let TestActorB: Actor = Actor.define('TestActorB', options);
    let testInstanceA: ActorInstance, testInstanceB: ActorInstance;

    beforeEach(() => {
        TestActorA.onCollide('TestActorB', (self, other) => {
        });

        testInstanceA = TestActorA.createInstance(1, 0, 0);
        testInstanceB = TestActorA.createInstance(2, 0, 0);

        testInstanceA.direction = Direction.Right;
    });

    it('is an instance of its parent Actor', () => {
        expect(testInstanceA.parent).toBe(TestActorA);
    });

    describe('when checking for collisions', () => {
        let boundarySpy: jasmine.Spy;

        beforeEach(() => {
            boundarySpy = spyOn(testInstanceA.boundary, 'atPosition').and.callThrough();
        });
    
        it('checks for collisions when the instance has moved', () => {
            testInstanceA.setPosition(2, 0);

            testInstanceA.collidesWith(testInstanceB);

            expect(boundarySpy).toHaveBeenCalled();
        });

        it('skips collision checking when the instance has not moved', () => {
            testInstanceA.setPosition(0, 0);

            testInstanceA.collidesWith(testInstanceB);

            expect(boundarySpy).not.toHaveBeenCalled();
        });
    });
});