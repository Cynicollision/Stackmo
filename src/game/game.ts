import { Room, Vastgame } from './../engine/vastgame';
import * as Constants from './util/constants';
import { Settings, RoomID } from './util/enum';
import { Registry } from './util/registry';

// load game modules
require('./actors/block');
require('./actors/player');
require('./actors/wall');

require('./rooms/level');
require('./rooms/title');

// determine canvas dimensions based on viewport size
let [canvasWidth, canvasHeight] = getCanvasDimensions();

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

function getCanvasDimensions(): [number, number] {
    let fillScreen = window.innerWidth < Constants.CanvasMaxWidth;
    let canvasWidth = fillScreen ? window.innerWidth : Constants.CanvasMaxWidth;
    let canvasHeight = fillScreen ? window.innerHeight : Constants.CanvasMaxHeight;
    canvasHeight += (canvasHeight % 2 === 0) ? 0 : 1;
    canvasWidth += (canvasWidth % 2 === 0) ? 0 : 1;

    return [canvasWidth, canvasHeight];
}