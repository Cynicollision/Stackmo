export class MathUtil {

    static getLengthDirectionX(length: number, direction: number): number {
        return length * Math.cos(direction * (Math.PI / 180));
    }

    static getLengthDirectionY(length: number, direction: number) {
        return length * Math.sin(direction * (Math.PI / 180));
    }
}
