import { Actor, Boundary, Sprite } from './../../engine/vastgame';

let BlockSprite = Sprite.define({
    imageSource: 'img/box.png',
    height: 64,
    width: 64,
});

let Block = Actor.define('Block', {
    boundary: Boundary.fromSprite(BlockSprite),
    sprite: BlockSprite,
});
