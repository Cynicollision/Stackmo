import { Actor, ActorInstance, Room } from './../../engine/vastgame';
import * as Constants from './../util/constants';

export class LevelBuilder {

    static populateRoom(room: Room, roomID: number): ActorInstance[] {
        let cellSize = Constants.GridCellSize;

        let Block = Actor.get('Block');
        let Player = Actor.get('Player');
        let Wall = Actor.get('Wall');

        let instances: ActorInstance[] = [];
        let levelMap = Levels.get(roomID);

        room.setBackground(Constants.LevelBackgroundColor, levelMap[0].length * cellSize, levelMap.length * cellSize);

        for (let i = 0; i < levelMap.length; i++) {
            let row = levelMap[i];

            for (let j = 0; j < row.length; j++) {

                switch (row.charAt(j)) {

                    case 'X':
                        instances.push(room.createActor(Block, j * cellSize, i * cellSize));
                        break;

                    case 'P':
                        instances.push(room.createActor(Player, j * cellSize, i * cellSize));
                        break;

                    case '#':
                        let wall = room.createActor(Wall, j * cellSize, i * cellSize); 
                        let frame = this.getWallFrame(levelMap, i, j);
                        wall.spriteAnimation.set(frame);
                        instances.push(wall);
                        break;
                }
            }
        }

        return instances;
    }

    private static getWallFrame(levelMap: string[], row: number, position: number): number {

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
            // TODO: need 10 more: CappedTop/Left/Right/Bottom, NarrowHorizontal/Vertical, TUp, TLeft, TRight, TBottom
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

}

class Levels {

    static get(levelNumber: number) {
        
        switch (levelNumber) {
            case 1: 
                return [
                    '##################',
                    '#                #',
                    '#       ##       #',
                    '#       ##       #',
                    '#XX              #',
                    '#####           X#',
                    '####### P      ###',
                    '##########    ####',
                    '##########  ######',
                    '##################',
                ];
        }
    }
}