import { Actor, Boundary, Room, Sprite, Vastgame } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, GameAction, RoomID, SpriteID } from './../util/enum';

let DoorSprite = Sprite.define(SpriteID.DoorSheet, {
    imageSource: '../resources/door_sheet.png',
    height: Constants.GridCellSize,
    width: 32,
    frameBorder: 1,
});

let WinActor = Actor.define(ActorID.Win, {
    boundary: Boundary.fromSprite(DoorSprite, true),
    sprite: DoorSprite,
});

let opening = false;
let closing = false;
let doorAnimationOffsetX = 0;

WinActor.onCreate(win => {
    // hide and draw sprite "manually" during onDraw
    win.animation.depth = -10;
    win.visible = false;
})

WinActor.onStep(win => {
    if (opening) {
        doorAnimationOffsetX++;
    }
    else if (closing) {
        doorAnimationOffsetX--;
    }
});

// animate the door panels when winning
WinActor.onDraw((self, context) => {
    let playerView = Room.current.view;
    context.drawSprite(DoorSprite, self.x - doorAnimationOffsetX, self.y, 0, playerView);
    context.drawSprite(DoorSprite, self.x + 32 + doorAnimationOffsetX, self.y, 1, playerView);
});

WinActor.onEvent(GameAction.Win, (win, args) => {
    win.raiseEvent('open');
});

WinActor.onEvent('open', (win, args) => {
    opening = true;
    setTimeout(() => {
        win.raiseEvent('close');
    }, 500);
});

WinActor.onEvent('close', (win, args) => {
    opening = false;
    win.animation.depth = -100;
    setTimeout(() => {
        closing = true;
        setTimeout(() => {
            win.raiseEvent('home');
        }, 500);
    }, 500);
});

WinActor.onEvent('home', (win, args) => {
    doorAnimationOffsetX = 0;
    closing = false;
    setTimeout(() => {
        Vastgame.get().setRoom(Room.get(RoomID.LevelSelect));
    }, 500);
});