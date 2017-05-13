import { Actor, ActorInstance } from './actor';

describe('Actor', () => {

    let testActor;

    beforeEach(() => {
        testActor = new Actor({
            typeName: 'testActor',
        });
    });

    it('needs tests', () => {
        console.log('there are no tests yet but this one runs at least');

        expect(true).toBe(true);
    });

});