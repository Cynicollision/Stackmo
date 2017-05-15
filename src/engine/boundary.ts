import { Sprite } from './sprite';

class PositionedBoundary {
    private height: number;
    private width: number;

    constructor(private x: number, private y: number, boundary: Boundary) {
        this.height = boundary.height;
        this.width = boundary.width;
    }

    collidesWith(other: PositionedBoundary): boolean {
        if (this.x > other.x + other.width || other.x > this.x + this.width) {
            return false;
        }

        if (this.y > other.y + other.height || other.y > this.y + this.height) {
            return false;
        }

        return true;
    }
}

export class Boundary {

    static fromSprite(sprite: Sprite): Boundary {
        return new Boundary(sprite.height, sprite.width);
    }

    constructor(public height, public width) {
    }

    atPosition(x: number, y: number): PositionedBoundary {
        return new PositionedBoundary(x, y, this);
    }
}
