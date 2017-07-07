import { Actor, ActorInstance, Boundary, Direction, GridCell, Room, Sprite } from './../../engine/vastgame';

let BlockSprite = Sprite.define({
    imageSource: 'img/box.png',
    height: 64,
    width: 64,
});

let Block = Actor.define('Block', {
    boundary: Boundary.fromSprite(BlockSprite),
    sprite: BlockSprite,
});

// TODO: need a way to share Game-wide constants, enums, code
const BlockFallSpeed = 8;

// Falling
Block.onEvent('fall', (block, args) => {
    let room: Room = args.game.currentRoom;

    if (!room.isPositionFree(block.x + 1, block.y + 65)) {
        return;
    }

    let startY = block.y;
    let stopCondition = (): boolean =>  Math.abs(startY - block.y) >= 64;

    // move the target cell to the one below the previous target cell
    args.targetCell = args.targetCell.getAdjacentCell(Direction.Down);

    block.move(BlockFallSpeed, Direction.Down);
    block.raiseEventWhen('stop', stopCondition, args);
})

// Stopping
Block.onEvent('stop', (block, args) => {
    let room: Room = args.game.currentRoom;
    let targetCell: GridCell = args.targetCell;

    // snap to the grid
    block.move(0);
    block.setPosition(targetCell.x, targetCell.y);

    // check if falling
    if (room.isPositionFree(block.x + 1, block.y + 65)) {
        block.raiseEvent('fall', args);
    }
});