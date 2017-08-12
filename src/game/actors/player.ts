import { 
    Actor,
    ActorInstance,
    Boundary, 
    Direction,
    Grid,
    GridCell,
    Room,
    Sprite
} from './../../engine/vastgame';

enum PlayerEvent {
    Drop = 'drop',
    Fall = 'fall',
    Jump = 'jump',
    Lift = 'lift',
    Move = 'move',
    Stop = 'stop',
}

// TODO: need a way to share Game-wide constants, enums
const PlayerMoveSpeed = 4;
const PlayerJumpSpeed = 8;
const PlayerFallSpeed = 8;

let BotSprite = Sprite.define({
    imageSource: 'img/bot_sheet.png',
    height: 64,
    width: 64,
    frameBorder: 1,
});

let Player = Actor.define('Player', {
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
Player.onEvent(PlayerEvent.Move, (player, args) => {
    let direction: Direction = args.direction;
    let startX = player.x;
    let stopCondition = (): boolean => Math.abs(startX - player.x) >= 64;

    lastDirection = direction;

    player.move(PlayerMoveSpeed, direction);
    player.raiseEventWhen(PlayerEvent.Stop, stopCondition, args);

    animate(player, direction, true);
});

// Falling
Player.onEvent(PlayerEvent.Fall, (player, args) => {
    let startY = player.y;
    let stopCondition = (): boolean =>  Math.abs(startY - player.y) >= 64;

    // move the target cell to the one below the previous target cell
    args.targetCell = args.targetCell.getAdjacentCell(Direction.Down);

    player.move(PlayerFallSpeed, Direction.Down);
    player.raiseEventWhen(PlayerEvent.Stop, stopCondition, args);
})

// Stopping
Player.onEvent(PlayerEvent.Stop, (player, args) => {
    let room: Room = args.game.currentRoom;
    let targetCell: GridCell = args.targetCell;

    // snap to the grid
    player.move(0);
    player.setPosition(targetCell.x, targetCell.y);

    // check if falling
    if (room.isPositionFree(player.x + 1, player.y + 65)) {
        player.raiseEvent(PlayerEvent.Fall, args);
    }
    else {
        animate(player, lastDirection);
    }
});

// Jumping
Player.onEvent(PlayerEvent.Jump, (player, args) => {
    let targetCell: GridCell = args.targetCell;
    let direction: Direction = args.direction;
    let startY = player.y;
    let stopCondition = (): boolean => Math.abs(startY - player.y) >= 64;

    player.move(PlayerJumpSpeed, Direction.Up);
    player.raiseEventWhen(PlayerEvent.Move, stopCondition, args);
});

// Lifting
Player.onEvent(PlayerEvent.Lift, (player, args) => {
    let block: ActorInstance = args.block;
    let targetCell: GridCell = args.targetCell;

    let validBlockLiftCell = lastDirection === Direction.Left ? Direction.Right : Direction.Left;
    
    if (heldBlock && block === heldBlock) {
        player.raiseEvent(PlayerEvent.Drop, args);
    }
    else if (targetCell.getAdjacentCell(validBlockLiftCell).containsInstance(player)) {
        heldBlock = block;
        animate(player, lastDirection);
    }
});

// Drop
Player.onEvent(PlayerEvent.Drop, (player, args) => {
    let block: ActorInstance = args.block;
    let offsetX = lastDirection === Direction.Left ? -64 : 64;

    args.targetCell = args.targetCell.getAdjacentCell(lastDirection);
    
    heldBlock = null;

    block.setPositionRelative(offsetX, 0);
    block.raiseEvent('fall', args);

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
