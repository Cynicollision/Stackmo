# Vastgame
[![Build Status](https://travis-ci.org/Cynicollision/Vastgame.svg?branch=master)](https://travis-ci.org/Cynicollision/Vastgame) [![devDependencies Status](https://david-dm.org/Cynicollision/Vastgame/dev-status.svg)](https://david-dm.org/Cynicollision/Vastgame?type=dev)

Vastgame is a 2D game engine written in Typescript for the HTML Canvas. I'm using it to build *Stackmo*, a puzzle game for the browser. [You can play it here (warning: WIP!)](http://seannormoyle.net/stackmo/view/game_min.html). The plan is to have a reusable game engine that I can use for future game projects after this one.

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
Build (development, includes source maps) and watch for Typescript changes:
```
npm run watch
```

### Building Android package
Build (production) plus minification and a copy to the Android app's "assets" folder:
```
npm run build  //webpack production build (game.js)
gulp minify  //minify (game.js -> game.min.js)
gulp pack  //export required assets (.\\build)
gulp copy-android //copy to specific directory for Android WebView project
```
