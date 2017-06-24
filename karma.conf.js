module.exports = function (config) {

    var useChrome = false,
        singleRun = false;

    config.set({
        basePath: './src',
        frameworks: ['jasmine', 'es6-shim'],
        browsers: [ useChrome ? 'Chrome' : 'PhantomJS' ],
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
        singleRun: singleRun,
        phantomjsLauncher: {
            exitOnResourceError: true,
        },
        webpack: require('./webpack.config'),
    });
};
