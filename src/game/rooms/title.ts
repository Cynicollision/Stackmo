import { Enum, Room, Sprite, Vastgame } from './../../engine/vastgame';
import { RoomID, Settings, SpriteID } from './../util/enum';
import { SpriteFader } from './../util/sprite-fader';
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

    SpriteFader.fadeIn([TitleSprite]);
});

TitleRoom.onDraw(context => {
    context.drawSprite(TitleSprite, titleX, titleY);
});

TitleRoom.onClick(goToLevelSelect);
TitleRoom.onKey(Enum.Key.Any, goToLevelSelect);

function goToLevelSelect() {
    if (canStart) {
        canStart = false;

        SpriteFader.fadeOut([TitleSprite], () => {
            Vastgame.setRoom(RoomID.LevelSelect);
        });
    }
}