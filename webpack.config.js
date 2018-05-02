const path = require('path');
const webpack = require('webpack');

const env = process.env.NODE_ENV || 'development';

module.exports = {
    context: __dirname,
    mode: env,
    resolve: { extensions: ['.ts', '.js'] },
    devtool: env === 'development' ? 'inline-source-map' : false,
    entry: { 
        'vastgame': './src/engine/vastgame.ts',
        'game': './src/game/game.ts',
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '/dist/'
    },
    module: {
        rules: [
            { test: /\.ts$/, include: path.resolve(__dirname, 'src'), use: 'ts-loader' },
        ]
    },
};