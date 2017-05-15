import { Actor, Boundary, Sprite, Vastgame } from './../../engine/vastgame';

let TankStrip = Sprite.define({
    imageSource: 'img/tank_strip.png',
    height: 64,
    width: 64,
});

export const Guy = Actor.define({
    boundary: Boundary.fromSprite(TankStrip),
    sprite: TankStrip,
    typeName: 'guy',
});

Guy.onCreate((self) => {
    console.log('My ID is ' + self.id);
    console.log('typeName = ' + self.parent.typeName);

    self.speed = Math.ceil(self.id * 0.75);
});

Guy.onCollide(Guy, (self, other) => {
     
     if (self.speed > other.speed) {
         other.destroy();
     }
});

Guy.onStep((self) => {
    
    if (self.x > 640) {
        self.x = 0;
    }
});

Guy.onClick((self, event) => {
    console.log('actor ' + self.id + ' clicked at x = ' + event.x + ', y = ' + event.y);
});

Guy.onDestroy((self) => {
    console.log('actor ' + self.id + ' destroyed');
});
