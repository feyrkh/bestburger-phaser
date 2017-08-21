/*global Phaser*/
import 'phaser';
import {MainScene} from './MainScene.js';
import {PopUpScene} from './PopUpScene.js';
import {PopUpScene2} from './PopUpScene2.js';

var expectedHeight = 468;
var expectedWidth = 624;

var possibleHeight = window.innerHeight * window.devicePixelRatio;
var possibleWidth = window.innerWidth * window.devicePixelRatio;

var zoomFromHeight = Math.floor(possibleHeight*2 / expectedHeight)/2;
var zoomFromWidth = Math.floor(possibleWidth*2 / expectedWidth)/2;

var cameraZoom = Math.min(zoomFromHeight, zoomFromWidth);

if(cameraZoom<=0) cameraZoom = 0.5;

console.log("Zoom level: "+cameraZoom)

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
