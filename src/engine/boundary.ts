import { Sprite } from './sprite';

export class PositionedBoundary {
    private height: number;
    private width: number;

    constructor(public x: number, public y: number, boundary: Boundary) {
        this.height = boundary.height;
        this.width = boundary.width;
    }

    collidesWith(other: PositionedBoundary): boolean {
        if (this.x > other.x + other.width || other.x >= this.x + this.width) {
            return false;
        }

        if (this.y > other.y + other.height || other.y >= this.y + this.height) {
            return false;
        }

        return true;
    }

    containsPosition(x: number, y: number): boolean {
        if (this.x > x || x > this.x + this.width) {
            return false;
        }

        if (this.y > y || y > this.y + this.height) {
            return false;
        }

        return true;
    }
}

export class Boundary {

    static fromSprite(sprite: Sprite, solid: boolean = false): Boundary {
        return new Boundary(sprite.height, sprite.width, solid);
    }

    constructor(public height: number, public width: number, public solid: boolean = false) {
        if (height <= 0 || width <= 0) {
            throw new Error('Height and width must both be greater than zero.');
        }
    }

    atPosition(x: number, y: number): PositionedBoundary {
        return new PositionedBoundary(x, y, this);
    }
}
