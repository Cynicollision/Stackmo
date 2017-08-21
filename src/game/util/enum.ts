export enum Settings {
    CanvasWidth = 'CanvasWidth',
    CanvasHeight = 'CanvasHeight',
    UnlockedLevels = 'UnlockedLevels',
}

export enum ActorID {
    Block = 'Block',
    LevelIcon = 'LevelIcon',
    Player = 'Player',
    ScrollArrow = 'ScrollArrow',
    Title = 'Title',
    Wall = 'Wall',
}

export enum RoomID {
    Title = 'Title',
    LevelSelect = 'LevelSelect',
    Level = 'Level',
}

export enum GameAction {
    Drop = 'Drop',
    Fall = 'Fall',
    Jump = 'Jump',
    Lift = 'Lift',
    Move = 'Move',
    Stop = 'Stop',
}

// from top row of NES color palette (TODO: rest of them)
export enum LevelBgColor {
    DarkTeal = '#001820',
    Teal = '#006070',
}