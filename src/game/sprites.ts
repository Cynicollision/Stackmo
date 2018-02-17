import { Sprite } from './../engine/vastgame';
import * as Constants from './util/constants';
import { SpriteID } from './util/enum';

Sprite.define(SpriteID.ArrowSheet, {
    imageSource: '../resources/arrows.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
});

Sprite.define(SpriteID.Box, {
    imageSource: '../resources/box.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
});

Sprite.define(SpriteID.Digits, {
    imageSource: '../resources/digits_sheet.png',
    height: Constants.GridCellSize / 2,
    width: Constants.GridCellSize / 2,
});

Sprite.define(SpriteID.DoorSheet, {
    imageSource: '../resources/door_sheet.png',
    height: Constants.GridCellSize,
    width: 32,
    frameBorder: 1,
});

Sprite.define(SpriteID.ExitButton, {
    imageSource: '../resources/exit_button.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
});

Sprite.define(SpriteID.LevelIcon, {
    imageSource: '../resources/level_icon.png',
    width: Constants.GridCellSize,
    height: Constants.GridCellSize,
});

Sprite.define(SpriteID.HUD, {
    imageSource: '../resources/hud.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
});

Sprite.define(SpriteID.StackmoSheet, {
    imageSource: '../resources/stackmo_sheet.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
    frameBorder: 4,
});

Sprite.define(SpriteID.Title, {
    imageSource: '../resources/title.png',
    width: Constants.TitleWidth,
    height: Constants.TitleHeight,
});

Sprite.define(SpriteID.Wall, {
    imageSource: '../resources/wall_sheet.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
    frameBorder: 1,
});
