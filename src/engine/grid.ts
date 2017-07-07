import { ActorInstance } from './actor';
import { Direction } from './enum';
import { Room } from './room';

export interface GridClickCallback {
    (gridClickEvent: GridClickEvent): void;
}

export class GridClickEvent {

    constructor(
        private grid: Grid,
        private x: number, 
        private y: number) {
    }

    getCell(): GridCell {
        let cellX = this.x - this.x % this.grid.tileSize;
        let cellY = this.y - this.y % this.grid.tileSize;
        
        return new GridCell(this.grid, cellX, cellY);
    }
}

export class GridCell {

    constructor(private grid: Grid, public x: number, public y: number) {
    }

    getContents(): ActorInstance[] {
        return this.grid.room.getInstancesAtPosition(this.x + 1, this.y + 1);
    }

    getAdjacentCell(direction: Direction): GridCell {
        let offsetX = 0;
        let offsetY = 0;

        switch (direction) {
            case Direction.Down:
                offsetY = this.grid.tileSize;
                break;
            case Direction.Left:
                offsetX = -this.grid.tileSize;
                break;
            case Direction.Right:
                offsetX = this.grid.tileSize;
                break;
            case Direction.Up:
                offsetY = -this.grid.tileSize;
                break;
        }

        return new GridCell(this.grid, this.x + offsetX, this.y + offsetY);
    }
}

export class Grid {
    private _onClick: GridClickCallback;

    constructor(
        readonly tileSize: number,
        readonly room: Room) {
    }

    onClick(callback: GridClickCallback): void {
        this._onClick = callback;
    }

    raiseClickEvent(x: number, y: number): void {
        let instances = this.room.getInstancesAtPosition(x, y);
        let event = new GridClickEvent(this, x, y);

        this._onClick(event);
    }
}