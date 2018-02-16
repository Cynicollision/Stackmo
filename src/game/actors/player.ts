import { Actor, ActorInstance, Boundary, Direction, Key, Input, GridCell, Room, Sprite } from './../../engine/vastgame';
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
let lastDirection: Direction;

let solidActors: Actor[];
let Win: Actor;

Player.onCreate(self => {
    self.animation.depth = -50;
    lastDirection = Direction.Right;
    heldBlock = null;

    solidActors = [
        Actor.get(ActorID.Block),
        Actor.get(ActorID.Wall),
    ];

    Win = Actor.get(ActorID.Win);
});

Player.onStep(self => {

    if (heldBlock) {
        heldBlock.setPosition(self.x, self.y - Constants.GridCellSize);
    }
});

// Moving
Player.onEvent(GameAction.Move, (player, args) => {
    let targetCell: GridCell = args.targetCell;
    let direction: Direction = args.direction;
    let startX = player.x;

    let stopCondition = (): boolean => {
        return Math.abs(startX - player.x) >= Constants.GridCellSize;
    };

    lastDirection = direction;

    // clearance check
    if (!heldBlock || (heldBlock && targetCell.getAdjacentCell(Direction.Up).isFree())) {
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

    // continue movement if input is held and we're not about to win
    if (inputActive() && !targetCell.containsInstanceOf(Win)) {
        let belowCell = targetCell.getAdjacentCell(Direction.Down);

        if (!belowCell.isFree(solidActors)) {
            // determine the next cell based on where the current touch/click is (it may have moved)
            let clickAdjustedX = getClickAdjustedX(args.game.currentRoom);
            args.direction = clickAdjustedX <= player.x + (targetCell.size / 2) ? Direction.Left : Direction.Right;
            let nextCell = targetCell.getAdjacentCell(args.direction);

            if (nextCell.isFree(solidActors)) {
                args.targetCell = nextCell;
                action = GameAction.Move; 
            }
            else if (nextCell.getAdjacentCell(Direction.Up).isFree(solidActors)) {
                args.targetCell = nextCell.getAdjacentCell(Direction.Up);
                action = GameAction.Jump;
            }
        }
    }

    player.raiseEvent(action, args);
});

// Falling
Player.onEvent(GameAction.Fall, (player, args) => {
    let startY = player.y;
    let direction: Direction = args.direction;
    let stopCondition = (): boolean =>  Math.abs(startY - player.y) >= Constants.GridCellSize;

    // move the target cell to the one below the previous target cell
    args.targetCell = args.targetCell.getAdjacentCell(Direction.Down);

    player.move(Constants.PlayerFallSpeed, Direction.Down);
    player.raiseEventWhen(GameAction.StopFalling, stopCondition, args);

    animate(player, direction, false);
});

// Stop falling or continue moving
Player.onEvent(GameAction.StopFalling, (player, args) => {
    let targetCell: GridCell = args.targetCell;

    // snap to the grid
    player.move(0);
    player.setPosition(args.targetCell.x, args.targetCell.y);

    if (inputActive() && !targetCell.getAdjacentCell(Direction.Down).isFree(solidActors)) {
        args.targetCell = targetCell.getAdjacentCell(args.direction);

        if (args.targetCell.isFree(solidActors)) {
            player.raiseEvent(GameAction.Move, args);
        }
    }
    else {
        player.raiseEvent(GameAction.Stop, args);
    }
});

// Stopping
Player.onEvent(GameAction.Stop, (player, args) => {
    let room: Room = args.game.currentRoom;
    let targetCell: GridCell = args.targetCell;

    // snap to the grid
    player.move(0);
    player.setPosition(targetCell.x, targetCell.y);

    // stop animation
    animate(player, lastDirection, false);

    // check if falling
    if (room.isPositionFree(player.x + 1, player.y + Constants.GridCellSize + 1, solidActors)) {
        player.raiseEvent(GameAction.Fall, args);
        return;
    }

    // check for victory
    let Win = Actor.get(ActorID.Win);
    if (targetCell.containsInstanceOf(Win)) {
        room.getInstance(Win).raiseEvent(GameAction.Win);
    }
});

// Jumping
Player.onEvent(GameAction.Jump, (player, args) => {
    let targetCell: GridCell = args.targetCell;
    let direction: Direction = args.direction;
    let startY = player.y;

    // clearance check
    let cellAbovePlayer = targetCell.getAdjacentCell(direction === Direction.Right ? Direction.Left : Direction.Right);
    let cellAboveBox = !!heldBlock ? cellAbovePlayer.getAdjacentCell(Direction.Up) : null;

    let canJump = !!cellAboveBox 
        ? cellAboveBox.isFree() && cellAboveBox.getAdjacentCell(direction).isFree()
        : cellAbovePlayer.isFree() ;

    if (canJump) {
        // stop after moving up one space
        let stopCondition = (): boolean => Math.abs(startY - player.y) >= Constants.GridCellSize;
        player.move(Constants.PlayerJumpSpeed, Direction.Up);
        player.raiseEventWhen(GameAction.Move, stopCondition, args);
    }
});

// Lifting
Player.onEvent(GameAction.Lift, (player, args) => {
    let block: ActorInstance = args.block;
    let targetCell: GridCell = args.targetCell;

    let validBlockLiftCellDirection = lastDirection === Direction.Left ? Direction.Right : Direction.Left;

    // prevent lifting if the box is too far away
    let tooFarAway = validBlockLiftCellDirection === Direction.Left 
        ? targetCell.getAdjacentCell(Direction.Right).x < player.x - targetCell.size
        : targetCell.getAdjacentCell(Direction.Left).x > player.x + (targetCell.size * 2);

    // prevent lifting if there's something on top of the box or on top of the player
    let aboveBoxCell = targetCell.getAdjacentCell(Direction.Up);
    let abovePlayerCell = aboveBoxCell.getAdjacentCell(validBlockLiftCellDirection);
    let blocked = !(aboveBoxCell.isFree() && abovePlayerCell.isFree());

    if (!heldBlock && (blocked || tooFarAway)) {
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
    let offsetX = lastDirection === Direction.Left ? -Constants.GridCellSize : Constants.GridCellSize;

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

function animate(player: ActorInstance, direction: Direction, isMoving: boolean = false): void {
    const animationSpeed = 100;
    let startFrame = StackmoFrame.StandRight;
    
    if (!!heldBlock) {
        startFrame = direction === Direction.Right ? StackmoFrame.StandHoldRight : StackmoFrame.StandHoldLeft;
    }
    else {
        startFrame = direction === Direction.Right ? StackmoFrame.StandRight : StackmoFrame.StandLeft;
    }

    if (isMoving) {
        player.animation.start(startFrame + 1, startFrame + 2, animationSpeed);
    }
    else {
        player.animation.setFrame(startFrame);
    }
}

function inputActive(): boolean {
    return (Input.clickActive || Input.keyDown(lastDirection === Direction.Left ? Key.Left : Key.Right));
}

function getClickAdjustedX(room: Room): number {
    // wicked hack to get the room's current view.
    let view = (<any>room).behaviors.find(b => !!b.view).view;
    return Input.activePointerEvent.currentX + (view.x || 0);
}