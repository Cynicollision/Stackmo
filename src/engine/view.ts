import { ActorInstance } from './actor-instance';
import { Boundary } from './boundary';
import { CanvasHTML2D } from './canvas';

enum ViewMode {
    SamePosition = 1,
    Center = 2,
}

export class View {

    static fromCanvas(canvas: CanvasHTML2D) {
        return new View(0, 0, canvas.height, canvas.width);
    }

    private followInstance: ActorInstance;
    private viewMode: ViewMode = ViewMode.SamePosition;
    private canvasHeight: number;
    private canvasWidth: number;
    
    constructor(
        public x: number, 
        public y: number, 
        public readonly width: number, 
        public readonly height: number) {
    }

    follow(actorInstance: ActorInstance, center: boolean = false): void {
        this.viewMode = center ? ViewMode.Center : ViewMode.SamePosition;
        this.followInstance = actorInstance;
    }

    updatePosition(): void {

        if (!this.followInstance) {
            return;
        }

        if (this.viewMode === ViewMode.Center) {
            this.centerAroundBoundary(this.followInstance.boundary);
        }
        else {
            this.x = this.followInstance.x || 0;
            this.y = this.followInstance.y || 0;
        }
    }

    private centerAroundBoundary(boundary: Boundary): void {

        if (!boundary) {
            throw new Error(`boundary is ${boundary}`);
        }

        this.x = this.followInstance.x + (boundary.width / 2) - (this.width / 2);
        this.y = this.followInstance.y + (boundary.height / 2) - (this.height / 2);
    }
}