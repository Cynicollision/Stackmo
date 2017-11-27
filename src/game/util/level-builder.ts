import { Actor, ActorInstance, Room, Vastgame } from './../../engine/vastgame';
import { ActorID, LevelBgColor } from './enum';
import * as Constants from './constants';

const FramePerWallSheetRow = 41;
const MaxLevelVariations = 4;

export class LevelBuilder {

    static populateRoom(room: Room, roomID: number): ActorInstance[] {
        let cellSize = Constants.GridCellSize;

        let Block = Actor.get('Block');
        let Player = Actor.get('Player');
        let Wall = Actor.get('Wall');
        let Win = Actor.get('Win');

        let instances: ActorInstance[] = [];
        let levelMap = Levels.get(roomID);

        let colorEnumMap = {
            0: [ LevelBgColor.Teal, LevelBgColor.DarkTeal ],
            1: [ LevelBgColor.Green, LevelBgColor.DarkGreen ],
            2: [ LevelBgColor.Red, LevelBgColor.DarkRed ],
            3: [ LevelBgColor.Purple, LevelBgColor.DarkPurple ],
        };

        let levelVariation = (roomID - 1) % MaxLevelVariations;
        room.setBackground(colorEnumMap[levelVariation][0], levelMap[0].length * cellSize, levelMap.length * cellSize, colorEnumMap[levelVariation][1]);

        for (let i = 0; i < levelMap.length; i++) {
            let row = levelMap[i];

            for (let j = 0; j < row.length; j++) {

                switch (row.charAt(j)) {

                    case 'X':
                        instances.push(room.createActor(ActorID.Block, j * cellSize, i * cellSize));
                        break;

                    case 'P':
                        instances.push(room.createActor(ActorID.Player, j * cellSize, i * cellSize));
                        break;

                    case 'W':
                        instances.push(room.createActor(ActorID.Win, j * cellSize, i * cellSize));
                        break;

                    case '#':
                        let wall = room.createActor(ActorID.Wall, j * cellSize, i * cellSize); 
                        let frame = this.getWallFrame(levelMap, roomID, i, j);
                        frame = this.getWallFrameRowOffeset(levelVariation, frame);
                        wall.spriteAnimation.set(frame);
                        instances.push(wall);
                        break;
                }
            }
        }

        return instances;
    }

    private static getWallFrameRowOffeset(levelVariation: number, wallFrame: WallStyle): number {
        return wallFrame + (FramePerWallSheetRow * levelVariation);
    }

    private static getWallFrame(levelMap: string[], levelNumber: number, row: number, position: number): number {
        const wallChar = '#';
        
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

        if (!topFree && !topLeftFree && !leftFree && !bottomLeftFree && !bottomFree && !rightFree) {
            return WallStyle.ThreewayRight;
        }

        if (!topFree && !topRightFree && !rightFree && !bottomRightFree && !bottomFree && !leftFree) {
            return WallStyle.ThreewayLeft;
        }

        if (!leftFree && !bottomLeftFree && !bottomFree && !bottomRightFree && !rightFree && !topFree) {
            return WallStyle.ThreewayTop;
        }

        if (!leftFree && !topLeftFree && !topFree && !topRightFree && !rightFree && !bottomFree) {
            return WallStyle.ThreewayBottom;
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

        if (!topFree && !leftFree && !bottomFree && !rightFree && !bottomRightFree) {
            return WallStyle.TwoWayTopLeft;
        }

        if (!topFree && !leftFree && !bottomFree && !rightFree && !bottomLeftFree) {
            return WallStyle.TwoWayTopRight;
        }

        if (!topFree && !leftFree && !bottomFree && !rightFree && !topRightFree) {
            return WallStyle.TwoWayBottomLeft; 
        }

        if (!topFree && !leftFree && !bottomFree && !rightFree && !topLeftFree) {
            return WallStyle.TwoWayBottomRight;
        }

        if (!topFree && !leftFree && !bottomFree && !rightFree) {
            return WallStyle.Fourway;
        }

        if (!leftFree && !rightFree && !bottomRightFree && !bottomFree) {
            return WallStyle.FlatTopNarrowLeft;
        }

        if (!leftFree && !rightFree && !bottomLeftFree && !bottomFree) {
            return WallStyle.FlatTopNarrowRight;
        }

        if (!leftFree && !rightFree && !topRightFree && !topFree) {
            return WallStyle.FlatBottomNarrowLeft;
        }

        if (!leftFree && !rightFree && !topLeftFree && !topFree) {
            return WallStyle.FlatBottomNarrowRight;
        }

        if (!topFree && !rightFree && !bottomRightFree && !bottomFree) {
            return WallStyle.FlatLeftNarrowTop;
        }

        if (!topFree && !leftFree && !bottomLeftFree && !bottomFree) {
            return WallStyle.FlatRightNarrowTop; 
        }

        if (!bottomFree && !rightFree && !topRightFree && !topFree) {
            return WallStyle.FlatLeftNarrowBottom;
        }

        if (!bottomFree && !leftFree && !topLeftFree && !topFree) {
            return WallStyle.FlatRightNarrowBottom;
        }

        if (!rightFree && !bottomRightFree && !bottomFree) {
            return WallStyle.OuterCornerTopLeft;
        }

        if (!leftFree && !bottomLeftFree && !bottomFree) {
            return WallStyle.OuterCornerTopRight;
        }

        if (!rightFree && !topRightFree && !topFree) {
            return WallStyle.OuterCornerBottomLeft;
        }

        if (!leftFree && !topLeftFree && !topFree) {
            return WallStyle.OuterCornerBottomRight;
        }

        if (!topFree && !bottomFree && !leftFree) {
            return WallStyle.ThreewayNarrowLeft;
        }

        if (!topFree && !bottomFree && !rightFree) {
            return WallStyle.ThreewayNarrowRight;
        }

        if (!topFree && !leftFree && !rightFree) {
            return WallStyle.ThreewayNarrowTop;
        }

        if (!leftFree && !rightFree && !bottomFree) {
            return WallStyle.ThreewayNarrowBottom;
        }

        if (!leftFree && !rightFree) {
            return WallStyle.NarrowHorizontal;
        }

        if (!topFree && !bottomFree) { 
            return WallStyle.NarrowVertical;
        }

        if (!topFree) {
            return WallStyle.CappedBottom;
        }

        if (!leftFree) {
            return WallStyle.CappedRight;
        }

        if (!bottomFree) {
            return WallStyle.CappedTop;
        }

        if (!rightFree) {
            return WallStyle.CappedLeft;
        }

        return WallStyle.Solo;
    }
}

export class Levels {

