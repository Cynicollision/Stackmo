import { Actor, Boundary, Direction, Input, Room, ViewedRoomBehavior, Sprite, Vastgame, View } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import * as Data from './../util/data';
import { ActorID, LevelBgColor, RoomID, Settings, SpriteID } from './../util/enum';
import { LevelBuilder } from './../util/level-builder';
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

let _lastLevelNumber = 1;
let levelSelectLock = false;

LevelSelectRoom.onStart((args) => {
    canvasWidth = Registry.get(Settings.CanvasWidth);
    canvasHeight = Registry.get(Settings.CanvasHeight);

    LevelSelectRoom.setBackground(Constants.Black, canvasWidth, canvasHeight, Constants.Black);

    let viewBehavior = new ViewedRoomBehavior(0, 0, canvasWidth, canvasHeight);
    LevelSelectRoom.use(viewBehavior);
    scrollView = viewBehavior.getView();

    // determine/update level-unlock progress
    let unlockedLevelCount = Number(Registry.get(Settings.StackmoProgress));
    if (args && args.win && _lastLevelNumber === unlockedLevelCount) {
        unlockedLevelCount++;
        Registry.set(Settings.StackmoProgress, unlockedLevelCount, true);
    }

    if (!unlockedLevelCount) {
        unlockedLevelCount = 0;
    }

    // adjust icons per row for scroll bar if rows overflow the canvas
    let iconsPerRow = Math.floor(canvasWidth / iconSizeWithPadding);
    let rowCount = Math.ceil(Data.Levels.count / iconsPerRow);
    let startX = startY = Math.floor((canvasWidth - (iconsPerRow * iconSizeWithPadding)) / 2);
    let showScrollbars = false;

    if (startY + (rowCount * iconSizeWithPadding) > canvasHeight) {
        iconsPerRow--;
        rowCount = Math.ceil(Data.Levels.count / iconsPerRow);
        overflowedRows = Math.ceil(((rowCount * iconSizeWithPadding) - canvasHeight) / iconSizeWithPadding);
        showScrollbars = true;
    }

    // create level icons
    let currentRow = 0;
    let currentPosition = 0;
    for (let i = 0; i < Data.Levels.count; i++) {
        let icon = LevelSelectRoom.createActor(ActorID.LevelIcon, startX + currentPosition * iconSizeWithPadding, startY + currentRow * iconSizeWithPadding);
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
        let upArrow = LevelSelectRoom.createActor(ActorID.ScrollArrow);
        upArrow.animation.setFrame(1);
        upArrow.x = canvasWidth - iconPadding - ScrollArrow.sprite.width;
        (<any>upArrow).direction = Direction.Up;

        let downArrow = LevelSelectRoom.createActor(ActorID.ScrollArrow);
        downArrow.x = upArrow.x;
        (<any>downArrow).direction = Direction.Down;
    }
});

// Level icons
const DigitsSprite = Sprite.define(SpriteID.Digits, {
    imageSource: '../resources/digits_sheet.png',
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
    if ((<any>self).enabled && !levelSelectLock) {
        levelSelectLock = true;

        let levelNumber: number = (<any>self).levelNumber;
        let level = Room.get(RoomID.Level);
        
        LevelBuilder.populateRoom(level, levelNumber);
        
        _lastLevelNumber = levelNumber;
        Vastgame.setRoom(RoomID.Level);

        levelSelectLock = false;
    } 
});

LevelIcon.onDraw(self => {
    if ((<any>self).enabled) {
        let levelNumber: number = (<any>self).levelNumber;
        let singleDigitMargin = Math.floor((LevelIconSprite.width - DigitsSprite.width) / 2);
        
        if (levelNumber < 10) {
            let frame = levelNumber;
            self.drawSprite(DigitsSprite, self.x + singleDigitMargin, self.y + singleDigitMargin, frame);
        }
        else {
            let tensFrame = Math.floor(levelNumber / 10);
            let tensMargin = Math.floor(singleDigitMargin / 2) - 3;
            self.drawSprite(DigitsSprite, self.x + tensMargin, self.y + singleDigitMargin, tensFrame);
    
            let onesFrame = levelNumber % 10;
            let onesMargin = Math.floor(singleDigitMargin * 2) - 3;
            self.drawSprite(DigitsSprite, self.x + onesMargin, self.y + singleDigitMargin, onesFrame);
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