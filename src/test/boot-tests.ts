import { Vastgame } from './../engine/vastgame';

// initialize a game
Vastgame.init('game', {
    canvas: { width: 100, height: 100 },
});

// require all *.spec.ts files (source: webpack docs)
function requireAll(context: any) {
    return context.keys().map(context);
}

requireAll((require as any).context('./../', true, /\.spec\.ts$/));
