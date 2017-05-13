import { GameOptions, Vastgame } from './../engine/vastgame';
import { demoRoom } from './rooms/demo-room';

let options: GameOptions = {
    targetFPS: 60,
};

Vastgame.init('game', options).start(demoRoom);
