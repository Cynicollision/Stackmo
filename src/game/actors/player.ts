import { Actor, Boundary, Sprite } from './../../engine/vastgame';

let TankStrip = Sprite.define({
    imageSource: 'img/tank_strip.png',
    height: 64,
    width: 64,
});

let Player = Actor.define('Player', {
    boundary: Boundary.fromSprite(TankStrip),
    sprite: TankStrip,
});

Player.onCreate((self) => {
    //self.speed = self.id;
});

Player.onCollide('Wall', (self, other) => {
    self.speed = 0;
});
