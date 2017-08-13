import { Actor, Boundary, Sprite } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID } from './../util/enum';

let Stone = Sprite.define({
    imageSource: 'resources/wall_sheet.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
    frameBorder: 1,
});

let Wall = Actor.define(ActorID.Wall, {
    boundary: Boundary.fromSprite(Stone, true),
    sprite: Stone,
});
