import { Room, Vastgame } from './../engine/vastgame';
import * as Constants from './util/constants';
import { Settings, RoomID } from './util/enum';
import { Registry } from './util/registry';

// load game modules
require('./actors/block');
require('./actors/player');
require('./actors/wall');

require('./rooms/level');
require('./rooms/level-select');
require('./rooms/title');

// determine canvas dimensions based on viewport size
let [canvasWidth, canvasHeight] = getCanvasDimensions();

Registry.set(Settings.CanvasWidth, canvasWidth);
Registry.set(Settings.CanvasHeight, canvasHeight);

// TODO: "load" game status (how many levels are unlocked)
// temporarily just enabled levels that aren't empty arrays
import { Levels } from './util/level-builder';
let unlockedCount: number = (() => {
    let i = 1;
    while (!!Levels.get(i).length) i++;
    return i-1;
})();
Registry.set(Settings.UnlockedLevels, unlockedCount);

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
    canvasWidth += (canvasWidth % 2 === 0) ? 0 : 1;

    let canvasHeight = fillScreen ? window.innerHeight : Constants.CanvasMaxHeight;
    canvasHeight += (canvasHeight % 2 === 0) ? 0 : 1;

    return [canvasWidth, canvasHeight];
}