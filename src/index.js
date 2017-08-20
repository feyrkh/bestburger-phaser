import 'phaser';
import {MainScene} from './MainScene.js';
import {PopUpScene} from './PopUpScene.js';
import {PopUpScene2} from './PopUpScene2.js';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [MainScene, PopUpScene, PopUpScene2]
};


var game = new Phaser.Game(config);
