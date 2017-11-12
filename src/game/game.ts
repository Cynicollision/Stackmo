import { Room, Vastgame } from './../engine/vastgame';
import * as Constants from './util/constants';
import { Settings, RoomID }from './util/enum';
import { Registry, requireModules, buildCanvasDimensions } from './util/util';

// load game modules
requireModules('actors', ['block', 'hud', 'player', 'wall', 'win']);
requireModules('rooms', ['level', 'level-select', 'title']);

// determine canvas dimensions based on viewport size
let [canvasWidth, canvasHeight] = buildCanvasDimensions();

Registry.set(Settings.CanvasWidth, canvasWidth);
Registry.set(Settings.CanvasHeight, canvasHeight);

let unlockedCount = localStorage.getItem(Settings.LocalStorageKey) || 4;
Registry.set(Settings.UnlockedLevels, Number(unlockedCount));

// start the game with the title room
Vastgame.start('game', RoomID.Title, {
    canvas: { width: canvasWidth, height: canvasHeight },
});