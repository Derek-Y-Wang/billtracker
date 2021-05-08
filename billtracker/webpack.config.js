var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'src'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-env", "@babel/React"]
                }
            }
        },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(jpg|png|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 25000
                    }
                }
            }]
    }
}