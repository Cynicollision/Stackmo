import { Boundary } from './boundary';
import { Sprite } from './sprite';

describe('Boundary', () => {

    it('can be created from Sprite dimensions', () => {
        let sprite = new Sprite({ imageSource: '', height: 32, width: 48 });
        let boundary = Boundary.fromSprite(sprite);

        expect(boundary.height).toEqual(sprite.height);
        expect(boundary.width).toEqual(sprite.width);
    });

    it('throws an error if defined with invalid dimensions', () => {
        expect(() => new Boundary(0, 0)).toThrow();
    });

    it('detects collisions when boundaries overlap', () => {
        let b1 = new Boundary(10, 10);
        let b2 = new Boundary(12, 12);

        let test = (b1: Boundary, b2: Boundary) => {
            expect(b1.atPosition(51, 51).collidesWith(b2.atPosition(50, 50))).toBe(true);
            expect(b1.atPosition(50, 50).collidesWith(b2.atPosition(45, 45))).toBe(true);
            expect(b1.atPosition(50, 50).collidesWith(b2.atPosition(45, 55))).toBe(true);
            expect(b1.atPosition(50, 50).collidesWith(b2.atPosition(55, 55))).toBe(true);
            expect(b1.atPosition(50, 50).collidesWith(b2.atPosition(55, 55))).toBe(true);
            expect(b1.atPosition(50, 50).collidesWith(b2.atPosition(50, 65))).toBe(false);
            expect(b1.atPosition(50, 50).collidesWith(b2.atPosition(35, 50))).toBe(false);
        };

        test(b1, b2);
        test(b2, b1);        
    });
});