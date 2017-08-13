import { Actor, Key, Input, Room, Sprite, Vastgame } from './../../engine/vastgame';
import { ActorID, RoomID, Settings } from './../util/enum';
import { Registry } from './../util/registry';

const TitleWidth = 310;
const TitleHeight = 150;

let TitleSprite = Sprite.define({
    imageSource: 'resources/title.png',
    width: TitleWidth,
    height: TitleHeight,
});

let TitleActor = Actor.define(ActorID.Title, {
    sprite: TitleSprite,
});

let TitleRoom = Room.define(RoomID.Title);

TitleRoom.onStart(() => {
    let canvasWidth = Registry.get(Settings.CanvasWidth);
    let canvasHeight = Registry.get(Settings.CanvasHeight);

    let x = Math.floor((canvasWidth - TitleWidth) / 2);
    let y = Math.floor((canvasHeight - TitleHeight) / 4);
    TitleRoom.createActor(TitleActor, x, y);

    Input.onClick(goToLevelSelect);
    Input.onKey(Key.Any, goToLevelSelect);

    function goToLevelSelect() {
        Input.releaseClick();
        Input.releaseKey(Key.Any);

        let levelSelect = Room.get(RoomID.LevelSelect);
        Vastgame.get().setRoom(levelSelect);
    }
});
