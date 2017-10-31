/*global Phaser*/
import 'phaser';
import {MainScene} from './MainScene.js';
import {MainMenu} from './MainMenu.js';
// import {PopUpScene} from './PopUpScene.js';
// import {PopUpScene2} from './PopUpScene2.js';
import {Minigame01} from './Minigame01.js';

var expectedHeight = 384;
var expectedWidth = 513;

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
    framerate: 30,
    type: Phaser.WEBGL, // 1=canvas, 2 or 0=webgl

    scene: [MainMenu, MainScene, Minigame01]
};

var game = new Phaser.Game(config);
game.registry.set('zoom', cameraZoom);
