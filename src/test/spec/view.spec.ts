import { ActorBuilder } from './../test-util';
import { Boundary } from './../../engine/boundary';
import { View } from './../../engine/view';

describe('View', () => {

    let testView;

    beforeEach(() => {
        testView = new View(0,0, 400, 400);
    });

    it('matches the position of the ActorInstance it is following', () => {
        let actorInstance = ActorBuilder.newInstance(200, 200, { boundary: new Boundary(20, 20) })
        testView.follow(actorInstance);

        testView.updatePosition();

        expect(testView.x).toEqual(actorInstance.x);
        expect(testView.y).toEqual(actorInstance.y);
    });

    it('centers around the ActorInstance it is following', () => {
        let actorInstance = ActorBuilder.newInstance(200, 200, { boundary: new Boundary(20, 20) })
        testView.follow(actorInstance, true);

        testView.updatePosition();

        expect(testView.x).toEqual(10);
        expect(testView.y).toEqual(10);
    });

    it('throws an error when trying to follow an ActorInstance with no boundary', () => {
        let actorInstance = ActorBuilder.newInstance();

        testView.follow(actorInstance);
        
        expect(testView.updatePosition).toThrow();
    });
});
