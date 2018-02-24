

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
        9: [
            '###################',
            '#                 #',
            '#     X         W #',
            '#    # #    X #####',
            '# P ## ##  #  #####',
            '###### ############',
            '###################',
        ],
        10: [
            '#####################',
            '###############    ##',
            '##############   # ##',
            '###              # ##',
            '##      X   P   ## ##',
            '#     ############ ##',
            '#        ######### ##',
            '#X    XXX######### ##',
            '################## ##',
            '##############     ##',
            '#########    # ######',
            '######### #      ####',
            '######### #         #',
            '######### ######    #',
            '######### ##       ##',
            '######### ##XXX  ####',
            '######### ###########',
            '#########         W##',
            '#####################',
        ],
        // BlockDude levels
        // 5: [
        //     '########################',
        //     '#####                  #',
        //     '###                    #',
        //     '##                   W #',
        //     '#                   ####',
        //     '#    X  #           ####',
        //     '#  PXX X#           ####',
        //     '#############   ########',
        //     '#############  X########',
        //     '########################',
        // ],
        // 10: [
        //     '###################',
        //     '# ###             #',
        //     '#  #              #',
        //     '#               X#',
        //     '#               XX#',
        //     '# ###    P   #X ###',
        //     '# ###    #  #######',
        //     '# ###XX ##  #######',
        //     '#W######## ########',
        //     '###################',
        // ],
        // 13: [
        //     '########################',
        //     '#                      #',
        //     '#X                     #',
        //     '#XX                    #',
        //     '####   P               #',
        //     '####   #          #    #',
        //     '########        X #  W #',
        //     '##########  X   X # ####',
        //     '########## X# # X # ####',
        //     '################### ####',
        //     '########################',
        // ],
        // 14: [
        //     '########################',
        //     '#                      #',
        //     '#                      #',
        //     '#                      #',
        //     '#              #       #',
        //     '#              #       #',
        //     '#          XXXX#       #',
        //     '#        P#######    W #',
        //     '#X     # ########## ####',
        //     '#XX   ## ########## ####',
        //     '#XXX  ## ########## ####',
        //     '######## ###############',
        //     '########################',
        // ],
        // 15: [
        //     '##########################',
        //     '###  ###     ###  ###   ##',
        //     '##    ##      ##   ##    #',
        //     '#      #       #    #    #',
        //     '#                       X#',
        //     '#                       X#',
        //     '#                      XX#',
        //     '# W    X               ###',
        //     '####   # X     #    ## ###',
        //     '####   # X    ## X P######',
        //     '#####  # XXX  ## XXX######',
        //     '#####  ###### ############',
        //     '###### ###################',
        //     '##########################',
        // ],
        // 17: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 18: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 19: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // //
        // 20: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 21: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 22: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 23: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 24: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 25: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 26: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 27: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 28: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 29: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 30: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 31: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 32: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 33: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 34: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
        // 35: [
        //     '##################',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '#                #',
        //     '# P              #',
        //     '##################',
        // ],
    };

    static get(levelNumber: number): string[] {
        return this.levels[levelNumber];
    }
}