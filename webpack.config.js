'use strict';

const webpack = require('webpack');
const path = require('path');

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
        "public": "bestburger-phaser-feyrkh.c9users.io",
        historyApiFallback: true
    }

};
