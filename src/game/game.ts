import { 
    Actor, 
    ActorInstance, 
    Direction, 
    GameOptions, 
    Room, 
    Vastgame,
} from './../engine/vastgame';

import { Levels } from './levels';

// initialization
let fillScreen = window.innerWidth < 800;
let canvasWidth = fillScreen ? window.innerWidth : 800;
let canvasHeight = fillScreen ? window.innerHeight : 600;

let options: GameOptions = {
    targetFPS: 60,
    canvas: { 
        width: canvasWidth, 
        height: canvasHeight,
    },
};

let demoGame = Vastgame.init('game', options);

require('./actors/block');
require('./actors/player');
require('./actors/wall');

// create a demo room with some actor instances
let demoRoom = Room.define();

demoRoom.onStart(() => {
    let instances = populateRoom(demoRoom);
    let player = instances.find(actorInstance => actorInstance.parent === Actor.get('Player'));

    demoRoom.defineView(0, 0, canvasWidth, canvasHeight)
        .follow(player, true);
});

function populateRoom(room: Room): ActorInstance[] {
    let Block = Actor.get('Block');
    let Player = Actor.get('Player');
    let Wall = Actor.get('Wall');

    let instances: ActorInstance[] = [];

    let levelMap = Levels.get(1);

    for (let i = 0; i < levelMap.length; i++) {
        let row = levelMap[i];

        for (let j = 0; j < row.length; j++) {

            switch (row.charAt(j)) {

                case 'X':
                    instances.push(demoRoom.createActor(Block, j * 64, i * 64));
                    break;

                case 'P':
                    instances.push(demoRoom.createActor(Player, j * 64, i * 64));
                    break;

                case '#':
                    instances.push(demoRoom.createActor(Wall, j * 64, i * 64));
                    break;
            }
        }
    }

    return instances;
}

// start the game
demoGame.start(demoRoom);
