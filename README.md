# Vastgame
Vastgame 2D game engine written in Typescript for the HTML Canvas. I'm using it to build *Stackmo*, a puzzle game for the browser. [You can play it here (warning: WIP!)](http://seannormoyle.net/stackmo/view/game_min.html)

![StackMo thumbnail](https://raw.githubusercontent.com/Cynicollision/Vastgame/master/doc/images/thumbnail.png)

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
webpack -w
```

### Building Android package
Full build plus minification and a copy to the Android app's "assets" folder:
```
npm run build
gulp minify
gulp pack
gulp copy-android
```
(webpack build (game.js), minify (game.js -> game.min.js), copy all assets (.\\build), copy to specific directory for Android WebView project)
