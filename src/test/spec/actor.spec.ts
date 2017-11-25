import { Actor, ActorInstance } from './../../engine/actor';
import { Boundary } from './../../engine/boundary';
import { Direction } from './../../engine/enum';
import { Room } from './../../engine/room';
import { ActorBuilder } from './../test-util';
import { GameCanvasContext2D } from '../../engine/canvas';

describe('ActorInstance', () => {
    let TestRoom = Room.define('ActorInstance_TestRoom');

    let options = { boundary: new Boundary(5, 5) };
    let TestActorA: Actor = Actor.define('ActorInstance_TestActorA', options);
    let TestActorB: Actor = Actor.define('ActorInstance_TestActorB', options);
    let testInstanceA: ActorInstance;
    let testInstanceB: ActorInstance;

    beforeEach(() => {
        TestActorA.onCollide('ActorInstance_TestActorB', (self, other) => {});

        testInstanceA = TestRoom.createActor('ActorInstance_TestActorA', 0, 0);
        testInstanceB = TestRoom.createActor('ActorInstance_TestActorB', 0, 0);
    });

    it('is an instance of its parent Actor', () => {
        expect(testInstanceA.parent).toBe(TestActorA);
    });

    describe('can define lifecycle events', () => {

        it('to be called upon creation', () => {
            let createSpy = jasmine.createSpy('create');
            TestActorA.onCreate(createSpy);

            TestRoom.createActor('ActorInstance_TestActorA');

            expect(createSpy).toHaveBeenCalled();
        });

        it('to be called at each game step', () => {
            let stepSpy = jasmine.createSpy('step');
            TestActorA.onStep(stepSpy);

            TestRoom.step();

            expect(stepSpy).toHaveBeenCalled();
        });

        it('to be called when the containing room is drawn', () => {
            let drawSpy = jasmine.createSpy('draw');
            TestActorA.onDraw(drawSpy);

            const mockGameCanvasContext = {
                clear: () => null,
                fill: () => null,
                drawSprite: () => null,
            };

            TestRoom.draw(mockGameCanvasContext);

            expect(drawSpy).toHaveBeenCalled();
        });
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