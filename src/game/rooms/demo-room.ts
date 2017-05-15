import { Direction, Room } from './../../engine/vastgame';
import { Guy } from './../actors/guy';

export const demoRoom = Room.define();

demoRoom.onStart(() => {
    let guy1 = demoRoom.createActor(Guy);
    let guy2 = demoRoom.createActor(Guy, 0, 200);
    let guy3 = demoRoom.createActor(Guy, 0, 400);

    let guy4 = demoRoom.createActor(Guy, 600, 100);
    let guy5 = demoRoom.createActor(Guy, 600, 200);
    let guy6 = demoRoom.createActor(Guy, 600, 400);

    [guy4, guy5, guy6].forEach(guy => guy.direction = Direction.Left);
});
