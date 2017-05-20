import { Actor, Direction, GameOptions, Room, Vastgame } from './../engine/vastgame';

// initialization
let options: GameOptions = {
    targetFPS: 60,
};

let demoGame = Vastgame.init('game', options);

require('./actors/guy');
require('./actors/wall');

// create a demo room with some actor instnaces
let demoRoom = Room.define();

demoRoom.onStart(() => {
    let Guy = Actor.get('Guy');
    let Wall = Actor.get('Wall');

    let guy1 = demoRoom.createActor(Guy);
    let guy2 = demoRoom.createActor(Guy, 0, 200);
    let guy3 = demoRoom.createActor(Guy, 0, 400);

    let guy4 = demoRoom.createActor(Guy, 600, 800);
    let guy5 = demoRoom.createActor(Guy, 600, 200);
    let guy6 = demoRoom.createActor(Guy, 600, 400);

    let wall1 = demoRoom.createActor(Wall, 400, 400);
    let wall2 = demoRoom.createActor(Wall, 150, 120);
    let wall3 = demoRoom.createActor(Wall, 576, 300);

    [guy4, guy5, guy6].forEach(guy => guy.direction = Direction.Left);
});

// start the game
demoGame.start(demoRoom);
