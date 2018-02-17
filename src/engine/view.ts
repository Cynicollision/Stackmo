import { ActorInstance } from './actor-instance';
import { Boundary } from './boundary';
import { GameCanvasHTML2D } from './canvas';

enum ViewMode {
    SamePosition = 1,
    Center = 2,
}

export class View {

    private viewMode: ViewMode;
    private followInstance: ActorInstance;
    private attachments: ActorInstanceAttachement[] = [];

    private offsetX: number = 0;
    private offsetY: number = 0;
    
    constructor(
        public x: number, 
        public y: number, 
        public readonly width: number, 
        public readonly height: number) {
    }

    follow(actorInstance: ActorInstance, center: boolean = false, offsetX: number = 0, offsetY: number = 0) {
        this.viewMode = center ? ViewMode.Center : ViewMode.SamePosition;
        this.followInstance = actorInstance;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    attach(actorInstance: ActorInstance, offsetX: number = 0, offsetY: number = 0) {
        this.attachments.push(new ActorInstanceAttachement(this, actorInstance, offsetX, offsetY));
    }

    update() {

        if (!this.followInstance) {
            return;
        }

        if (this.viewMode === ViewMode.Center) {
            this.centerAroundBoundary(this.followInstance.boundary);
        }
        else {
            this.x = this.offsetX + this.followInstance.x || 0;
            this.y = this.offsetY + this.followInstance.y || 0;
        }

        this.attachments.forEach(att => att.update());
    }

    private centerAroundBoundary(boundary: Boundary) {

        if (!boundary) {
            throw new Error(`boundary is ${boundary}`);
        }

        this.x = this.offsetX + (this.followInstance.x + (boundary.width / 2) - (this.width / 2));
        this.y = this.offsetY + (this.followInstance.y + (boundary.height / 2) - (this.height / 2));
    }
}

class ActorInstanceAttachement {

    constructor (private parent: View,
        private instance: ActorInstance,
        private offsetX: number,
        private offsetY: number) {
        }

    update() {
        this.instance.x = this.parent.x + this.offsetX;
        this.instance.y = this.parent.y + this.offsetY;
    }
}