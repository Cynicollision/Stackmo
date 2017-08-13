import { Actor, ActorInstance, Direction, GridCell, Input, Key, Room } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, RoomID, GameAction, Settings } from './../util/enum';
import { LevelBuilder } from './../util/level-builder';
import { Registry } from './../util/registry';

let levelRoom = Room.define(RoomID.Level);

levelRoom.onStart(() => {
    let Block = Actor.get(ActorID.Block);
    let Wall = Actor.get(ActorID.Wall);

    let instances = LevelBuilder.populateRoom(levelRoom, 1);
    let player = instances.find(actorInstance => actorInstance.parent === Actor.get(ActorID.Player));

    // define a view that follows the player
    let canvasWidth = Registry.get(Settings.CanvasWidth);
    let canvasHeight = Registry.get(Settings.CanvasHeight);
    levelRoom.defineView(0, 0, canvasWidth, canvasHeight)
        .follow(player, true);

    // define the movement grid and player behavior
    let grid = levelRoom.defineGrid(Constants.GridCellSize);
    grid.onClick(gridClickEvent => {
        let clickedCell = gridClickEvent.getCell();

        // do nothing if the player is moving or if a wall was clicked on
        if (player.speed || clickedCell.getContents().some(instance => instance.parent === Wall)) {
            return;
        }

        let leftCell = clickedCell.getAdjacentCell(Direction.Left);
        let rightCell = clickedCell.getAdjacentCell(Direction.Right);
        let downCell = clickedCell.getAdjacentCell(Direction.Down);

        let downLeftCell = leftCell.getAdjacentCell(Direction.Down);
        let downRightCell = rightCell.getAdjacentCell(Direction.Down);
        
        if (clickedCell.containsInstanceOf(Block)) {
            player.raiseEvent(GameAction.Lift, { block: clickedCell.getContents()[0], targetCell: clickedCell });
        }
        else if (rightCell.containsInstance(player)) {
            player.raiseEvent(GameAction.Move, { direction: Direction.Left, targetCell: clickedCell });
        }
        else if (leftCell.containsInstance(player)) {
            player.raiseEvent(GameAction.Move, { direction: Direction.Right, targetCell: clickedCell });
        }
        else if (downLeftCell.containsInstance(player) && (downCell.containsInstanceOf(Block) || downCell.containsInstanceOf(Wall))) {
            player.raiseEvent(GameAction.Jump, { direction: Direction.Right, targetCell: clickedCell });
        }
        else if (downRightCell.containsInstance(player) && (downCell.containsInstanceOf(Block) || downCell.containsInstanceOf(Wall))) {
            player.raiseEvent(GameAction.Jump, { direction: Direction.Left, targetCell: clickedCell });
        }
    });

    Input.onKey(Key.Left, () => {
        let playerCell = grid.getCellAtPosition(player.x, player.y);
        let leftCell = playerCell.getAdjacentCell(Direction.Left);
        let topLeftCell = leftCell.getAdjacentCell(Direction.Up);

        if (!topLeftCell.containsAnyInstance() && (leftCell.containsInstanceOf(Wall) || leftCell.containsInstanceOf(Block))) {
            grid.raiseClickEvent(player.x - Constants.GridCellSize, player.y - Constants.GridCellSize);
        }
        else if (!leftCell.containsAnyInstance()) {
            grid.raiseClickEvent(player.x - Constants.GridCellSize, player.y);
        }
    });

    Input.onKey(Key.Right, () => {
        let playerCell = grid.getCellAtPosition(player.x, player.y);
        let rightCell = playerCell.getAdjacentCell(Direction.Right);
        let topRightCell = rightCell.getAdjacentCell(Direction.Up);

        if (!topRightCell.containsAnyInstance() && (rightCell.containsInstanceOf(Wall) || rightCell.containsInstanceOf(Block))) {
            grid.raiseClickEvent(player.x + Constants.GridCellSize, player.y - Constants.GridCellSize);
        }
        else if (!rightCell.containsAnyInstance()) {
            grid.raiseClickEvent(player.x + Constants.GridCellSize, player.y);
        }
    });

    Input.onKey(Key.Down, () => {
        let playerCell = grid.getCellAtPosition(player.x, player.y);
        let leftCell = playerCell.getAdjacentCell(Direction.Left);
        let rightCell = playerCell.getAdjacentCell(Direction.Right);
        let topCell = playerCell.getAdjacentCell(Direction.Up);
        let topLeftCell = topCell.getAdjacentCell(Direction.Left);
        let topRightCell = topCell.getAdjacentCell(Direction.Right);

        if (topCell.containsInstanceOf(Block)) {
            // drop
            grid.raiseClickEvent(player.x, player.y - Constants.GridCellSize);
        }
        else {
            // lift
            if (leftCell.containsInstanceOf(Block) && !topLeftCell.containsAnyInstance()) {
                grid.raiseClickEvent(player.x - Constants.GridCellSize, player.y);
            }

            if (rightCell.containsInstanceOf(Block) && !topRightCell.containsAnyInstance()) {
                grid.raiseClickEvent(player.x + Constants.GridCellSize, player.y);
            }
        }
    });
});
