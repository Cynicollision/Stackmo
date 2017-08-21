import { Actor, Boundary, Room, Sprite, Vastgame } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID } from './../util/enum';

let DoorSprite = Sprite.define({
    imageSource: '../resources/door_sheet.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
    frameBorder: 1,
});

let currentRoom: Room = null;

let WinActor = Actor.define(ActorID.Win, {
    boundary: Boundary.fromSprite(DoorSprite, true),
    sprite: DoorSprite
});

// TODO: animate the door panels when winning
// WinActor.onDraw((self, context) => {
//     Vastgame.get().setRoom
//     context.drawSprite(DoorSprite, self.x, self.y, 0);
//     context.drawSprite(DoorSprite, self.x + 16, self.y, 1);
// });
