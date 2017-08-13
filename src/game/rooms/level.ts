import { 
    Actor,
    ActorInstance, 
    Direction,
    Room, 
} from './../../engine/vastgame';

import { LevelBuilder } from './../level-builder';

// (TODO: need to store game globals)
let fillScreen = window.innerWidth < 800;
let canvasWidth = fillScreen ? window.innerWidth : 800;
let canvasHeight = fillScreen ? window.innerHeight : 600;

let levelRoom = Room.define('Level');

levelRoom.onStart(() => {
    let Block = Actor.get('Block');
    let Wall = Actor.get('Wall');

    let instances = LevelBuilder.populateRoom(levelRoom, 1);
    let player = instances.find(actorInstance => actorInstance.parent === Actor.get('Player'));

    // define a view that follows the player
    levelRoom.defineView(0, 0, canvasWidth, canvasHeight)
        .follow(player, true);

    // define the movement grid and player behavior
    levelRoom.defineGrid(64).onClick(gridClickEvent => {
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
});
