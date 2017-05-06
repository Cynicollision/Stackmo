import { Room } from './../../engine/vastgame';
import { Guy } from './../actors/guy';

export const demoRoom = new Room();

demoRoom.onStart(() => {
    demoRoom.createActor(Guy);
    demoRoom.createActor(Guy);
    demoRoom.createActor(Guy, 25, 100);
});
