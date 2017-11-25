import { Actor, ActorInstance } from './../../engine/actor';
import { Boundary } from './../../engine/boundary';
import { Direction } from './../../engine/enum';
import { ActorBuilder } from './../test-util';

describe('ActorInstance', () => {
    let options = { boundary: new Boundary(5, 5) };
    let TestActorA: Actor = Actor.define('TestActorA', options);
    let TestActorB: Actor = Actor.define('TestActorB', options);
    let testInstanceA: ActorInstance;
    let testInstanceB: ActorInstance;

    beforeEach(() => {
        TestActorA.onCollide('TestActorB', (self, other) => {});

        testInstanceA = ActorBuilder.newInstanceOf(TestActorA, 0, 0);
        testInstanceB = ActorBuilder.newInstanceOf(TestActorB, 0, 0);
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