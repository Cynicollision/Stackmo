import { Actor, ActorInstance, Room, Vastgame } from './../../engine/vastgame';
import { LevelBgColor } from './enum';
import * as Constants from './constants';

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
            0: [ LevelBgColor.Teal, LevelBgColor.DarkTeal ]
        };

        // TODO: randomize/cycle colors (take as parameter?)
        room.setBackground(colorEnumMap[0][0], levelMap[0].length * cellSize, levelMap.length * cellSize, colorEnumMap[0][1]);

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

                    case 'W':
                        instances.push(room.createActor(Win, j * cellSize, i * cellSize));
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

        if (!topFree) {
            if (!leftFree) {
                if (!rightFree) {
                    if (!bottomFree) {
                        if (!topLeftFree) {
                            if (!topRightFree) {
                                if (!bottomLeftFree) {
                                    return !bottomRightFree ? WallStyle.Inner : WallStyle.InnerCornerTopLeft;
                                }
                                return !bottomRightFree ? WallStyle.InnerCornerTopRight : WallStyle.ThreewayBottom;
                            }
                            if (!bottomLeftFree) {
                                return !bottomRightFree ? WallStyle.InnerCornerBottomLeft : WallStyle.ThreewayRight;
                            }
                        }
                        if (!topRightFree && !bottomRightFree) {
                            return !bottomLeftFree ? WallStyle.InnerCornerBottomRight : WallStyle.ThreewayLeft;
                        }
                        return !bottomLeftFree && !bottomRightFree ? WallStyle.ThreewayTop : WallStyle.Fourway;
                    }
                    return !topLeftFree && !topRightFree ? WallStyle.FlatTop : WallStyle.ThreewayNarrowTop;
                }
                if (!bottomFree) {
                    return !topLeftFree && !bottomLeftFree ? WallStyle.FlatLeft : WallStyle.ThreewayNarrowLeft;
                }
                if (!topLeftFree) {
                    return WallStyle.OuterCornerBottomRight;
                }
            }
            if (!rightFree) {
                if (!bottomFree) {
                    return !topRightFree && !bottomRightFree ? WallStyle.FlatRight : WallStyle.ThreewayNarrowRight;
                }
                if (!topRightFree) {
                    return WallStyle.OuterCornerBottomLeft;
                }
            }
            return !bottomFree ? WallStyle.NarrowVertical : WallStyle.CappedBottom;
        }
        if (!leftFree) {
            if (!rightFree) {
                if (!bottomFree) {
                    return !bottomLeftFree && !bottomRightFree ? WallStyle.FlatBottom : WallStyle.ThreewayNarrowBottom;
                }
                return WallStyle.NarrowHorizontal;
            }
            return !bottomLeftFree && !bottomFree ? WallStyle.OuterCornerTopRight : WallStyle.CappedRight;
        }
        if (!rightFree) {
            return !bottomRightFree && !bottomFree ? WallStyle.OuterCornerTopLeft : WallStyle.CappedLeft;
        }
        return !bottomFree ? WallStyle.CappedTop : WallStyle.Solo;
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
        ],
        2: [
            '##################',
            '#    #      #    #',
            '#   ##   #  ##   #',
            '#P   #      #    #',
            '##       #       #',
            '#W      ###  #####',
            '####     #       #',
            '#                #',
            '# XX X  #    XXXX#',
            '##################',
        ],
        3: [
            '##################',
            '#                #',
            '#                #',
            '#                #',
            '#                #',
            '#                #',
            '#         #      #',
            '# XXX      #     #',
            '# XXXX  P # #  XX#',
            '##################',
        ],
        4: [
            '##################',
            '#                #',
            '#   #            #',
            '#         #      #',
            '#    #           #',
            '#  #         XX  #',
            '#           XXXXX#',
            '#          XXXXXX#',
            '#  P    XXXXXXXXX#',
            '##################',
        ], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: [], 16: [], 17: [], 18: [], 
        19: [], 20: [], 21: [], 22: [], 23: [], 24: [], 25: [], 26: [], 27: [], 28: [], 29: [], 30: [], 31: [],32: [],  
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
}