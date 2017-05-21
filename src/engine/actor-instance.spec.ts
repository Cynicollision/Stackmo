import { Actor } from './actor';
import { ActorInstance } from './actor-instance';
import { Boundary } from './boundary';
import { Direction } from './enum';
import { Sprite } from './sprite';

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