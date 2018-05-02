import { Actor, ActorInstance, Boundary, Direction, Grid, GridCell, Input, Key, Room, ViewedRoomBehavior, Sprite, Vastgame, View } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, RoomID, SpriteID, GameAction, Settings } from './../util/enum';
import { Registry } from './../util/registry';
import { GridRoomBehavior } from '../../engine/room-ext';
import { getDigitDrawInstances } from './../util/util';

Actor
    .define(ActorID.ExitButton, {
        boundary: new Boundary(Constants.GridCellSize, Constants.GridCellSize),
    })
    .onClick(() => {
        Vastgame.setRoom(RoomID.LevelSelect);
    });

Actor.define(ActorID.Wall, {
    sprite: Sprite.get(SpriteID.Wall),
});

let levelNumber: number;
let grid: Grid;
let playerView: View;

let BlockActor: Actor;
let PlayerActor = Actor.get(ActorID.Player);
let WallActor = Actor.get(ActorID.Wall);

let canvasWidth = Registry.get(Settings.CanvasWidth);
let canvasHeight = Registry.get(Settings.CanvasHeight);

Room
    .define(RoomID.Level)
    .onStart((room, args) => {
        levelNumber = args.levelNumber;
        room.set('complete', false);

        BlockActor = Actor.get(ActorID.Block);
        PlayerActor = Actor.get(ActorID.Player);
        WallActor = Actor.get(ActorID.Wall);

        // define the movement grid and player behavior
        let gridBehavior = new GridRoomBehavior(Constants.GridCellSize, room);
        grid = gridBehavior.getGrid();
        room.use(gridBehavior);

        // assumes the level has already been populated before starting
        let player = room.getInstances().find(actorInstance => actorInstance.parent === PlayerActor);

        // define a view that follows the player
        let viewBehavior = new ViewedRoomBehavior(0, 0, canvasWidth, canvasHeight);
        room.use(viewBehavior);

        playerView = viewBehavior.getView();
        playerView.follow(player, true, 0, -(Constants.GridCellSize / 2)); // compensate for HUD height
        playerView.attach(room.createActor(ActorID.ExitButton));

        // Init HUD
        let HUD = Sprite.get(SpriteID.HUD);
        let ExitButton = Sprite.get(SpriteID.ExitButton);
        let Digits = Sprite.get(SpriteID.Digits);

        // Mouse/Touch input
        grid.onClick(gridClickEvent => {

            // cancel input if the level has been won or if the player is moving
            if (grid.room.get('complete') || player.speed) {
                return;
            }

            let clickedCell = gridClickEvent.getCell();
            let playerCell = grid.find(PlayerActor);

            if (clickedCell.containsInstanceOf(BlockActor)) {
                player.raiseEvent(GameAction.Lift, { block: clickedCell.getContents()[0], targetCell: clickedCell });
                return;
            }

            if (clickedCell.x < playerCell.x) {
                // move or jump left
                let leftCell = playerCell.getAdjacentCell(Direction.Left);
                let upLeftCell = leftCell.getAdjacentCell(Direction.Up);

                if (leftCell.isFree([BlockActor, WallActor])) {
                    player.raiseEvent(GameAction.Move, { direction: Direction.Left, targetCell: leftCell });
                }
                else if (leftCell.containsInstanceOf([BlockActor, WallActor]) && upLeftCell.isFree([BlockActor, WallActor])) {
                    player.raiseEvent(GameAction.Jump, { direction: Direction.Left, targetCell: upLeftCell });
                }
                else {
                    player.raiseEvent(GameAction.Turn, { direction: Direction.Left });
                }
            }
            else if (clickedCell.x > playerCell.x) {
                // move or jump right
                let rightCell = playerCell.getAdjacentCell(Direction.Right);
                let upRightCell = rightCell.getAdjacentCell(Direction.Up);

                if (rightCell.isFree([BlockActor, WallActor])) {
                    player.raiseEvent(GameAction.Move, { direction: Direction.Right, targetCell: rightCell });
                }
                else if (rightCell.containsInstanceOf([BlockActor, WallActor]) && upRightCell.isFree([BlockActor, WallActor])) {
                    player.raiseEvent(GameAction.Jump, { direction: Direction.Right, targetCell: upRightCell });
                }
                else {
                    player.raiseEvent(GameAction.Turn, { direction: Direction.Right });
                }
            }
        });
    })
    .onDraw((room, context) => {
        let hudX = playerView.x;
        let hudY = playerView.y;

        Sprite.get(SpriteID.HUD).draw(context, hudX, hudY, { tileX: true });
        Sprite.get(SpriteID.ExitButton).draw(context, hudX, hudY);

        let drawInstances = getDigitDrawInstances(levelNumber, true);
        drawInstances.forEach(draw => Sprite.get(SpriteID.Digits).draw(context, hudX + (canvasWidth / 2) - 32 + draw.x, hudY + 12, { frame: draw.frame }));
    })
    .onKey(Key.Left, (room, ev) => {
        let player = room.getInstances().find(actorInstance => actorInstance.parent === PlayerActor);

        let playerCell = grid.getCellAtPosition(player.x, player.y);
        let leftCell = playerCell.getAdjacentCell(Direction.Left);
        let topLeftCell = leftCell.getAdjacentCell(Direction.Up);

        let isLeftBlocked = leftCell.containsInstanceOf(WallActor) || leftCell.containsInstanceOf(BlockActor);

        if (topLeftCell.isFree() && isLeftBlocked) {
            grid.raiseClickEvent(player.x - Constants.GridCellSize, player.y - Constants.GridCellSize);
        }
        else if (!isLeftBlocked) {
            grid.raiseClickEvent(player.x - Constants.GridCellSize, player.y);
        }
    })
    .onKey(Key.Right, (room, ev) => {
        let player = room.getInstances().find(actorInstance => actorInstance.parent === PlayerActor);

        let playerCell = grid.getCellAtPosition(player.x, player.y);
        let rightCell = playerCell.getAdjacentCell(Direction.Right);
        let topRightCell = rightCell.getAdjacentCell(Direction.Up);

        let isRightBlocked = rightCell.containsInstanceOf(WallActor) || rightCell.containsInstanceOf(BlockActor);

        if (topRightCell.isFree() && isRightBlocked) {
            grid.raiseClickEvent(player.x + Constants.GridCellSize, player.y - Constants.GridCellSize);
        }
        else if (!isRightBlocked) {
            grid.raiseClickEvent(player.x + Constants.GridCellSize, player.y);
        }
    })
    .onKey(Key.Down, (room, ev) => {
        let player = room.getInstances().find(actorInstance => actorInstance.parent === PlayerActor);

        let playerCell = grid.getCellAtPosition(player.x, player.y);
        let leftCell = playerCell.getAdjacentCell(Direction.Left);
        let rightCell = playerCell.getAdjacentCell(Direction.Right);
        let topCell = playerCell.getAdjacentCell(Direction.Up);
        let topLeftCell = topCell.getAdjacentCell(Direction.Left);
        let topRightCell = topCell.getAdjacentCell(Direction.Right);

        if (topCell.containsInstanceOf(BlockActor)) {
            // drop
            grid.raiseClickEvent(player.x, player.y - Constants.GridCellSize);
        }
        else {
            // lift
            if (leftCell.containsInstanceOf(BlockActor) && topLeftCell.isFree()) {
                grid.raiseClickEvent(player.x - Constants.GridCellSize, player.y);
            }

            if (rightCell.containsInstanceOf(BlockActor) && topRightCell.isFree()) {
                grid.raiseClickEvent(player.x + Constants.GridCellSize, player.y);
            }
        }
    });
