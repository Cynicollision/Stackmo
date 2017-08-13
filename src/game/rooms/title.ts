import { Actor, Key, Input, Room, Sprite, Vastgame } from './../../engine/vastgame';
import { RoomID, Settings } from './../util/enum';
import { Registry } from './../util/registry';

const TitleWidth = 310;
const TitleHeight = 150;

let titleSprite = Sprite.define({
    imageSource: 'resources/title.png',
    width: TitleWidth,
    height: TitleHeight,
});

let titleActor = Actor.define('Title', {
    sprite: titleSprite,
});

let titleRoom = Room.define(RoomID.Title);
titleRoom.onStart(() => {
    let canvasWidth = Registry.get(Settings.CanvasWidth);
    let canvasHeight = Registry.get(Settings.CanvasHeight);

    let x = Math.floor((canvasWidth - TitleWidth) / 2);
    let y = Math.floor((canvasHeight - TitleHeight) / 4);
    titleRoom.createActor(titleActor, x, y);

    Input.onClick(goToLevelSelect);
    Input.onKey(Key.Any, goToLevelSelect);

    function goToLevelSelect() {
        let gameRoom = Room.get(RoomID.Level);
        Vastgame.get().setRoom(gameRoom);
    }
});
