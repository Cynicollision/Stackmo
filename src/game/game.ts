import { Room, Vastgame } from './../engine/vastgame';
import * as Constants from './util/constants';
import { Settings, RoomID }from './util/enum';
import { Registry, requireModules, buildCanvasDimensions } from './util/util';

// determine canvas dimensions based on viewport size
let [canvasWidth, canvasHeight] = buildCanvasDimensions();

Registry.set(Settings.CanvasWidth, canvasWidth);
Registry.set(Settings.CanvasHeight, canvasHeight);

// initialize the game canvas
Vastgame.init('game', {
    canvas: { width: canvasWidth, height: canvasHeight },
})

// load game modules
requireModules('actors', ['block', 'hud', 'player', 'wall', 'win']);
requireModules('rooms', ['level', 'level-select', 'title']);

// TODO: hacks to reset from the beginning...
Registry.set(Settings.StackmoProgress, 1, true);

Registry.load(Settings.StackmoProgress);

// start the game with the title room
Vastgame.start(RoomID.Title);