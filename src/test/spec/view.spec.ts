import { Boundary } from './../../engine/boundary';
import { View } from './../../engine/view';
import { ActorBuilder } from './../test-util';

describe('View', () => {
    let testView: View;

    beforeEach(() => {
        testView = new View(0,0, 400, 400);
    });

    it('matches the position of the ActorInstance it is following', () => {
        let actorInstance = ActorBuilder.newInstance(200, 200, { boundary: new Boundary(20, 20) })
        testView.follow(actorInstance);

        testView.update();

        expect(testView.x).toEqual(actorInstance.x);
        expect(testView.y).toEqual(actorInstance.y);
    });

    it('centers around the ActorInstance it is following', () => {
        let actorInstance = ActorBuilder.newInstance(200, 200, { boundary: new Boundary(20, 20) })
        testView.follow(actorInstance, true);

        testView.update();

        expect(testView.x).toEqual(10);
        expect(testView.y).toEqual(10);
    });

    it('throws an error when trying to follow an ActorInstance with no boundary', () => {
        let actorInstance = ActorBuilder.newInstance();

        testView.follow(actorInstance);
        
        expect(testView.update).toThrow();
    });

    it('updates the positions of its attachments after updating its own position', () => {
        let actorInstance = ActorBuilder.newInstance(50, 50, { boundary: new Boundary(20, 20) } );
        let attachment1 = ActorBuilder.newInstance();
        let attachment2 = ActorBuilder.newInstance();

        testView.follow(actorInstance);
        testView.attach(attachment1, 100, 120);
        testView.attach(attachment2, 200, 220);

        testView.update();

        expect(testView.x).toEqual(actorInstance.x);
        expect(testView.y).toEqual(actorInstance.y);
        expect(attachment1.x).toEqual(150);
        expect(attachment1.y).toEqual(170);
        expect(attachment2.x).toEqual(250);
        expect(attachment2.y).toEqual(270);
    });
});
