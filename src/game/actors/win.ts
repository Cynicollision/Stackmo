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

WinActor.onCreate(self => {
    // hide and draw sprite "manually" during onDraw
    self.animation.depth = -10;
    self.visible = false;
})

WinActor.onStep(self => {
    if (opening) {
        doorAnimationOffsetX++;
    }
    else if (closing) {
        doorAnimationOffsetX--;
    }
});

// animate the door panels when winning
WinActor.onDraw(self => {
    self.drawSprite(DoorSprite, self.x - doorAnimationOffsetX, self.y, 0);
    self.drawSprite(DoorSprite, self.x + 32 + doorAnimationOffsetX, self.y, 1);
});

WinActor.onEvent(GameAction.Win, (self, args) => {
    let currentRoom: Room = args.game.currentRoom;
    currentRoom.set('complete', true);
    self.raiseEvent('open');
});

WinActor.onEvent('open', (self, args) => {
    opening = true;
    setTimeout(() => {
        self.raiseEvent('close');
    }, 500);
});

WinActor.onEvent('close', (self, args) => {
    opening = false;
    self.animation.depth = -100;
    setTimeout(() => {
        closing = true;
        setTimeout(() => {
            self.raiseEvent('home');
        }, 500);
    }, 500);
});

WinActor.onEvent('home', (self, args) => {
    doorAnimationOffsetX = 0;
    closing = false;
    setTimeout(() => {
        Vastgame.setRoom(RoomID.LevelSelect, { win: true });
    }, 500);
});