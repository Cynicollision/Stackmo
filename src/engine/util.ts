class MathUtil {

    static getLengthDirectionX(length: number, direction: number): number {
        return Math.floor(length * Math.cos(direction * (Math.PI / 180)));
    }

    static getLengthDirectionY(length: number, direction: number) {
        return Math.floor(length * Math.sin(direction * (Math.PI / 180)));
    }
}

export class Util {

    static Math = MathUtil;

    static getValueOrDefault<T>(value: T, defaultValue: T): T {
    
        if (value === null || value === undefined) {
            return defaultValue;
        }

        return value;
    }
}

