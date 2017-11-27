import { Actor, ActorInstance, Boundary, Enum, Input, GridCell, Room, Sprite } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, GameAction, SpriteID } from './../util/enum';

let BotSprite = Sprite.define(SpriteID.StackmoSheet, {
    imageSource: '../resources/stackmo_sheet.png',
    height: Constants.GridCellSize,
    width: Constants.GridCellSize,
    frameBorder: 4,
});

let Player = Actor.define(ActorID.Player, {
    boundary: Boundary.fromSprite(BotSprite),
    sprite: BotSprite,
});

let heldBlock: ActorInstance;
let lastDirection: Enum.Direction;

Player.onCreate(self => {
    self.animation.depth = -50;
    lastDirection = Enum.Direction.Right;
    heldBlock = null;
});

Player.onStep(self => {

    if (heldBlock) {
        heldBlock.setPosition(self.x, self.y - Constants.GridCellSize);
    }
});

// Moving
Player.onEvent(GameAction.Move, (player, args) => {
    let targetCell: GridCell = args.targetCell;
    let direction: Enum.Direction = args.direction;
    let startX = player.x;

    let stopCondition = (): boolean => {
        return Math.abs(startX - player.x) >= Constants.GridCellSize;
    };

    lastDirection = direction;

    // clearance check
    if (!heldBlock || (heldBlock && targetCell.getAdjacentCell(Enum.Direction.Up).isFree())) {
        player.move(Constants.PlayerMoveSpeed, direction);
        player.raiseEventWhen(GameAction.CheckStopMoving, stopCondition, args);
    
        animate(player, direction, true);
    }
});

// Stop moving or continue
Player.onEvent(GameAction.CheckStopMoving, (player, args) => {
    let targetCell: GridCell = args.targetCell;
    let action = GameAction.Stop;

    // snap to the grid
    player.move(0);
    player.setPosition(targetCell.x, targetCell.y);

    if (Input.clickActive || Input.keyDown(lastDirection === Enum.Direction.Left ? Enum.Key.Left : Enum.Key.Right)) {
        let nextCell = targetCell.getAdjacentCell(lastDirection);
        let belowCell = targetCell.getAdjacentCell(Enum.Direction.Down);

        if (nextCell.isFree() && !belowCell.isFree()) {
            args.targetCell = nextCell;
            action = GameAction.Move
        }
    }

    player.raiseEvent(action, args);
});

// Falling
Player.onEvent(GameAction.Fall, (player, args) => {
    let startY = player.y;
    let direction: Enum.Direction = args.direction;
    let stopCondition = (): boolean =>  Math.abs(startY - player.y) >= Constants.GridCellSize;

    // move the target cell to the one below the previous target cell
    args.targetCell = args.targetCell.getAdjacentCell(Enum.Direction.Down);

    player.move(Constants.PlayerFallSpeed, Enum.Direction.Down);
    player.raiseEventWhen(GameAction.Stop, stopCondition, args);

    animate(player, direction, false);
})

// Stopping
Player.onEvent(GameAction.Stop, (player, args) => {
    let room: Room = args.game.currentRoom;
    let targetCell: GridCell = args.targetCell;

    // snap to the grid
    player.move(0);
    player.setPosition(targetCell.x, targetCell.y);

    // check if falling
    if (room.isPositionFree(player.x + 1, player.y + Constants.GridCellSize + 1)) {
        player.raiseEvent(GameAction.Fall, args);
    }
    else {
        animate(player, lastDirection);
    }

    // check for victory
    let WinActor = Actor.get(ActorID.Win);
    if (targetCell.containsInstanceOf(WinActor)) {
        let win = room.getInstances().find(actorInstance => actorInstance.parent === WinActor);
        win.raiseEvent(GameAction.Win);
    }
});

// Jumping
Player.onEvent(GameAction.Jump, (player, args) => {
    let targetCell: GridCell = args.targetCell;
    let direction: Enum.Direction = args.direction;
    let startY = player.y;

    // clearance check
    let cellAbovePlayer = targetCell.getAdjacentCell(direction === Enum.Direction.Right ? Enum.Direction.Left : Enum.Direction.Right);
    let cellAboveBox = !!heldBlock ? cellAbovePlayer.getAdjacentCell(Enum.Direction.Up) : null;

    let canJump = !!cellAboveBox 
        ? cellAboveBox.isFree() && cellAboveBox.getAdjacentCell(direction).isFree()
        : cellAbovePlayer.isFree() ;

    if (canJump) {
        // stop after moving up one space
        let stopCondition = (): boolean => Math.abs(startY - player.y) >= Constants.GridCellSize;
        player.move(Constants.PlayerJumpSpeed, Enum.Direction.Up);
        player.raiseEventWhen(GameAction.Move, stopCondition, args);
    }
});

// Lifting
Player.onEvent(GameAction.Lift, (player, args) => {
    let block: ActorInstance = args.block;
    let targetCell: GridCell = args.targetCell;

    let validBlockLiftCellDirection = lastDirection === Enum.Direction.Left ? Enum.Direction.Right : Enum.Direction.Left;

    // prevent lifting if there's something on top of the box or on top of the player
    let aboveBoxCell = targetCell.getAdjacentCell(Enum.Direction.Up);
    let abovePlayerCell = aboveBoxCell.getAdjacentCell(validBlockLiftCellDirection);

    if (!heldBlock && !(aboveBoxCell.isFree() && abovePlayerCell.isFree())) {
        return;
    }
    
    if (heldBlock && block === heldBlock) {
        player.raiseEvent(GameAction.Drop, args);
    }
    else if (!heldBlock && targetCell.getAdjacentCell(validBlockLiftCellDirection).containsInstance(player)) {
        heldBlock = block;
        animate(player, lastDirection);
    }
});

// Drop
Player.onEvent(GameAction.Drop, (player, args) => {
    let block: ActorInstance = args.block;
    let targetCell: GridCell = args.targetCell;
    let offsetX = lastDirection === Enum.Direction.Left ? -Constants.GridCellSize : Constants.GridCellSize;

    // prevent dropping if there's something in the way of the box
    if (targetCell.getAdjacentCell(lastDirection).isFree()) {
        args.targetCell = args.targetCell.getAdjacentCell(lastDirection);
        
        heldBlock = null;
    
        block.setPositionRelative(offsetX, 0);
        block.raiseEvent(GameAction.Fall, args);
    
        animate(player, lastDirection);
    }
});

// Helpers
// enums values correspond to sprite sheet frames
enum StackmoFrame {
    StandLeft = 0,
    MoveLeft1 = 1,
    MoveLeft2 = 2,
    StandRight = 3,
    MoveRight1 = 4,
    MoveRight2 = 5,
    StandHoldLeft = 6,
    MoveHoldLeft1 = 7,
    MoveHoldLeft2 = 8,
    StandHoldRight = 9,
    MoveHoldRight1 = 10,
    MoveHolddRight2 = 11,
}

function animate(player: ActorInstance, direction: Enum.Direction, isMoving: boolean = false): void {
    const animationSpeed = 100;
    let startFrame = StackmoFrame.StandRight;
    
    if (!!heldBlock) {
        startFrame = direction === Enum.Direction.Right ? StackmoFrame.StandHoldRight : StackmoFrame.StandHoldLeft;
    }
    else {
        startFrame = direction === Enum.Direction.Right ? StackmoFrame.StandRight : StackmoFrame.StandLeft;
    }

    if (isMoving) {
        player.spriteAnimation.start(startFrame + 1, startFrame + 2, animationSpeed);
    }
    else {
        player.spriteAnimation.set(startFrame);
    }
}
