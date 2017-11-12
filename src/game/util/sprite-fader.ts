import { Sprite, SpriteTransformation } from './../../engine/vastgame';

const DelayInterval = 100;
const OpacityDelta = 0.25;

export class SpriteFader {
    
    // TODO (fortification): alternatives that accept Room objects, dynamically getting a unique collection of Sprites

    static fadeOut(sprites: Sprite[], callback: () => any): void {
        let fade = 1;
    
        let timer = setInterval(() => {
            fade -= OpacityDelta;
            sprites.forEach(sprite => sprite.transform(SpriteTransformation.Opacity, -OpacityDelta));
    
            if (fade <= 0) {
                clearInterval(timer);
                setTimeout(callback, DelayInterval * 2);
            }
        }, DelayInterval);
    }

    static fadeIn(sprites: Sprite[], callback?: () => any): void {
        let fade = 0;
        sprites.forEach(sprite => sprite.setTransform(SpriteTransformation.Opacity, 0));

        let timer = setInterval(() => {
            fade += OpacityDelta;
            sprites.forEach(sprite => sprite.transform(SpriteTransformation.Opacity, OpacityDelta));

            if (fade >= 1) {
                clearInterval(timer);

                if (callback) {
                    setInterval(callback, DelayInterval * 2);
                }
            }
        }, DelayInterval);
    }
}