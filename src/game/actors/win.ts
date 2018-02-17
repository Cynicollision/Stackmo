import { Actor, Boundary, Room, Sprite, Vastgame } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, GameAction, RoomID, SpriteID } from './../util/enum';

const animationDelay = 500;

let opening = false;
let closing = false;
let doorAnimationOffsetX = 0;

Actor
    .define(ActorID.Win, {
        sprite: Sprite.get(SpriteID.DoorSheet),
    })
    .onCreate(self => {
        // hide and draw sprite "manually" during onDraw
        self.animation.depth = -10;
        self.visible = false;
    })
    .onDraw((self, context) => {
        // animate the door panels when winning
        let doorSprite = Sprite.get(SpriteID.DoorSheet);
        doorSprite.draw(context, self.x - doorAnimationOffsetX, self.y, { frame: 0 });
        doorSprite.draw(context, self.x + 32 + doorAnimationOffsetX, self.y, { frame: 1 });
    })
    .onStep(self => {
        if (opening) {
            doorAnimationOffsetX++;
        }
        else if (closing) {
            doorAnimationOffsetX--;
        }
    })
    // Level-complete animation events
    .onEvent(GameAction.Win, (self, args) => {
        let currentRoom: Room = args.game.currentRoom;
        currentRoom.set('complete', true);
        self.raiseEvent('open');
    })
    .onEvent('open', (self, args) => {
        opening = true;
        self.raiseEventIn('stopOpening', animationDelay, args);
    })
    .onEvent('stopOpening', (self, args) => {
        opening = false;
        self.animation.depth = -100;
        self.raiseEventIn('startClosing', animationDelay, args);
    })
    .onEvent('startClosing', (self, args) => {
        closing = true;
        self.raiseEventIn('stopClosing', animationDelay, args);
    })
    .onEvent('stopClosing', (self, args) => {
        doorAnimationOffsetX = 0;
        closing = false;
        self.raiseEventIn('exitLevel', animationDelay, args);
    })
    .onEvent('exitLevel', (self, args) => {
        Vastgame.setRoom(RoomID.LevelSelect, { win: true });
    });