export class Util {

    static getValueOrDefault<T>(value: T, defaultValue: T): T {
    
        if (value === null || value === undefined) {
            return defaultValue;
        }

        return value;
    }
}