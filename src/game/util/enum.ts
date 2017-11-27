export enum Settings {
    CanvasWidth = 'CanvasWidth',
    CanvasHeight = 'CanvasHeight',
    StackmoProgress = 'StackmoProgress',
}

export enum ActorID {
    ExitButton = 'BackButton',
    Block = 'Block',
    LevelIcon = 'LevelIcon',
    Player = 'Player',
    ScrollArrow = 'ScrollArrow',
    Title = 'Title',
    Wall = 'Wall',
    Win = 'Win',
}

export enum RoomID {
    Title = 'Title',
    LevelSelect = 'LevelSelect',
    Level = 'Level',
}

export enum SpriteID {
    Arrows = 'Arrows',
    Digits = 'Digits',
    DoorSheet = 'DoorSheet',
    Box = 'Box',
    LevelIcon = 'LevelIcon',
    StackmoSheet = 'StackmoSheet',
    TextSheet = 'TextSheet',
    Title = 'Title',
    Wall = 'Wall',
    X = 'X',
}

export enum GameAction {
    Drop = 'Drop',
    Fall = 'Fall',
    Jump = 'Jump',
    Lift = 'Lift',
    Move = 'Move',
    CheckStopMoving = 'CheckStopMoving',
    Stop = 'Stop',
    Win = 'Win',
}

// from top row of NES color palette (TODO: rest of them)
export enum LevelBgColor {
    DarkTeal = '#001820',
    Teal = '#006070',
    DarkGreen = '#006810',
    Green = '#a8e8a0',
}