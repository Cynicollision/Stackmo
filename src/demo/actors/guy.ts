import { Actor, Vastgame } from './../../engine/vastgame';

export const Guy = Vastgame.defineActor();

Guy.onCreate((self) => {
    console.log('My ID is ' + self.id);
});

Guy.onStep((self) => {

});

Guy.onDestroy((self) => {

});

// export { Guy };