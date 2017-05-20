import { Actor, Boundary, Sprite } from './../../engine/vastgame';

let Stone = Sprite.define({
    imageSource: 'img/stone.png',
    height: 64,
    width: 64,
});

let Wall = Actor.define('Wall', {
    boundary: Boundary.fromSprite(Stone, true),
    sprite: Stone,
});
