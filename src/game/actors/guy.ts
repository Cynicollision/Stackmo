import { Actor, Boundary, Sprite } from './../../engine/vastgame';

let Stone = Sprite.define({
    imageSource: 'img/stone.png',
    height: 64,
    width: 64,
});

export const Wall = Actor.define({
    boundary: Boundary.fromSprite(Stone, true),
    sprite: Stone,
});


let TankStrip = Sprite.define({
    imageSource: 'img/tank_strip.png',
    height: 64,
    width: 64,
});

export const Guy = Actor.define({
    boundary: Boundary.fromSprite(TankStrip),
    sprite: TankStrip,
});

Guy.onCreate((self) => {
    self.speed = self.id;
});

Guy.onCollide(Guy, (self, other) => {
     
     if (self.speed > other.speed) {
         other.destroy();
     }
});

Guy.onCollide(Wall, (self, other) => {
    self.speed = 0;
});

Guy.onStep((self) => {
    
    if (self.x > 640) {
        self.x = 0;
    }

    if (self.x < 0) {
        self.x = 640;
    }

    if (self.y > 480) {
        self.y = 0;
    }

    if (self.y < 0) {
        self.y = 480;
    }
});

Guy.onClick((self, event) => {
    console.log('actor ' + self.id + ' clicked at x = ' + event.x + ', y = ' + event.y);
});

Guy.onDestroy((self) => {
    console.log('actor ' + self.id + ' destroyed');
});
