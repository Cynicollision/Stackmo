import { Actor, ActorInstance, Boundary,  Direction, GridCell, Room, Sprite } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, GameAction } from './../util/enum';

let BotSprite = Sprite.define({
    imageSource: 'resources/bot_sheet.png',
    height: 64,
    width: 64,
    frameBorder: 1,
});

let Player = Actor.define(ActorID.Player, {
    boundary: Boundary.fromSprite(BotSprite),
    sprite: BotSprite,
});

let heldBlock: ActorInstance;
let lastDirection: Direction;

Player.onStep(self => {

    if (heldBlock) {
        heldBlock.setPosition(self.x, self.y - 64);
    }
});

// Walking
Player.onEvent(GameAction.Move, (player, args) => {
    let direction: Direction = args.direction;
    let startX = player.x;
    let stopCondition = (): boolean => Math.abs(startX - player.x) >= 64;

    lastDirection = direction;

    player.move(Constants.PlayerMoveSpeed, direction);
    player.raiseEventWhen(GameAction.Stop, stopCondition, args);

    animate(player, direction, true);
});

// Falling
Player.onEvent(GameAction.Fall, (player, args) => {
    let startY = player.y;
    let stopCondition = (): boolean =>  Math.abs(startY - player.y) >= 64;

    // move the target cell to the one below the previous target cell
    args.targetCell = args.targetCell.getAdjacentCell(Direction.Down);

    player.move(Constants.PlayerFallSpeed, Direction.Down);
    player.raiseEventWhen(GameAction.Stop, stopCondition, args);
})

// Stopping
Player.onEvent(GameAction.Stop, (player, args) => {
    let room: Room = args.game.currentRoom;
    let targetCell: GridCell = args.targetCell;

    // snap to the grid
    player.move(0);
    player.setPosition(targetCell.x, targetCell.y);

    // check if falling
    if (room.isPositionFree(player.x + 1, player.y + 65)) {
        player.raiseEvent(GameAction.Fall, args);
    }
    else {
        animate(player, lastDirection);
    }
});

// Jumping
Player.onEvent(GameAction.Jump, (player, args) => {
    let targetCell: GridCell = args.targetCell;
    let direction: Direction = args.direction;
    let startY = player.y;
    let stopCondition = (): boolean => Math.abs(startY - player.y) >= 64;

    player.move(Constants.PlayerJumpSpeed, Direction.Up);
    player.raiseEventWhen(GameAction.Move, stopCondition, args);
});

// Lifting
Player.onEvent(GameAction.Lift, (player, args) => {
    let block: ActorInstance = args.block;
    let targetCell: GridCell = args.targetCell;

    let validBlockLiftCell = lastDirection === Direction.Left ? Direction.Right : Direction.Left;
    
    if (heldBlock && block === heldBlock) {
        player.raiseEvent(GameAction.Drop, args);
    }
    else if (targetCell.getAdjacentCell(validBlockLiftCell).containsInstance(player)) {
        heldBlock = block;
        animate(player, lastDirection);
    }
});

// Drop
Player.onEvent(GameAction.Drop, (player, args) => {
    let block: ActorInstance = args.block;
    let offsetX = lastDirection === Direction.Left ? -64 : 64;

    args.targetCell = args.targetCell.getAdjacentCell(lastDirection);
    
    heldBlock = null;

    block.setPositionRelative(offsetX, 0);
    block.raiseEvent(GameAction.Fall, args);

    animate(player, lastDirection);
});

// Helpers
function animate(player: ActorInstance, direction: Direction, isMoving: boolean = false): void {
    let isHolding = !!heldBlock;
    let start = 0;
    
    if (isHolding) {
        start = direction === Direction.Right ? 4 : 6;
    }
    else {
        start = direction === Direction.Right ? 0 : 2;
    }

    if (isMoving) {
        player.spriteAnimation.start(start, start + 1, 100);
    }
    else {
        player.spriteAnimation.set(start);
    }
}
