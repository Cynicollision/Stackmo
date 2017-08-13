export class Registry {
    private static readonly values: { [id: string]: any } = {};

    static get(id: string): any {
        return this.values[id];
    }

    static set(id: string, val: any): void {
        this.values[id] = val;
    }
}