    static get count(): number {
        let c = 0;
        for (let p in this.levels) {
            c++;
        }
        return c;
    }

    static levels: { [id: number]: string[] } = {
        1: [
            '################',
            '#              #',
            '#              #',
            '#              #',
            '#X        #    #',
            '### P  #  #  W #',
            '################',
        ],
        2: [
            '#################',
            '#               #',
            '#               #',
            '#          #    #',
            '#XX        #    #',
            '#### P   # #  W #',
            '#################',
        ],
        3: [
            '################',
            '#              #',
            '#              #',
            '#         #    #',
            '#XX       #    #',
            '###X  P   #  W #',
            '################',
        ],
        4: [
            '################',
            '#              #',
            '#              #',
            '#X        #  W #',
            '#XX       #  ###',
            '###X  P   #  ###',
            '################',
        ],
        5: [
            '################',
            '#       #      #',
            '#       #    W #',
            '#            ###',
            '#X      #      #',
            '#XX P   #X   XX#',
            '################',
        ],
        6: [
            '##################',
            '#                #',
            '#              W #',
            '#              ###',
            '#        X     ###',
            '#X       #    X###',
            '#XX P #      XX###',
            '##################',
        ],
        7: [
            '##################',
            '#               W#',
            '#               ##',
            '#       ######  ##',
            '#XX          #####',
            '#######          #',
            '#          #    X#',
            '#XX P      #   XX#',
            '##################',
        ],
        8: [
            '##############',
            '#W           #',
            '##           #',
            '##P          #',
            '### X      XX#',
            '#####    #####',
            '#####        #',
            '#####      XX#',
            '##############',
        ],
        // 7: [
        //     '#############################',
        //     '#                           #',
        //     '#  # #               # #    #',
        //     '#  ###    #####     #####   #',
        //     '#  ###     ###       ###    #',
        //     '#  # #    #####     #####   #',
        //     '#                    # #    #',
        //     '#   P                       #',
        //     '#############################',
        // ],
        // 100: [
        //     '########################',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#   P      X       W   #',
        //     '########################',
        // ],
    };

    static get(levelNumber: number): string[] {
        return this.levels[levelNumber];
    }
}

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
    NarrowHorizontal = 13,
    NarrowVertical = 14,
    CappedLeft = 15,
    CappedTop = 16,
    CappedRight = 17,
    CappedBottom = 18,
    ThreewayNarrowTop = 19,
    ThreewayNarrowRight = 20,
    ThreewayNarrowBottom = 21,
    ThreewayNarrowLeft = 22,
    Fourway = 23,
    Solo = 24,
    ThreewayTop = 25,
    ThreewayRight = 26,
    ThreewayBottom = 27,
    ThreewayLeft = 28,
    FlatTopNarrowLeft = 29,
    FlatTopNarrowRight = 30,
    FlatBottomNarrowLeft = 31,
    FlatBottomNarrowRight = 32,
    FlatLeftNarrowTop = 33,
    FlatRightNarrowTop = 34,
    FlatLeftNarrowBottom = 35,
    FlatRightNarrowBottom = 36,
    TwoWayTopLeft = 37,
    TwoWayTopRight = 38,
    TwoWayBottomLeft = 39,
    TwoWayBottomRight = 40,
}