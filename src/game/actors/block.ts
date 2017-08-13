import { Actor, Boundary, Direction, GridCell, Room, Sprite } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { GameAction } from './../util/enum';

let BlockSprite = Sprite.define({
    imageSource: 'resources/box.png',
    height: 64,
    width: 64,
});

let Block = Actor.define('Block', {
    boundary: Boundary.fromSprite(BlockSprite),
    sprite: BlockSprite,
});

// Falling
Block.onEvent(GameAction.Fall, (block, args) => {
    let room: Room = args.game.currentRoom;

    if (!room.isPositionFree(block.x + 1, block.y + 65)) {
        return;
    }

    let startY = block.y;
    let stopCondition = (): boolean =>  Math.abs(startY - block.y) >= 64;

    // move the target cell to the one below the previous target cell
    args.targetCell = args.targetCell.getAdjacentCell(Direction.Down);

    block.move(Constants.BlockFallSpeed, Direction.Down);
    block.raiseEventWhen(GameAction.Stop, stopCondition, args);
})

// Stopping
Block.onEvent(GameAction.Stop, (block, args) => {
    let room: Room = args.game.currentRoom;
    let targetCell: GridCell = args.targetCell;

    // snap to the grid
    block.move(0);
    block.setPosition(targetCell.x, targetCell.y);

    // check if falling
    if (room.isPositionFree(block.x + 1, block.y + 65)) {
        block.raiseEvent(GameAction.Fall, args);
    }
});