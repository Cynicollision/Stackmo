import { GameCanvasContext } from './canvas';
import { PointerInputEvent } from './input';
import { Grid } from './grid';
import { Room } from './room';
import { View } from './view';

export interface RoomBehavior {
    preHandleClick: (event: PointerInputEvent) => void;
    postHandleClick: (event: PointerInputEvent) => void;
    postStep: (self: Room) => void;
    preDraw: (self: Room, canvasContext: GameCanvasContext) => void;
}

export class ViewedRoomBehavior implements RoomBehavior {
    view: View;

    constructor(x: number, y: number, width: number, height: number) {
        this.view = new View(x, y, width, height);
    }

    getView(): View {
        return this.view;
    }

    // RoomBehavior implementation
    preHandleClick(event: PointerInputEvent) {
        let [offsetX, offsetY] = this.getOffset();
        event.x += offsetX;
        event.y += offsetY;
    }

    postStep(self: Room) { 
        this.view.update();
    }

    preDraw(self: Room, canvasContext: GameCanvasContext) { 
        let [offsetX, offsetY] = this.getOffset();
        canvasContext.origin = [-offsetX, -offsetY];
    }

    postHandleClick(event: PointerInputEvent) {
    }

    private getOffset(): [number, number] {
        let offsetX = this.view ? this.view.x : 0;
        let offsetY = this.view ? this.view.y : 0;

        return [offsetX, offsetY];
    }
}

export class GridRoomBehavior {
    private grid: Grid;

    constructor(tileSize: number, parentRoom: Room) {
        this.grid = new Grid(tileSize, parentRoom);
    }

    getGrid(): Grid {
        return this.grid;
    }

    // RoomBehavior implementation
    postHandleClick(event: PointerInputEvent) {
        this.grid.raiseClickEvent(event.x, event.y);
    }

    preHandleClick(event: PointerInputEvent) {
    }
    postStep(self: Room) { 
    }
    preDraw(self: Room, canvasContext: GameCanvasContext) { 
    }
}