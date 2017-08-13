import { Key } from './enum';

export class Input {
    private static keyboardHandlers: { [keyCode: number]: () => void } = {};

    static init() {

        document.body.onkeydown = (event: KeyboardEvent) => {
            let callback = this.keyboardHandlers[event.keyCode];

            if (!callback) {
                callback = this.keyboardHandlers[Key.Any];
            }

            if (callback) {
                callback();
            }
        };
    }

    static onKey(key: Key, callback: () => void): void {
        this.keyboardHandlers[key] = callback;
    }

    static onClick(callback: () => void): void {
        document.body.onclick = callback;
    }
}