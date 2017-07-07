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

const PlayerMovementSpeed = 4;

enum PlayerEvent {
    Fall = 'fall',
    Move = 'move',
    Stop = 'stop',
}

let TankStrip = Sprite.define({
    imageSource: 'img/tank_strip.png',
    height: 64,
    width: 64,
});

let Player = Actor.define('Player', {
    boundary: Boundary.fromSprite(TankStrip),
    sprite: TankStrip,
});

Player.onEvent(PlayerEvent.Move, (player, args) => {
    let startX = player.x;
    let stopCondition = (): boolean => Math.abs(startX - player.x) >= 64;

    player.move(PlayerMovementSpeed, args.direction);
    player.raiseEventWhen(PlayerEvent.Stop, stopCondition, args);
});

Player.onEvent(PlayerEvent.Fall, (player, args) => {
    let startY = player.y;
    let stopCondition = (): boolean =>  Math.abs(startY - player.y) >= 64;

    // move the target cell to the one below the previous target cell
    args.targetCell = args.targetCell.getAdjacentCell(Direction.Down);

    player.move(4, Direction.Down);
    player.raiseEventWhen(PlayerEvent.Stop, stopCondition, args);
})

Player.onEvent(PlayerEvent.Stop, (player, args) => {
    let room: Room = args.game.currentRoom;
    let targetCell: GridCell = args.targetCell;

    player.speed = 0;
    player.setPosition(targetCell.x, targetCell.y);

    if (room.isPositionFree(player.x + 1, player.y + 65)) {
        player.raiseEvent(PlayerEvent.Fall, args);
    }
});
