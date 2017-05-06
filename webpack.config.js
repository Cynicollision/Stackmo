const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: __dirname,
    resolve: { extensions: ['.ts', '.js'] },
    devtool: 'inline-source-map', // TODO: only if production
    entry: { 
        'vastgame': './src/engine/vastgame.ts',
        'demo': './src/demo/demo.ts',
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '/dist/'
    },
    module: {
        rules: [
            { 
                test: /\.ts$/, 
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: ['awesome-typescript-loader'] 
            },
        ]
    },
    plugins: [
    ]
};