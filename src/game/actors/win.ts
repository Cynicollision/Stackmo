import { Actor, Boundary, Room, Sprite, Vastgame } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, SpriteID } from './../util/enum';

let DoorSprite = Sprite.define(SpriteID.DoorSheet, {
    imageSource: '../resources/door_sheet.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
    frameBorder: 1,
});

let currentRoom: Room = null;

let WinActor = Actor.define(ActorID.Win, {
    boundary: Boundary.fromSprite(DoorSprite, true),
    // sprite: DoorSprite,
});
