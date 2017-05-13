import { Actor, Sprite, Vastgame } from './../../engine/vastgame';

let TankStrip = Sprite.define({
    imageSource: 'img/tank_strip.png',
    height: 64,
    width: 64,
});

export const Guy = Actor.define({
    typeName: 'guy',
    sprite: TankStrip,
});

Guy.onCreate((self) => {
    console.log('My ID is ' + self.id);
    console.log('typeName = ' + self.parent.typeName);

    self.speed = 4;
});

Guy.onStep((self) => {

});

Guy.onDestroy((self) => {

});
