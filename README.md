# Vastgame
2D game engine in Typescript for the HTML Canvas.

### Setup
1. Install dependencies:
```
npm install
```
2. Build:
```
npm run build
```
3. Run tests:
```
npm test
```

### Developing
Build and watch for Typescript changes:
```
npm run watch
```

### Building Android package
Full build plus minification and a copy to the Android app's "assetss" folder:
```
npm run build
gulp minifiy
gulp pack
gulp copy-android
```
