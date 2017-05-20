import { Actor, ActorLifecycle, ActorState, LifecycleCallback } from './actor';
import { Boundary } from './boundary';
import { Direction } from './enum';
import { Sprite } from './sprite';
import { Util } from './util';

export class ActorInstance {
    private state: ActorState;

    _onCreate: LifecycleCallback;
    _onStep: LifecycleCallback;
    _onDestroy: LifecycleCallback;

    previousX: number;
    previousY: number;
    speed: number = 0;
    direction: number = Direction.Right;

    constructor(public parent: Actor, public id: number, public x: number, public y: number, lifecycle: ActorLifecycle) {
        this._onCreate = lifecycle.onCreate;
        this._onStep = lifecycle.onStep;
        this._onDestroy = lifecycle.onDestroy;
        
        this.state = ActorState.Active;
        this.previousX = this.x;
        this.previousY = this.y;
    }

    get hasMoved(): boolean {
        return (this.x !== this.previousX || this.y !== this.previousY);
    }

    get isActive(): boolean {
        return (this.state === ActorState.Active);
    }

    get boundary(): Boundary {
        return this.parent.boundary;
    }

    get sprite(): Sprite {
        return this.parent.sprite;
    }

    destroy(): void {
        this.state = ActorState.Destroyed;
    }

    onPostStep(): void {
        this.previousX = this.x;
        this.previousY = this.y;
    }

    collidesWith(other: ActorInstance): boolean {
        if (this.hasMoved && this.boundary && other.boundary) {
            return this.boundary.atPosition(this.x, this.y).collidesWith(other.boundary.atPosition(other.x, other.y));
        }

        return false;
    }

    getMovementOffsetX(): number {
        return Util.Math.getLengthDirectionX(this.speed * 100, this.direction) / 100;
    }

    getMovementOffsetY(): number {
        return Util.Math.getLengthDirectionY(this.speed * 100, this.direction) / 100;
    }

    setPositionRelative(x: number, y: number): void {
        this.setPosition(this.x + x, this.y + y);
    }

    setPosition(x: number, y: number): void {
        this.previousX = this.x;
        this.previousY = this.y;

        this.x = x;
        this.y = y;
    }

    occupiesPosition(x: number, y: number): boolean {
        return this.boundary ? this.boundary.atPosition(this.x, this.y).containsPosition(x, y) : false;
    }
}
