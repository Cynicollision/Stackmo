import { Actor } from './actor';
import { ActorInstance } from './actor-instance';
import { Boundary } from './boundary';
import { Direction } from './enum';
import { Sprite } from './sprite';

describe('ActorInstance', () => {
    let TestActorA: Actor, TestActorB: Actor;
    let testInstanceA: ActorInstance, testInstanceB: ActorInstance;

    beforeEach(() => {
        TestActorA = new Actor({ boundary: new Boundary(5, 5) });
        TestActorB = new Actor({ boundary: new Boundary(5, 5) });

        TestActorA.onCollide(TestActorB, (self, other) => {
        });

        // initial state: side-by-side
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
            boundarySpy = spyOn(testInstanceA.parent.boundary, 'atPosition').and.callThrough();
        });
    
        it('checks for collisions when either instance has moved', () => {
            testInstanceA.speed = 2;
            testInstanceA.doMovement();

            testInstanceA.collidesWith(testInstanceB);

            expect(boundarySpy).toHaveBeenCalled();
        });

        it('skips collision checking when neither instance has moved', () => {
            testInstanceA.speed = 0;
            testInstanceA.doMovement();

            testInstanceA.collidesWith(testInstanceB);

            expect(boundarySpy).not.toHaveBeenCalled();
        });
    });

    describe('when applying motion', () => {

        it('changes relative x position when there is speed', () => {
            testInstanceA.speed = 2;
            testInstanceA.doMovement();
            
            expect(testInstanceA.x > 0).toBe(true);
        });

        it('does not change relative x position when there is no speed', () => {
            testInstanceA.speed = 0;
            testInstanceA.doMovement();
            
            expect(testInstanceA.x).toBe(0);
        });

        it('toggles hasMoved depending on actual movement', () => {
            testInstanceA.speed = 2;
            testInstanceA.doMovement();
            
            expect(testInstanceA.hasMoved).toBe(true);

            testInstanceA.speed = 0;
            testInstanceA.doMovement();
            
            expect(testInstanceA.hasMoved).toBe(false);
        });
    });
});