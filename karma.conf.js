module.exports = function (config) {

    var debugInChrome = false;

    config.set({
        basePath: './src',
        frameworks: ['jasmine'],
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
