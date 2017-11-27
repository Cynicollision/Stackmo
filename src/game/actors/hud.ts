import { Actor, Boundary, GridCell, Room, Sprite, Vastgame } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, SpriteID, RoomID } from './../util/enum';

let XSprite = Sprite.define(SpriteID.X, {
    imageSource: '../resources/x.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
});

let ExitButton = Actor.define(ActorID.ExitButton, {
    boundary: Boundary.fromSprite(XSprite),
    sprite: XSprite,
});

ExitButton.onCreate(self => self.animation.depth = -10);

ExitButton.onClick(() => Vastgame.setRoom(RoomID.LevelSelect));
