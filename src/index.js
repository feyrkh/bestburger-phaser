/*global Phaser*/
import 'phaser';
import {MainScene} from './MainScene.js';
import {PopUpScene} from './PopUpScene.js';
import {PopUpScene2} from './PopUpScene2.js';

var expectedHeight = 468;
var expectedWidth = 624;

var possibleHeight = window.innerHeight * window.devicePixelRatio;
var possibleWidth = window.innerWidth * window.devicePixelRatio;

var zoomFromHeight = possibleHeight / expectedHeight;
var zoomFromWidth = possibleWidth / expectedWidth;

var cameraZoom = Math.min(zoomFromHeight, zoomFromWidth);

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: expectedWidth, 
    height: expectedHeight,
    zoom: cameraZoom,   
    pixelArt: true,
    scaleMode: 1,
    type: 1, // 1=canvas, 2 or 0=webgl

    scene: [MainScene, PopUpScene, PopUpScene2]
};


var game = new Phaser.Game(config);
