export class Levels {

    static get(levelNumber: number) {
        
        switch (levelNumber) {
            case 1: 
                return [
                    '##################',
                    '#                #',
                    '#                #',
                    '#                #',
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