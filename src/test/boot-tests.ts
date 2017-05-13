// require all *.spec.ts files (source: webpack docs)
function requireAll(context: any) {
    return context.keys().map(context);
}

requireAll((require as any).context('./../', true, /\.spec\.ts$/));
