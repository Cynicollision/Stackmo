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
    ArrowSheet = 'Arrows',
    Digits = 'Digits',
    DoorSheet = 'DoorSheet',
    Box = 'Box',
    HUD = 'HUD',
    LevelIcon = 'LevelIcon',
    StackmoSheet = 'StackmoSheet',
    TextSheet = 'TextSheet',
    Title = 'Title',
    Wall = 'Wall',
    ExitButton = 'X',
}

export enum GameAction {
    Drop = 'Drop',
    Fall = 'Fall',
    StopFalling = 'StopFalling',
    Jump = 'Jump',
    Lift = 'Lift',
    Move = 'Move',
    CheckStopMoving = 'CheckStopMoving',
    Stop = 'Stop',
    Turn = 'Turn',
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

export enum StackmoFrame {
    StandLeft = 0,
    MoveLeft1 = 1,
    MoveLeft2 = 2,
    StandRight = 3,
    MoveRight1 = 4,
    MoveRight2 = 5,
    StandHoldLeft = 6,
    MoveHoldLeft1 = 7,
    MoveHoldLeft2 = 8,
    StandHoldRight = 9,
    MoveHoldRight1 = 10,
    MoveHolddRight2 = 11,
}
