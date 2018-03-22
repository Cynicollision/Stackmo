import { Actor, ActorInstance, Boundary, Direction, Key, Input, GridCell, Room, Sprite } from './../../engine/vastgame';
import * as Constants from './../util/constants';
import { ActorID, GameAction, SpriteID, StackmoFrame } from './../util/enum';

let heldBlock: ActorInstance;
let lastDirection: Direction;

let solidActors: Actor[];
let Win: Actor;

Actor
    .define(ActorID.Player, {
        sprite: Sprite.get(SpriteID.StackmoSheet),
    })
    .onCreate(self => {
        self.animation.depth = -50;
        lastDirection = Direction.Right;
        heldBlock = null;

        solidActors = [
            Actor.get(ActorID.Block),
            Actor.get(ActorID.Wall),
        ];

        Win = Actor.get(ActorID.Win);
    })
    .onStep(self => {

        if (heldBlock) {
            heldBlock.setPosition(self.x, self.y - Constants.GridCellSize);
        }
    })
    // Moving
    .onEvent(GameAction.Move, (player, args) => {
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
    })
    // Stop moving or continue
    .onEvent(GameAction.CheckStopMoving, (player, args) => {
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
                if (Input.clickActive) {
                    let clickAdjustedX = getClickAdjustedX(args.game.currentRoom);
                    args.direction = clickAdjustedX <= player.x + (targetCell.size / 2) ? Direction.Left : Direction.Right;
                }
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
    })
    // Falling
    .onEvent(GameAction.Fall, (player, args) => {
        let startY = player.y;
        let direction: Direction = args.direction;
        let stopCondition = (): boolean =>  Math.abs(startY - player.y) >= Constants.GridCellSize;

        // move the target cell to the one below the previous target cell
        args.targetCell = args.targetCell.getAdjacentCell(Direction.Down);

        player.move(Constants.PlayerFallSpeed, Direction.Down);
        player.raiseEventWhen(GameAction.StopFalling, stopCondition, args);

        animate(player, direction, false);
    })
    // Stop falling or continue moving
    .onEvent(GameAction.StopFalling, (player, args) => {
        let targetCell: GridCell = args.targetCell;

        // snap to the grid
        player.move(0);
        player.setPosition(args.targetCell.x, args.targetCell.y);

        if (inputActive() && !targetCell.getAdjacentCell(Direction.Down).isFree(solidActors)) {
            args.targetCell = targetCell.getAdjacentCell(args.direction);

            if (args.targetCell.isFree(solidActors)) {
                player.raiseEvent(GameAction.Move, args);
            }
            else  {
                let jumpCell = args.targetCell.getAdjacentCell(Direction.Up);

                if (jumpCell.isFree(solidActors)) {
                    player.raiseEvent(GameAction.Jump, { targetCell: jumpCell, direction: args.direction });
                }
            }
        }
        else {
            player.raiseEvent(GameAction.Stop, args);
        }
    })
    // Stopping
    .onEvent(GameAction.Stop, (player, args) => {
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
    })
    // Jumping
    .onEvent(GameAction.Jump, (player, args) => {
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
    })
    // Lifting
    .onEvent(GameAction.Lift, (player, args) => {
        let block: ActorInstance = args.block;
        let targetCell: GridCell = args.targetCell;

        // let validBlockLiftCellDirection = lastDirection === Direction.Left ? Direction.Right : Direction.Left;
        let liftDirection = targetCell.x < player.x ? Direction.Left : Direction.Right;

        // prevent lifting if the box is too far away
        let tooFarAway = targetCell.y !== player.y || Math.abs(targetCell.x - player.x) > 70;

        // prevent lifting if there's something on top of the box or on top of the player
        let aboveBoxCell = targetCell.getAdjacentCell(Direction.Up);
        let abovePlayerCell = aboveBoxCell.getAdjacentCell(liftDirection === Direction.Left ? Direction.Right : Direction.Left);
        let blocked = !(aboveBoxCell.isFree() && abovePlayerCell.isFree());

        if (heldBlock && block === heldBlock) {
            player.raiseEvent(GameAction.Drop, args);
        }
        else if (!heldBlock && !blocked && !tooFarAway) {
            heldBlock = block;
            animate(player, lastDirection, false);
            player.raiseEvent(GameAction.Turn, { direction: liftDirection });
        }
    })
    // Drop
    .onEvent(GameAction.Drop, (player, args) => {
        let block: ActorInstance = args.block;
        let targetCell: GridCell = args.targetCell;
        let offsetX = lastDirection === Direction.Left ? -Constants.GridCellSize : Constants.GridCellSize;

        // prevent dropping if there's something in the way of the box
        if (targetCell.getAdjacentCell(lastDirection).isFree()) {
            args.targetCell = args.targetCell.getAdjacentCell(lastDirection);
            
            heldBlock = null;
        
            block.setPositionRelative(offsetX, 0);
            block.raiseEvent(GameAction.Fall, args);
        
            animate(player, lastDirection, false);
        }
    })
    .onEvent(GameAction.Turn, (player, args) => {
        let direction: Direction = args.direction;
        lastDirection = direction;
        animate(player, lastDirection, false);
    });

// Helpers
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
    let inputOffsetX = Input.clickActive ? Input.activePointerEvent.currentX || 0 : 0;
    // wicked hack to get the room's current view.
    let view = (<any>room).behaviors.find(b => !!b.view).view;
    return inputOffsetX + (view.x || 0);
}