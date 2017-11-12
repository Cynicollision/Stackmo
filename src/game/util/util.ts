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