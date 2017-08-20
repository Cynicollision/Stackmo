import { Actor, Boundary, Key, Input, Room, Sprite, Vastgame } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, RoomID, Settings } from './../util/enum';
import { Levels, LevelBuilder } from './../util/level-builder';
import { Registry } from './../util/registry';

const DigitsSheet = Sprite.define({
    imageSource: 'resources/digits_32px.png',
    height: Constants.GridCellSize / 2,
    width: Constants.GridCellSize / 2,
});

const LevelIconSprite = Sprite.define({
    imageSource: 'resources/level_icon.png',
    width: Constants.GridCellSize,
    height: Constants.GridCellSize,
});

const LevelIcon = Actor.define(ActorID.LevelIcon, {
    boundary: Boundary.fromSprite(LevelIconSprite),
    sprite: LevelIconSprite,
});

LevelIcon.onClick(self => {
    let levelNumber: number = (<any>self).levelNumber;
    let level = Room.get(RoomID.Level);

    LevelBuilder.populateRoom(level, levelNumber);
    Vastgame.get().setRoom(level);
});

LevelIcon.onDraw((self, context) => {
    let levelNumber: number = (<any>self).levelNumber;
    let singleDigitMargin = Math.floor((LevelIconSprite.width - DigitsSheet.width) / 2);
    
    if (levelNumber < 10) {
        let frame = levelNumber;
        context.drawSprite(DigitsSheet, self.x + singleDigitMargin, self.y + singleDigitMargin, frame);
    }
    else {
        let tensFrame = Math.floor(levelNumber / 10);
        let tensMargin = Math.floor(singleDigitMargin / 2) - 3;
        context.drawSprite(DigitsSheet, self.x + tensMargin, self.y + singleDigitMargin, tensFrame);

        let onesFrame = levelNumber % 10;
        let onesMargin = Math.floor(singleDigitMargin * 2) - 3;
        context.drawSprite(DigitsSheet, self.x + onesMargin, self.y + singleDigitMargin, onesFrame);
    }
});

const LevelSelectRoom = Room.define(RoomID.LevelSelect);

LevelSelectRoom.onStart(() => {
    let canvasWidth = Registry.get(Settings.CanvasWidth);
    let canvasHeight = Registry.get(Settings.CanvasHeight);

    let iconPadding = 8;
    
    let iconSizeWithPadding = Constants.GridCellSize + (iconPadding * 2);
    //let margin = 0; //Math.floor(canvasWidth / 6);
    let iconsPerRow = Math.floor(canvasWidth / iconSizeWithPadding);

    // let startX = Math.floor(margin / 2);
    let startX = (canvasWidth - (iconsPerRow * iconSizeWithPadding)) / 2;
    let startY = Math.floor(canvasHeight / 6);
    let currentRow = 0;
    let currentPosition = 0;

    for (let i = 0; i < Levels.count; i++) {
        let icon = LevelSelectRoom.createActor(LevelIcon, startX + currentPosition * iconSizeWithPadding, startY + currentRow * iconSizeWithPadding);
        (<any>icon).levelNumber = i + 1;

        currentPosition++;

        if (currentPosition === iconsPerRow) {
            currentPosition = 0;
            currentRow++;
        }
    }
});