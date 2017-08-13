import { Room, Vastgame } from './../../engine/vastgame';

let blockGame = Vastgame.get();

let titleRoom = Room.define('Title');
titleRoom.onStart(() => {
    console.log('hello from title room');

    let gameRoom = Room.get('Level');
    blockGame.setRoom(gameRoom);
});
