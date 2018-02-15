import { Enum, Room, Sprite, Vastgame } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { RoomID, Settings, SpriteID } from './../util/enum';
import { Registry } from './../util/registry';

const TitleWidth = 360;
const TitleHeight = 150;

let titleX: number = 0;
let titleY: number = 0;

let TitleSprite = Sprite.define(SpriteID.Title, {
    imageSource: '../resources/title.png',
    width: TitleWidth,
    height: TitleHeight,
});

let TitleRoom = Room.define(RoomID.Title);
let canStart = true;

TitleRoom.onStart(() => {
    let canvasWidth = Registry.get(Settings.CanvasWidth);
    let canvasHeight = Registry.get(Settings.CanvasHeight);

    titleX = Math.floor((canvasWidth - TitleWidth) / 2);
    titleY = Math.floor((canvasHeight - TitleHeight) / 4);

    TitleRoom.setBackground(Constants.Black, canvasWidth, canvasHeight, Constants.Black);
});

TitleRoom.onDraw(() => {
    TitleRoom.drawSprite(TitleSprite, titleX, titleY);
});

let clickHandler = TitleRoom.onClick(goToLevelSelect);
let keyHandler = TitleRoom.onKey(Enum.Key.Any, goToLevelSelect);

function goToLevelSelect() {
    disposeHandlers();
    Vastgame.setRoom(RoomID.LevelSelect);
}

function disposeHandlers() {
    if (clickHandler) {
        clickHandler.dispose();
    }

    if (keyHandler) {
        keyHandler.dispose();
    }
}