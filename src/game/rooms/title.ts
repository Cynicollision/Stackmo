import { Key, Room, Sprite, Vastgame } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { RoomID, Settings, SpriteID } from './../util/enum';
import { Registry } from './../util/registry';

let titleX: number = 0;
let titleY: number = 0;

Room
    .define(RoomID.Title)
    .onStart((room, args) => {
        let canvasWidth = Registry.get(Settings.CanvasWidth);
        let canvasHeight = Registry.get(Settings.CanvasHeight);

        titleX = Math.floor((canvasWidth - Constants.TitleWidth) / 2);
        titleY = Math.floor((canvasHeight - Constants.TitleHeight) / 4);

        room.setBackground(Constants.Black, canvasWidth, canvasHeight, Constants.Black);
    })
    .onClick(() => {
        Vastgame.setRoom(RoomID.LevelSelect);
    })
    .onKey(Key.Any, () => {
        Vastgame.setRoom(RoomID.LevelSelect);
    })
    .onDraw((room, context) => {
        Sprite.get(SpriteID.Title).draw(context, titleX, titleY);
    });
