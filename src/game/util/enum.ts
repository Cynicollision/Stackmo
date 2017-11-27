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
    DarkGreen = '#001800',
    Green = '#085800',
    DarkRed = '#580000',
    Red = '#d01000',
    DarkPurple = '#380050',
    Purple = '#a008a8',
}