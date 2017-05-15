module.exports = function (config) {

    var debugInChrome = true;

    config.set({
        basePath: './src',
        frameworks: ['jasmine', 'es6-shim'],
        browsers: [ debugInChrome ? 'Chrome' : 'PhantomJS' ],
        files: [
            { pattern: 'test/main.js', watch: false },
        ],
        exclude: [
            'node_modules',
        ],
        preprocessors: {
            'test/main.js': ['webpack', 'sourcemap'],
        },
        reporters: ['dots'],
        port: 9876,
        colors: true,
        singleRun: !debugInChrome,
        phantomjsLauncher: {
            exitOnResourceError: true,
        },
        webpack: require('./webpack.config'),
    });
};
