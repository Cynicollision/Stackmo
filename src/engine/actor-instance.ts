import { Actor, ActorLifecycle, ActorState, LifecycleCallback } from './actor';
import { Direction } from './enum';
import { Sprite } from './sprite';
import { Util } from './util';

export class ActorInstance {
    id: number;
    parent: Actor;

    _onCreate: LifecycleCallback;
    _onStep: LifecycleCallback;
    _onDestroy: LifecycleCallback;

    private previousX: number;
    private previousY: number;
    private state: ActorState;

    x: number = 0;
    y: number = 0;
    speed: number = 0;
    direction: number = Direction.Right;

    constructor(source: Actor, id: number, lifecycle: ActorLifecycle) {
        this.parent = source;
        this.id = id;

        this._onCreate = lifecycle.onCreate;
        this._onStep = lifecycle.onStep;
        this._onDestroy = lifecycle.onDestroy;

        this.previousX = this.x;
        this.previousY = this.y;
        this.state = ActorState.Active;
    }

    get hasMoved(): boolean {
        return (this.x !== this.previousX || this.y !== this.previousY);
    }

    get isActive(): boolean {
        return (this.state === ActorState.Active);
    }

    get sprite(): Sprite {
        return this.parent.sprite;
    }

    collidesWith(other: ActorInstance): boolean {
        let haveBoundariesMoved = this.hasMoved || other.hasMoved;
        let selfBoundary = this.parent.boundary;
        let otherBoundary = this.parent.boundary;

        if (haveBoundariesMoved && selfBoundary && otherBoundary) {
            return selfBoundary.atPosition(this.x, this.y).collidesWith(otherBoundary.atPosition(other.x, other.y));
        }

        return false;
    }

    doMovement(): void {

        if (this.speed !== 0) {
            let offsetX = Math.round((Util.Math.getLengthDirectionX(this.speed, this.direction) / 1));
            let offsetY = Math.round((Util.Math.getLengthDirectionY(this.speed, this.direction) / 1));

            this.setPositionRelative(offsetX, offsetY);
        }
    }

    setPositionRelative(offsetX: number, offsetY: number): void {
        let newX = this.x + offsetX;
        let newY = this.y + offsetY;

        if (this.x !== newX) {
            this.previousX = this.x;
            this.x = newX;
        }

        if (this.y !== newY) {
            this.previousY = this.y;
            this.y = newY;
        }
    }

    destroy(): void {
        this.state = ActorState.Destroyed;
    }
}
