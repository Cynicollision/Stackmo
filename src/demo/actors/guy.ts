import { Actor, Vastgame } from './../../engine/vastgame';

export const Guy = Actor.define();

Guy.onCreate((self) => {
    console.log('My ID is ' + self.id);
});

Guy.onStep((self) => {

});

Guy.onDestroy((self) => {

});
