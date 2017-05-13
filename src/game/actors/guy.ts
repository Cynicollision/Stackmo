import { Actor, Vastgame } from './../../engine/vastgame';

export const Guy = Actor.define({
    typeName: 'guy',
});

Guy.onCreate((self) => {
    console.log('My ID is ' + self.id);
    console.log('typeName = ' + self.parent.typeName);
});

Guy.onStep((self) => {

});

Guy.onDestroy((self) => {

});
