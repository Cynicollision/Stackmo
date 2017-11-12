export class Registry {
    private static readonly values: { [id: string]: any } = {};

    static get(id: string): any {
        return this.values[id];
    }

    static load(id: string): any {
        this.values[id] = localStorage.getItem(id);
        return this.values[id];
    }

    static set(id: string, val: any, persist = false): void {
        this.values[id] = val;
        if (persist) {
            localStorage.setItem(id, val);
        }
    }
}