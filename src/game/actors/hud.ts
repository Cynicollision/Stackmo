import { Actor, Boundary, Direction, GridCell, Room, Sprite, Vastgame } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, GameAction, SpriteID, RoomID } from './../util/enum';

let XSprite = Sprite.define(SpriteID.X, {
    imageSource: '../resources/x.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
});

let ExitButton = Actor.define(ActorID.ExitButton, {
    boundary: Boundary.fromSprite(XSprite),
    sprite: XSprite,
});

ExitButton.onClick(() => Vastgame.setRoom(RoomID.LevelSelect));
