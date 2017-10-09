import { Actor, Boundary, Direction, Key, Input, Room, Sprite, Vastgame, View } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, LevelBgColor, RoomID, Settings, SpriteID } from './../util/enum';
import { Levels, LevelBuilder } from './../util/level-builder';
import { SpriteFader } from './../util/sprite-fader';
import { Registry } from './../util/registry';

let scrollView: View;
let canvasHeight: number;
let canvasWidth: number;
let startX: number;
let startY: number;
let overflowedRows: number;

const iconPadding = 8;
const iconSizeWithPadding = Constants.GridCellSize + (iconPadding * 2);

const LevelSelectRoom = Room.define(RoomID.LevelSelect);

LevelSelectRoom.onStart(() => {
    canvasWidth = Registry.get(Settings.CanvasWidth);
    canvasHeight = Registry.get(Settings.CanvasHeight);
    
    LevelSelectRoom.setBackground(Constants.Black, canvasWidth, canvasHeight);
    scrollView = LevelSelectRoom.defineView(0, 0, canvasWidth, canvasHeight);

    let iconsPerRow = Math.floor(canvasWidth / iconSizeWithPadding);

    startX = Math.floor((canvasWidth - (iconsPerRow * iconSizeWithPadding)) / 2);
    startY = Math.floor(canvasHeight / 6);

    // adjust iconsper row for scroll bar if rows overflow the canvas
    let showScrollbars = false;
    let rowCount = Math.ceil(Levels.count / iconsPerRow);
    if (startY + (rowCount * iconSizeWithPadding) > canvasHeight) {
        iconsPerRow--;
        rowCount = Math.ceil(Levels.count / iconsPerRow);
        overflowedRows = Math.ceil(((rowCount * iconSizeWithPadding) - canvasHeight) / iconSizeWithPadding);
        showScrollbars = true;
    }

    let currentRow = 0;
    let currentPosition = 0;

    let unlockedLevelCount = Registry.get(Settings.UnlockedLevels);

    // create level icons
    for (let i = 0; i < Levels.count; i++) {
        let icon = LevelSelectRoom.createActor(LevelIcon, startX + currentPosition * iconSizeWithPadding, startY + currentRow * iconSizeWithPadding);
        (<any>icon).levelNumber = i + 1;
        (<any>icon).enabled = i < unlockedLevelCount;

        currentPosition++;

        if (currentPosition === iconsPerRow) {
            currentPosition = 0;
            currentRow++;
        }
    }

    // create scroll icons if needed
    if (showScrollbars) {
        let upArrow = LevelSelectRoom.createActor(ScrollArrow);
        upArrow.spriteAnimation.set(1);
        upArrow.x = canvasWidth - iconPadding - ScrollArrow.sprite.width;
        (<any>upArrow).direction = Direction.Up;

        let downArrow = LevelSelectRoom.createActor(ScrollArrow);
        downArrow.x = upArrow.x;
        (<any>downArrow).direction = Direction.Down;
    }

    SpriteFader.fadeIn([TextSprite, DigitsSprite, LevelIconSprite, ArrowSprite]);
});

// draw the banner text
const TextSprite = Sprite.define(SpriteID.TextSheet, {
    imageSource:'../resources/text_sheet.png',
    height: 32,
    width: 320,
});

LevelSelectRoom.onDraw(context => {
    context.drawSprite(TextSprite, startX, Math.floor(startY / 2 - TextSprite.height), 0, scrollView);
})

// Level icons
const DigitsSprite = Sprite.define(SpriteID.Digits, {
    imageSource: '../resources/digits_32px.png',
    height: Constants.GridCellSize / 2,
    width: Constants.GridCellSize / 2,
});

const LevelIconSprite = Sprite.define(SpriteID.LevelIcon, {
    imageSource: '../resources/level_icon.png',
    width: Constants.GridCellSize,
    height: Constants.GridCellSize,
});

const LevelIcon = Actor.define(ActorID.LevelIcon, {
    boundary: Boundary.fromSprite(LevelIconSprite),
    sprite: LevelIconSprite,
});

LevelIcon.onClick(self => {
    if ((<any>self).enabled) {

        SpriteFader.fadeOut([TextSprite, DigitsSprite, LevelIconSprite, ArrowSprite], () => {
            let levelNumber: number = (<any>self).levelNumber;
            let level = Room.get(RoomID.Level);
            
            LevelBuilder.populateRoom(level, levelNumber);
            Vastgame.get().setRoom(level);
        });
    } 
});

LevelIcon.onDraw((self, context) => {
    if ((<any>self).enabled) {
        let levelNumber: number = (<any>self).levelNumber;
        let singleDigitMargin = Math.floor((LevelIconSprite.width - DigitsSprite.width) / 2);
        
        if (levelNumber < 10) {
            let frame = levelNumber;
            context.drawSprite(DigitsSprite, self.x + singleDigitMargin, self.y + singleDigitMargin, frame, scrollView);
        }
        else {
            let tensFrame = Math.floor(levelNumber / 10);
            let tensMargin = Math.floor(singleDigitMargin / 2) - 3;
            context.drawSprite(DigitsSprite, self.x + tensMargin, self.y + singleDigitMargin, tensFrame, scrollView);
    
            let onesFrame = levelNumber % 10;
            let onesMargin = Math.floor(singleDigitMargin * 2) - 3;
            context.drawSprite(DigitsSprite, self.x + onesMargin, self.y + singleDigitMargin, onesFrame, scrollView);
        }
    }
});

// Scroll arrows
const ArrowSprite = Sprite.define(SpriteID.Arrows, {
    imageSource: '../resources/arrows.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
});

const ScrollArrow = Actor.define(ActorID.ScrollArrow, {
    boundary: Boundary.fromSprite(ArrowSprite),
    sprite: ArrowSprite,
});

ScrollArrow.onClick((self, event) => {
    if ((<any>self).enabled) {
        let direction: Direction = (<any>self).direction;
        scrollView.y += direction === Direction.Down ? 64 : -64;

        if (scrollView.y < 0) {
            scrollView.y = 0;
        }
    }
});

ScrollArrow.onStep(self => {
    // update vertical position to match scrolling
    let isUpArrow = ((<any>self).direction === Direction.Up);
    self.y = isUpArrow ? startY + scrollView.y : canvasHeight - 82 + scrollView.y; 

    // enable/disable if there's no more scrolling to do
    (<any>self).enabled = isUpArrow ? scrollView.y > 0 : scrollView.y < (overflowedRows + 2) * iconSizeWithPadding;
});