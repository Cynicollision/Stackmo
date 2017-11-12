import { Room, Vastgame } from './../engine/vastgame';
import * as Constants from './util/constants';
import { Settings, RoomID } from './util/enum';
import { Registry } from './util/registry';

// load game modules
requireModules('actors', ['block', 'hud', 'player', 'wall', 'win']);
requireModules('rooms', ['level', 'level-select', 'title']);

// determine canvas dimensions based on viewport size
let [canvasWidth, canvasHeight] = buildCanvasDimensions();

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
blockGame.start(RoomID.Title);

function requireModules(rootDir: string, fileNames: string[]) {
    fileNames.forEach(name => require('./' + rootDir + '/' + name));
}

function buildCanvasDimensions(): [number, number] {
    let fillScreen = window.innerWidth < Constants.CanvasMaxWidth;

    let canvasWidth = fillScreen ? window.innerWidth : Constants.CanvasMaxWidth;
    canvasWidth += (canvasWidth % 2 === 0) ? 0 : 1;

    let canvasHeight = fillScreen ? window.innerHeight : Constants.CanvasMaxHeight;
    canvasHeight += (canvasHeight % 2 === 0) ? 0 : 1;

    return [canvasWidth, canvasHeight];
}