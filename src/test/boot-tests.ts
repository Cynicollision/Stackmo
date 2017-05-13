// require all *.spec.ts files
function requireAll(context: any) {
    return context.keys().map(context);
}

requireAll((require as any).context('./../', true, /\.spec\.ts$/));
