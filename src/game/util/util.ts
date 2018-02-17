import * as Constants from './constants';
import { Registry} from './registry';

export { Registry };

export function requireModules(rootDir: string, fileNames: string[]) {
    fileNames.forEach(name => require('./../' + rootDir + '/' + name));
}

export function buildCanvasDimensions(): [number, number] {
    let fillScreen = window.innerWidth < Constants.CanvasMaxWidth;

    let canvasWidth = fillScreen ? window.innerWidth : Constants.CanvasMaxWidth;
    canvasWidth += (canvasWidth % 2 === 0) ? 0 : 1;

    let canvasHeight = fillScreen ? window.innerHeight : Constants.CanvasMaxHeight;
    canvasHeight += (canvasHeight % 2 === 0) ? 0 : 1;

    return [canvasWidth, canvasHeight];
}

// returns (x, y) coordinates and frame number(s) for 1 or 2 digit frames based on the given number.
interface NumberFrame {
    x: number;
    y: number;
    frame: number;
}

export function getDigitDrawInstances(number: number, useAltColor: boolean = false): NumberFrame[] {
    let singleDigitMargin = Math.floor(Constants.GridCellSize / 4);
    let tensMargin = Math.floor(singleDigitMargin / 2) - 3;
    let onesMargin = Math.floor(singleDigitMargin * 2) - 3;

    let frameOffset = useAltColor ? 10 : 0;
    let frames: NumberFrame[] = [];

    if (number < 10) {
        frames.push({ x: singleDigitMargin, y: singleDigitMargin, frame: frameOffset + number });
    }
    else {
        frames.push({ x: tensMargin, y: singleDigitMargin, frame: frameOffset + Math.floor(number / 10) });
        frames.push( {x: onesMargin, y: singleDigitMargin, frame: frameOffset + (number % 10) });
    }

    return frames;
}