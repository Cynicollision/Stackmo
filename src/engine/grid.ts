import { Actor } from './actor';
import { ActorInstance } from './actor-instance';
import { Direction } from './enum';
import { Room } from './room';
import { Array } from 'es6-shim';

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

    constructor(private grid: Grid, readonly x: number, readonly y: number) {
    }

    get size(): number {
        return this.grid.tileSize;
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

    getContents(): ActorInstance[] {
        return this.grid.room.getInstancesAtPosition(this.x + this.grid.tileSize / 2, this.y + this.grid.tileSize / 2);
    }

    containsInstance(instance: ActorInstance): boolean {
        return this.getContents().some(contents => contents === instance);
    }

    containsInstanceOf(actor: Actor | Actor[]): boolean {

        if ((<any>actor).length) {
            return this.getContents().some(contents => (<Actor[]>actor).indexOf(contents.parent) > -1);
        }

        return this.getContents().some(contents => contents.parent === actor);
    }

    isFree(actorTypes?: Actor[]): boolean {

        if (!actorTypes || !actorTypes.length) {
            return !this.getContents().length;
        }

        return !this.getContents()
            .filter(actorInstance => actorTypes.indexOf(actorInstance.parent) !== -1)
            .length;
    }
}

export class Grid {
    private _onClick: GridClickCallback;

    constructor(
        readonly tileSize: number,
        readonly room: Room) {
    }

    getCellAtPosition(x: number, y: number): GridCell {
        return new GridCell(this, x, y);
    }

    find(actorType: Actor): GridCell {
        let actorInstances = this.room.getInstances();

        if (actorInstances && actorInstances.length) {
            // assumes the match is aligned to the grid.
            let match = actorInstances.find(a => a.parent === actorType);
            return new GridCell(this, match.x, match.y);
        }

        return null;
    }

    // click event handling
    onClick(callback: GridClickCallback): void {
        this._onClick = callback;
    }

    raiseClickEvent(x: number, y: number): void {
        let event = new GridClickEvent(this, x, y);

        this._onClick(event);
    }    
}