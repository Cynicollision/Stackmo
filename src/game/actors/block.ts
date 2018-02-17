import { Actor, Boundary, Direction, GridCell, Room, Sprite } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, GameAction, SpriteID } from './../util/enum';

Actor
    .define(ActorID.Block, {
        sprite: Sprite.get(SpriteID.Box),
    })
    // Falling
    .onEvent(GameAction.Fall, (block, args) => {
        let room: Room = args.game.currentRoom;

        if (!room.isPositionFree(block.x + 1, block.y + Constants.GridCellSize + 1)) {
            return;
        }

        let startY = block.y;
        let stopCondition = (): boolean =>  Math.abs(startY - block.y) >= Constants.GridCellSize;

        // move the target cell to the one below the previous target cell
        args.targetCell = args.targetCell.getAdjacentCell(Direction.Down);

        block.move(Constants.BlockFallSpeed, Direction.Down);
        block.raiseEventWhen(GameAction.Stop, stopCondition, args);
    })
    // Stopping
    .onEvent(GameAction.Stop, (block, args) => {
        let room: Room = args.game.currentRoom;
        let targetCell: GridCell = args.targetCell;

        // snap to the grid
        block.move(0);
        block.setPosition(targetCell.x, targetCell.y);

        // check if falling
        if (room.isPositionFree(block.x + 1, block.y + Constants.GridCellSize + 1)) {
            block.raiseEvent(GameAction.Fall, args);
        }
    });