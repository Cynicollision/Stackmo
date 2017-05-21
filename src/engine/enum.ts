export enum Direction {
    Right = 0,
    Down = 90,
    Left = 180,
    Up = 270,
}

export enum GameState {
    Running = 1,
    Paused = 2,
}

// negative values are used to avoid conflict with actual scale values
export enum ScaleMode {
    None = 1,
    Fill = -2, // aka "vastengine.Config.scaleCenter"
}