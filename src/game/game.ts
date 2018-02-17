import { Vastgame } from './../engine/vastgame';
import { Settings, RoomID }from './util/enum';
import { Registry, requireModules, buildCanvasDimensions } from './util/util';

// determine canvas dimensions based on viewport size
let [canvasWidth, canvasHeight] = buildCanvasDimensions();

Registry.set(Settings.CanvasWidth, canvasWidth);
Registry.set(Settings.CanvasHeight, canvasHeight);

// initialize the game canvas
Vastgame.init('game', {
    canvas: { width: canvasWidth, height: canvasHeight },
});

// load game modules
require('./sprites');
requireModules('actors', ['block', 'player', 'win']);
requireModules('rooms', ['level', 'level-select', 'title']);

// load game progress
Registry.load(Settings.StackmoProgress);
// debug: hacks...
Registry.set(Settings.StackmoProgress, 99, true);

// start the game with the title room
Vastgame.start(RoomID.Title);