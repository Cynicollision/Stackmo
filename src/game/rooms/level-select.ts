import { Actor, Boundary, Key, Input, Room, Sprite, Vastgame } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, RoomID, Settings } from './../util/enum';
import { Levels, LevelBuilder } from './../util/level-builder';
import { Registry } from './../util/registry';

let LevelIconSprite = Sprite.define({
    imageSource: 'resources/level_icon.png',
    width: Constants.GridCellSize,
    height: Constants.GridCellSize,
});

let LevelIcon = Actor.define(ActorID.LevelIcon, {
    boundary: Boundary.fromSprite(LevelIconSprite),
    sprite: LevelIconSprite,
});

LevelIcon.onClick(self => {
    let levelNumber: number = (<any>self).levelNumber;
    let level = Room.get(RoomID.Level);

    LevelBuilder.populateRoom(level, levelNumber);
    Vastgame.get().setRoom(level);
});

let LevelSelectRoom = Room.define(RoomID.LevelSelect);

LevelSelectRoom.onStart(() => {
    let canvasWidth = Registry.get(Settings.CanvasWidth);
    let canvasHeight = Registry.get(Settings.CanvasHeight);

    let iconPadding = 8;
    let margin = 200;
    let iconSizeWithPadding = Constants.GridCellSize + (iconPadding * 2);
    let iconsPerRow = Math.floor((canvasWidth - margin) / iconSizeWithPadding);

    let startX = margin / 2;
    let startY = 240;
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