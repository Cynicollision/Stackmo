import { 
    Actor, 
    ActorInstance, 
    Direction, 
    GameOptions,
    GridCell,
    Room, 
    Vastgame,
} from './../engine/vastgame';

// load game modules
require('./actors/block');
require('./actors/player');
require('./actors/wall');

require('./rooms/level');
require('./rooms/title');

// determine canvas dimensions based on viewport size (TODO: need to store game globals)
let fillScreen = window.innerWidth < 800;
let canvasWidth = fillScreen ? window.innerWidth : 800;
let canvasHeight = fillScreen ? window.innerHeight : 600;

// initialize the game
let blockGame = Vastgame.init('game', {
    canvas: { 
        width: canvasWidth, height: canvasHeight,
    },
});

// start the game with the title room
blockGame.start(Room.get('Title'));
