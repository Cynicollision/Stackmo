module.exports = function (config) {

  var debugInChrome = false;

  config.set({
      basePath: './src/engine',
      frameworks: ['jasmine'],
      browsers: [ debugInChrome ? 'Chrome' : 'PhantomJS' ],

      files: [
          { pattern: './**/*.spec.js', load: false }
      ],
      exclude: [
          'node_modules',
      ],
      preprocessors: {
          './**/*.spec.js': ['webpack', 'sourcemap'],
      },
      reporters: ['dots'],
      port: 9876,
      colors: true,
      singleRun: !debugInChrome,

      phantomjsLauncher: {
          exitOnResourceError: true
      },
      webpack: {
          devtool: 'inline-source-map'
      },
  });
};