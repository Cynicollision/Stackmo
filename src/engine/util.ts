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

    static arrayFromMap<K, V>(map: Map<K, V>): Array<[K, V]> {
        return Array.from(map.entries());
    }

    static valuesFromMap<K, V>(map: Map<K, V>): Array<V> {
        return Array.from(map.values());
    }
}

