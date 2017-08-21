import { Actor, ActorInstance, Direction, GridCell, Input, Key, Room } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, RoomID, GameAction, Settings } from './../util/enum';
import { LevelBuilder } from './../util/level-builder';
import { Registry } from './../util/registry';
import { SpriteFader } from './../util/sprite-fader';

let levelRoom = Room.define(RoomID.Level);

levelRoom.onStart(() => {
    let Block = Actor.get(ActorID.Block);
    let Player = Actor.get(ActorID.Player);
    let Wall = Actor.get(ActorID.Wall);

    SpriteFader.fadeIn([Block.sprite, Player.sprite, Wall.sprite]);

    let playerInstance = levelRoom.getInstances().find(actorInstance => actorInstance.parent === Player);

    // define a view that follows the player
    let canvasWidth = Registry.get(Settings.CanvasWidth);
    let canvasHeight = Registry.get(Settings.CanvasHeight);
    levelRoom.defineView(0, 0, canvasWidth, canvasHeight)
        .follow(playerInstance, true);

    // define the movement grid and player behavior
    let grid = levelRoom.defineGrid(Constants.GridCellSize);
    grid.onClick(gridClickEvent => {
        let clickedCell = gridClickEvent.getCell();

        // do nothing if the player is moving or if a wall was clicked on
        if (playerInstance.speed || clickedCell.getContents().some(instance => instance.parent === Wall)) {
            return;
        }

        let leftCell = clickedCell.getAdjacentCell(Direction.Left);
        let rightCell = clickedCell.getAdjacentCell(Direction.Right);
        let downCell = clickedCell.getAdjacentCell(Direction.Down);

        let downLeftCell = leftCell.getAdjacentCell(Direction.Down);
        let downRightCell = rightCell.getAdjacentCell(Direction.Down);
        
        if (clickedCell.containsInstanceOf(Block)) {
            playerInstance.raiseEvent(GameAction.Lift, { block: clickedCell.getContents()[0], targetCell: clickedCell });
        }
        else if (rightCell.containsInstance(playerInstance)) {
            playerInstance.raiseEvent(GameAction.Move, { direction: Direction.Left, targetCell: clickedCell });
        }
        else if (leftCell.containsInstance(playerInstance)) {
            playerInstance.raiseEvent(GameAction.Move, { direction: Direction.Right, targetCell: clickedCell });
        }
        else if (downLeftCell.containsInstance(playerInstance) && (downCell.containsInstanceOf(Block) || downCell.containsInstanceOf(Wall))) {
            playerInstance.raiseEvent(GameAction.Jump, { direction: Direction.Right, targetCell: clickedCell });
        }
        else if (downRightCell.containsInstance(playerInstance) && (downCell.containsInstanceOf(Block) || downCell.containsInstanceOf(Wall))) {
            playerInstance.raiseEvent(GameAction.Jump, { direction: Direction.Left, targetCell: clickedCell });
        }
    });

    // Keyboard input
    Input.onKey(Key.Left, () => {
        let playerCell = grid.getCellAtPosition(playerInstance.x, playerInstance.y);
        let leftCell = playerCell.getAdjacentCell(Direction.Left);
        let topLeftCell = leftCell.getAdjacentCell(Direction.Up);

        if (topLeftCell.isFree() && (leftCell.containsInstanceOf(Wall) || leftCell.containsInstanceOf(Block))) {
            grid.raiseClickEvent(playerInstance.x - Constants.GridCellSize, playerInstance.y - Constants.GridCellSize);
        }
        else if (leftCell.isFree()) {
            grid.raiseClickEvent(playerInstance.x - Constants.GridCellSize, playerInstance.y);
        }
    });

    Input.onKey(Key.Right, () => {
        let playerCell = grid.getCellAtPosition(playerInstance.x, playerInstance.y);
        let rightCell = playerCell.getAdjacentCell(Direction.Right);
        let topRightCell = rightCell.getAdjacentCell(Direction.Up);

        if (topRightCell.isFree() && (rightCell.containsInstanceOf(Wall) || rightCell.containsInstanceOf(Block))) {
            grid.raiseClickEvent(playerInstance.x + Constants.GridCellSize, playerInstance.y - Constants.GridCellSize);
        }
        else if (rightCell.isFree()) {
            grid.raiseClickEvent(playerInstance.x + Constants.GridCellSize, playerInstance.y);
        }
    });

    Input.onKey(Key.Down, () => {
        let playerCell = grid.getCellAtPosition(playerInstance.x, playerInstance.y);
        let leftCell = playerCell.getAdjacentCell(Direction.Left);
        let rightCell = playerCell.getAdjacentCell(Direction.Right);
        let topCell = playerCell.getAdjacentCell(Direction.Up);
        let topLeftCell = topCell.getAdjacentCell(Direction.Left);
        let topRightCell = topCell.getAdjacentCell(Direction.Right);

        if (topCell.containsInstanceOf(Block)) {
            // drop
            grid.raiseClickEvent(playerInstance.x, playerInstance.y - Constants.GridCellSize);
        }
        else {
            // lift
            if (leftCell.containsInstanceOf(Block) && topLeftCell.isFree()) {
                grid.raiseClickEvent(playerInstance.x - Constants.GridCellSize, playerInstance.y);
            }

            if (rightCell.containsInstanceOf(Block) && topRightCell.isFree()) {
                grid.raiseClickEvent(playerInstance.x + Constants.GridCellSize, playerInstance.y);
            }
        }
    });
});
