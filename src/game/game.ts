import { 
    Actor, 
    ActorInstance, 
    Direction, 
    GameOptions,
    GridCell,
    Room, 
    Vastgame,
} from './../engine/vastgame';

import { Levels } from './levels';

// initialization
let fillScreen = window.innerWidth < 800;
let canvasWidth = fillScreen ? window.innerWidth : 800;
let canvasHeight = fillScreen ? window.innerHeight : 600;

let options: GameOptions = {
    targetFPS: 60,
    canvas: { 
        width: canvasWidth, 
        height: canvasHeight,
    },
};

let demoGame = Vastgame.init('game', options);

require('./actors/block');
require('./actors/player');
require('./actors/wall');

// create a demo room with some actor instances
let demoRoom = Room.define();

demoRoom.onStart(() => {
    let Block = Actor.get('Block');
    let Wall = Actor.get('Wall');

    let instances = populateRoom(demoRoom);
    let player = instances.find(actorInstance => actorInstance.parent === Actor.get('Player'));

    demoRoom.defineGrid(64).onClick(gridClickEvent => {
        let clickedCell = gridClickEvent.getCell();

        // do nothing if the player is moving or if a wall was clicked on
        if (player.speed || clickedCell.getContents().some(instance => instance.parent === Wall)) {
            return;
        }

        let leftCell = clickedCell.getAdjacentCell(Direction.Left);
        let rightCell = clickedCell.getAdjacentCell(Direction.Right);
        let downCell = clickedCell.getAdjacentCell(Direction.Down);

        let downLeftCell = leftCell.getAdjacentCell(Direction.Down);
        let downRightCell = rightCell.getAdjacentCell(Direction.Down);
        
        if (clickedCell.containsInstanceOf(Block)) {
            player.raiseEvent('lift', { block: clickedCell.getContents()[0], targetCell: clickedCell });
        }
        else if (rightCell.containsInstance(player)) {
            player.raiseEvent('move', { direction: Direction.Left, targetCell: clickedCell });
        }
        else if (leftCell.containsInstance(player)) {
            player.raiseEvent('move', { direction: Direction.Right, targetCell: clickedCell });
        }
        else if (downLeftCell.containsInstance(player) && (downCell.containsInstanceOf(Block) || downCell.containsInstanceOf(Wall))) {
            player.raiseEvent('jump', { direction: Direction.Right, targetCell: clickedCell });
        }
        else if (downRightCell.containsInstance(player) && (downCell.containsInstanceOf(Block) || downCell.containsInstanceOf(Wall))) {
            player.raiseEvent('jump', { direction: Direction.Left, targetCell: clickedCell });
        }
    });

    demoRoom.defineView(0, 0, canvasWidth, canvasHeight)
        .follow(player, true);
});


// start the game
demoGame.start(demoRoom);

// TODO: LevelBuilder class
function populateRoom(room: Room): ActorInstance[] {
    let Block = Actor.get('Block');
    let Player = Actor.get('Player');
    let Wall = Actor.get('Wall');

    let instances: ActorInstance[] = [];

    let levelMap = Levels.get(1);

    for (let i = 0; i < levelMap.length; i++) {
        let row = levelMap[i];

        for (let j = 0; j < row.length; j++) {

            switch (row.charAt(j)) {

                case 'X':
                    instances.push(demoRoom.createActor(Block, j * 64, i * 64));
                    break;

                case 'P':
                    instances.push(demoRoom.createActor(Player, j * 64, i * 64));
                    break;

                case '#':
                    let wall = demoRoom.createActor(Wall, j * 64, i * 64); 
                    let frame = getWallFrame(levelMap, i, j);
                    wall.spriteAnimation.set(frame);
                    instances.push(wall);
                    break;
            }
        }
    }

    return instances;
}

function getWallFrame(levelMap: string[], row: number, position: number): number {

    // enum values correspond to sprite sheet frames
    enum WallStyle {
        InnerCornerTopLeft = 0,
        FlatTop = 1,
        InnerCornerTopRight = 2,
        OuterCornerTopLeft = 3,
        OuterCornerBottomLeft = 4,
        FlatLeft = 5,
        Inner = 6,
        FlatRight = 7,
        OuterCornerTopRight = 8,
        InnerCornerBottomLeft = 9,
        FlatBottom = 10,
        InnerCornerBottomRight = 11,
        OuterCornerBottomRight = 12,
        // TODO: need 6 more: CappedTop/Left/Right/Bottom, NarrowHorizontal/Vertical
    }

    let wallChar = '#';
    let maxX = levelMap[0].length - 1;
    let maxY = levelMap.length - 1;

    let topFree = (row > 0) ? levelMap[row - 1][position] !== wallChar : false;
    let topLeftFree = (row > 0 && position > 0) ? levelMap[row - 1][position - 1] !== wallChar : false;
    let topRightFree = (row > 0 && position < maxX) ? levelMap[row - 1][position + 1] !== wallChar : false;
    let bottomFree = (row < maxY) ? levelMap[row + 1][position] !== wallChar : false;
    let bottomLeftFree = (row < maxY && position > 0) ? levelMap[row + 1][position - 1] !== wallChar : false;
    let bottomRightFree = (row < maxY && position < maxX) ? levelMap[row + 1][position + 1] !== wallChar : false;
    let leftFree = (position > 0) ? levelMap[row][position - 1] !== wallChar : false;
    let rightFree = (position < maxX) ? levelMap[row][position + 1] !== wallChar : false;

    if (!topFree && !topLeftFree && !topRightFree && !leftFree && !rightFree && !bottomLeftFree && !bottomFree && !bottomRightFree) {
        return WallStyle.Inner;
    }
    
    if (!topFree && !topLeftFree && !topRightFree && !leftFree && !rightFree && !bottomLeftFree && !bottomFree) {
        return WallStyle.InnerCornerTopLeft
    }

    if (!topFree && !topLeftFree && !topRightFree && !leftFree && !rightFree && !bottomFree && !bottomRightFree) {
        return WallStyle.InnerCornerTopRight;
    }

    if (!topFree && !topLeftFree && !leftFree && !rightFree && !bottomLeftFree && !bottomFree && !bottomRightFree) {
        return WallStyle.InnerCornerBottomLeft;
    }

    if (!topFree&& !topRightFree && !leftFree && !rightFree && !bottomLeftFree && !bottomFree && !bottomRightFree) {
        return WallStyle.InnerCornerBottomRight;
    }

    if (!topFree && !topLeftFree && !leftFree && !bottomLeftFree && !bottomFree) {
        return WallStyle.FlatLeft;
    }

    if (!topFree && !topRightFree && !rightFree && !bottomRightFree && !bottomFree) {
        return WallStyle.FlatRight;
    }

    if (!leftFree && !bottomLeftFree && !bottomFree && !bottomRightFree && !rightFree) {
        return WallStyle.FlatBottom;
    }

    if (!leftFree && !topLeftFree && !topFree && !topRightFree && !rightFree) {
        return WallStyle.FlatTop;
    }

    if (!leftFree && !bottomLeftFree && !bottomFree) {
        return WallStyle.OuterCornerTopRight;
    }

    if (!leftFree && !topLeftFree && !topFree) {
        return WallStyle.OuterCornerBottomRight;
    }

    if (!rightFree && !bottomRightFree && !rightFree) {
        return WallStyle.OuterCornerTopLeft;
    }
    
    if (!rightFree && !topRightFree && !topFree) {
        return WallStyle.OuterCornerBottomLeft;
    }

    return WallStyle.Inner
}
