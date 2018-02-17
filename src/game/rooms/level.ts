import { Actor, ActorInstance, Direction, GridCell, Input, Key, Room, ViewedRoomBehavior, Sprite, Vastgame } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, RoomID, SpriteID, GameAction, Settings } from './../util/enum';
import { Registry } from './../util/registry';
import { GridRoomBehavior } from '../../engine/room-ext';

let LevelRoom = Room.define(RoomID.Level);

LevelRoom.onStart(() => {
    LevelRoom.set('complete', false);

    let BlockActor = Actor.get(ActorID.Block);
    let PlayerActor = Actor.get(ActorID.Player);
    let WallActor = Actor.get(ActorID.Wall);

    // assumes the level has already been populated before starting
    let player = LevelRoom.getInstances().find(actorInstance => actorInstance.parent === PlayerActor);

    // define a view that follows the player and has the "X" button attached
    const canvasWidth = Registry.get(Settings.CanvasWidth);
    const canvasHeight = Registry.get(Settings.CanvasHeight);
    const viewHUDBuffer = Constants.GridCellSize / 4;

    let viewBehavior = new ViewedRoomBehavior(0, 0, canvasWidth, canvasHeight);
    LevelRoom.use(viewBehavior);
    
    let playerView = viewBehavior.getView();
    playerView.follow(player, true);
    playerView.attach(LevelRoom.createActor(ActorID.ExitButton), canvasWidth - Constants.GridCellSize - viewHUDBuffer, viewHUDBuffer);

    // define the movement grid and player behavior
    let gridBehavior = new GridRoomBehavior(Constants.GridCellSize, LevelRoom);
    let grid = gridBehavior.getGrid();
    LevelRoom.use(gridBehavior);

    grid.onClick(gridClickEvent => {

        // cancel input if the level has been won or if the player is moving
        if (LevelRoom.get('complete') || player.speed) {
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
            else if (leftCell.containsInstanceOf([BlockActor, WallActor]) && upLeftCell.isFree()) {
                player.raiseEvent(GameAction.Jump, { direction: Direction.Left, targetCell: upLeftCell });
            }
        }
        else if (clickedCell.x > playerCell.x) {
            // move or jump right
            let rightCell = playerCell.getAdjacentCell(Direction.Right);
            let upRightCell = rightCell.getAdjacentCell(Direction.Up);

            if (rightCell.isFree([BlockActor, WallActor])) {
                player.raiseEvent(GameAction.Move, { direction: Direction.Right, targetCell: rightCell });
            }
            else if (rightCell.containsInstanceOf([BlockActor, WallActor]) && upRightCell.isFree()) {
                player.raiseEvent(GameAction.Jump, { direction: Direction.Right, targetCell: upRightCell });
            }
        }
    });

    // Keyboard input
    LevelRoom.onKey(Key.Left, () => {
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
    });

    LevelRoom.onKey(Key.Right, () => {
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
    });

    LevelRoom.onKey(Key.Down, () => {
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
});
