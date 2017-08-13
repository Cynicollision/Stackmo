import { Room, Vastgame } from './../engine/vastgame';
import { Settings, RoomID } from './util/enum';
import { Registry } from './util/registry';

// load game modules
require('./actors/block');
require('./actors/player');
require('./actors/wall');

require('./rooms/level');
require('./rooms/title');

// determine canvas dimensions based on viewport size
let fillScreen = window.innerWidth < 800;
let canvasWidth = fillScreen ? window.innerWidth : 800;
let canvasHeight = fillScreen ? window.innerHeight : 600;

Registry.set(Settings.CanvasWidth, canvasWidth);
Registry.set(Settings.CanvasHeight, canvasHeight);

// initialize the game
let blockGame = Vastgame.init('game', {
    canvas: { 
        width: canvasWidth, height: canvasHeight,
    },
});

// start the game with the title room
blockGame.start(Room.get(RoomID.Title));
