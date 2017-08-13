import { Actor, Boundary, Sprite } from './../../engine/vastgame';
import { ActorID } from './../util/enum';

let Stone = Sprite.define({
    imageSource: 'resources/wall_sheet.png',
    height: 64,
    width: 64,
    frameBorder: 1,
});

let Wall = Actor.define(ActorID.Wall, {
    boundary: Boundary.fromSprite(Stone, true),
    sprite: Stone,
});
