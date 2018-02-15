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

const animationDelay = 500;

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
    self.raiseEventIn('stopOpening', animationDelay, args);
});

WinActor.onEvent('stopOpening', (self, args) => {
    opening = false;
    self.animation.depth = -100;
    self.raiseEventIn('startClosing', animationDelay, args);
});

WinActor.onEvent('startClosing', (self, args) => {
    closing = true;
    self.raiseEventIn('stopClosing', animationDelay, args);
});

WinActor.onEvent('stopClosing', (self, args) => {
    doorAnimationOffsetX = 0;
    closing = false;
    self.raiseEventIn('exitLevel', animationDelay, args);
});

WinActor.onEvent('exitLevel', (self, args) => {
    Vastgame.setRoom(RoomID.LevelSelect, { win: true });
});