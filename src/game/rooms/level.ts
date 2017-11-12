import { Actor, ActorInstance, Direction, GridCell, Input, Key, Room, Sprite } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, RoomID, SpriteID, GameAction, Settings } from './../util/enum';
import { Registry } from './../util/registry';
import { SpriteFader } from './../util/sprite-fader';
import { Vastgame } from './../../engine/vastgame';

let LevelRoom = Room.define(RoomID.Level);

LevelRoom.onStart(() => {
    let BlockActor = Actor.get(ActorID.Block);
    let ExitButtonActor = Actor.get(ActorID.ExitButton);
    let PlayerActor = Actor.get(ActorID.Player);
    let WallActor = Actor.get(ActorID.Wall);
    let WinActor = Actor.get(ActorID.Win);

    let DoorSprite = Sprite.get(SpriteID.DoorSheet);

    SpriteFader.fadeIn([ExitButtonActor.sprite, BlockActor.sprite, PlayerActor.sprite, WallActor.sprite, DoorSprite]);

    // assumes the level has already been populated before starting
    let player = LevelRoom.getInstances().find(actorInstance => actorInstance.parent === PlayerActor);

    // define a view that follows the player and has the "X" button attached
    const canvasWidth = Registry.get(Settings.CanvasWidth);
    const canvasHeight = Registry.get(Settings.CanvasHeight);
    const viewHUDBuffer = Constants.GridCellSize / 4;

    let playerView = LevelRoom.defineView(0, 0, canvasWidth, canvasHeight);
    playerView.follow(player, true);
    playerView.attach(LevelRoom.createActor(ExitButtonActor), canvasWidth - Constants.GridCellSize - viewHUDBuffer, viewHUDBuffer);

    // define the movement grid and player behavior
    let grid = LevelRoom.defineGrid(Constants.GridCellSize);
    grid.onClick(gridClickEvent => {
        let clickedCell = gridClickEvent.getCell();

        // do nothing if the player is moving or if a wall was clicked on
        if (player.speed || clickedCell.getContents().some(instance => instance.parent === WallActor)) {
            return;
        }

        let leftCell = clickedCell.getAdjacentCell(Direction.Left);
        let rightCell = clickedCell.getAdjacentCell(Direction.Right);
        let downCell = clickedCell.getAdjacentCell(Direction.Down);

        let downLeftCell = leftCell.getAdjacentCell(Direction.Down);
        let downRightCell = rightCell.getAdjacentCell(Direction.Down);
        
        if (clickedCell.containsInstanceOf(BlockActor)) {
            player.raiseEvent(GameAction.Lift, { block: clickedCell.getContents()[0], targetCell: clickedCell });
        }
        else if (rightCell.containsInstance(player)) {
            player.raiseEvent(GameAction.Move, { direction: Direction.Left, targetCell: clickedCell });
        }
        else if (leftCell.containsInstance(player)) {
            player.raiseEvent(GameAction.Move, { direction: Direction.Right, targetCell: clickedCell });
        }
        else if (downLeftCell.containsInstance(player) && (downCell.containsInstanceOf(BlockActor) || downCell.containsInstanceOf(WallActor))) {
            player.raiseEvent(GameAction.Jump, { direction: Direction.Right, targetCell: clickedCell });
        }
        else if (downRightCell.containsInstance(player) && (downCell.containsInstanceOf(BlockActor) || downCell.containsInstanceOf(WallActor))) {
            player.raiseEvent(GameAction.Jump, { direction: Direction.Left, targetCell: clickedCell });
        }
    });

    // Keyboard input
    LevelRoom.onKey(Key.Left, () => {
        let playerCell = grid.getCellAtPosition(player.x, player.y);
        let leftCell = playerCell.getAdjacentCell(Direction.Left);
        let topLeftCell = leftCell.getAdjacentCell(Direction.Up);

        if (topLeftCell.isFree() && (leftCell.containsInstanceOf(WallActor) || leftCell.containsInstanceOf(BlockActor))) {
            grid.raiseClickEvent(player.x - Constants.GridCellSize, player.y - Constants.GridCellSize);
        }
        else if (leftCell.isFree()) {
            grid.raiseClickEvent(player.x - Constants.GridCellSize, player.y);
        }
    });

    LevelRoom.onKey(Key.Right, () => {
        let playerCell = grid.getCellAtPosition(player.x, player.y);
        let rightCell = playerCell.getAdjacentCell(Direction.Right);
        let topRightCell = rightCell.getAdjacentCell(Direction.Up);

        if (topRightCell.isFree() && (rightCell.containsInstanceOf(WallActor) || rightCell.containsInstanceOf(BlockActor))) {
            grid.raiseClickEvent(player.x + Constants.GridCellSize, player.y - Constants.GridCellSize);
        }
        else if (rightCell.isFree()) {
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
