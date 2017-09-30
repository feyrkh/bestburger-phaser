'use strict';

const webpack = require('webpack');
const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

    entry: [
        'webpack-dev-server/client?https://0.0.0.0:8080',
        './src/index.js'
    ],

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'project.bundle.js'
    },

    devtool: "source-map",
    devServer: {
        contentBase: './build',
        hot: true,
        host: process.env.IP,
        port: process.env.PORT,
         "public": "bestburger2-feine.c9users.io",
        // "public": "bestburger-phaser2-feyrkh.c9users.io",
        historyApiFallback: true
    },
    
    plugins: [ 
        // new CopyWebpackPlugin([
        //   {from: 'assets', to: 'build/assets/'}
        // ])
    ]

};
