import { ActorInstance } from './actor';
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
    
    constructor(
        public x: number, 
        public y: number, 
        public readonly width: number, 
        public readonly height: number) {
    }

    follow(actorInstance: ActorInstance, center: boolean = false) {
        this.viewMode = center ? ViewMode.Center : ViewMode.SamePosition;
        this.followInstance = actorInstance;
    }

    attach(actorInstance: ActorInstance, offsetX: number, offsetY: number) {
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
            this.x = this.followInstance.x || 0;
            this.y = this.followInstance.y || 0;
        }

        this.attachments.forEach(att => att.update());
    }

    private centerAroundBoundary(boundary: Boundary) {

        if (!boundary) {
            throw new Error(`boundary is ${boundary}`);
        }

        this.x = this.followInstance.x + (boundary.width / 2) - (this.width / 2);
        this.y = this.followInstance.y + (boundary.height / 2) - (this.height / 2);
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