/* global Phaser */
import 'phaser';
import {Util} from './util/Util.js';

const BG_LAYER = -100;
const BORDER_LAYER = 5;
const PLAYFIELD_LAYER = 0;
const PLAYER_LAYER = 50;

const PLAYER_Y = 274;
const PLAYER_X_RED = 111;
const PLAYER_X_YELLOW = 168;
const PLAYER_X_WHITE = 226;
const PLAYER_X_GREEN = 285;
const PLAYER_X_BLUE = 342;

var Minigame03 = new Phaser.Class({
    Extends: Phaser.Scene,
    
    initialize: function Minigame03 ()
    {
        console.log("Minigame03()", this);
        Util.registerMinigame(this, 'minigame03');
    },
    
    preload: function ()
    {
        console.log("preload()", this);
        this.load.atlas('minigame03', 'assets/EVENT_03_BUGBLOCKER/EVENT_03_BUGBLOCKER.png', 'assets/EVENT_03_BUGBLOCKER/EVENT_03_BUGBLOCKER.json');
        this.load.atlas('hud', 'assets/HUD/HUD.png', 'assets/HUD/HUD.json');
    },
    
    preloadSounds: function() {
        Util.loadSound('03_bgm', 'assets/SOUND FX/MUSIC/BOSSA_BGM.mp3',true,1);
    },
    
    create: function ()
    {
        let _this = this;
        this.anims.create({ key: 'bg', frames: this.anims.generateFrameNames('minigame03', { prefix: 'BG/', suffix: ".png", start: 0, end: 11, zeroPad: 2 }), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'shootingStar', frames: this.anims.generateFrameNames('minigame03', {prefix: 'SHOOTING STAR/', suffix: '.png', start: 0, end: 5, zeroPad: 2}), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'enemyLadybug', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_LADYBUG/', suffix: '.png', start: 0, end: 5, zeroPad: 2}), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'enemyRobot', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_ROBOT/', suffix: '.png', start: 0, end: 5, zeroPad: 2}), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'enemyWorm', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_WORM/', suffix: '.png', start: 0, end: 2, zeroPad: 2}), frameRate: 15, repeat: -1});
        let jumperFrames = this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_JUMPER/', suffix: '.png', start: 0, end: 2, zeroPad: 2});
        jumperFrames = this.anims.generateFrameNames('minigame03', {framesArray: jumperFrames, prefix: 'ENEMY_JUMPER/', suffix: '.png', start: 2, end: 2, zeroPad: 2});
        jumperFrames = this.anims.generateFrameNames('minigame03', {framesArray: jumperFrames, prefix: 'ENEMY_JUMPER/', suffix: '.png', start: 2, end: 4, zeroPad: 2});
        this.anims.create({ key: 'enemyJumper', frames: jumperFrames, frameRate: 15, repeat: -1});

        this.playerMoving = false;
        let onPlayerMovingComplete = function() { _this.playerMoving = false; };
        let lennyFrames = this.anims.generateFrameNames('minigame03', { prefix: 'LENNY/', suffix: ".png", start: 0, end: 7, zeroPad: 2 });
        lennyFrames = this.anims.generateFrameNames('minigame03', { framesArray: lennyFrames, prefix: 'LENNY/', suffix: ".png", start: 0, end: 0, zeroPad: 2 });
        this.anims.create({ key: 'lenny', frames: lennyFrames, frameRate: 15, repeat: 0, onComplete: onPlayerMovingComplete });

        this.anims.create({ key: 'cautionSign', frames: this.anims.generateFrameNames('minigame03', { prefix: 'CAUTION SIGN/', suffix: ".png", start: 0, end: 1, zeroPad: 2 }), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'playerPosition', frames: this.anims.generateFrameNames('minigame03', { prefix: 'PLAYER_POSITION/', suffix: ".png", start: 0, end: 11, zeroPad: 2 }), frameRate: 15, repeat: -1});

        this.bg = this.add.sprite(0, 0, 'bg');
        Util.spritePosition(this.bg,0,0,BG_LAYER);
        this.bg.play('bg');
        
        this.borderImg = this.add.image(0, 0, 'minigame03', 'BORDER.png');
        Util.spritePosition(this.borderImg, 0, 0, BORDER_LAYER);
        this.playfieldImg = this.add.image(0, 0, 'minigame03', 'PLAYFIELD.png');
        Util.spritePosition(this.playfieldImg, 0, 0, PLAYFIELD_LAYER);
        this.playerPositionBlueImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/BLUE.png'), 0, 0, PLAYER_LAYER-1);
        this.playerPositionRedImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/RED.png'), 0, 0, PLAYER_LAYER-1);
        this.playerPositionWhiteImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/WHITE.png'), 0, 0, PLAYER_LAYER-1);
        this.playerPositionYellowImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/YELLOW.png'), 0, 0, PLAYER_LAYER-1);
        this.playerPositionGreenImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/GREEN.png'), 0, 0, PLAYER_LAYER-1);
        
        this.player = this.add.sprite(0, 0, 'lenny');
        Util.spritePosition(this.player, PLAYER_X_BLUE, PLAYER_Y, PLAYER_LAYER);
        this.player.play('lenny');
        
        // Setup input
        if(!this.inputInitialized) {
            console.log('Initializing input');
            this.regularKeyListener = function (event) {
                _this.handleKeyboardInput(event);
            };
            
            this.inputInitialized = true;
        }
        this.input.enabled = true;
        this.input.events.on('KEY_DOWN_A', this.regularKeyListener);
        this.input.events.on('KEY_DOWN_S', this.regularKeyListener);
        this.input.events.on('KEY_DOWN_D', this.regularKeyListener);
        this.input.events.on('KEY_DOWN_F', this.regularKeyListener);
        this.input.events.on('KEY_DOWN_SPACE', this.regularKeyListener);
        this.inputToggle = true;

        this.movePlayer(PLAYER_X_WHITE, this.playerPositionWhiteImg);
    },
    
    movePlayer: function(xPos, positionImg) {
        if(this.playerMoving == xPos) {
            return;
        }
        this.playerMoving = xPos;
        this.player.x = xPos;
        this.player.play('lenny');
        this.playerPositionRedImg.visible = false;
        this.playerPositionYellowImg.visible = false;
        this.playerPositionGreenImg.visible = false;
        this.playerPositionBlueImg.visible = false;
        this.playerPositionWhiteImg.visible = false;
        positionImg.visible = true;
    },
    
    handleKeyboardInput: function(event) {
        console.log('Input: ', event);
        if(this.inputToggle){
            if(event.data.repeat) return;
            switch(event.data.key) {
                case "a": 
                case "A": 
                    this.movePlayer(PLAYER_X_RED, this.playerPositionRedImg);
                    break;
                case "s": 
                case "S": 
                    this.movePlayer(PLAYER_X_YELLOW, this.playerPositionYellowImg);
                    break;
                case "d":
                case "D":
                    this.movePlayer(PLAYER_X_GREEN, this.playerPositionGreenImg);
                    break;
                case "f":
                case "F":
                    this.movePlayer(PLAYER_X_BLUE, this.playerPositionBlueImg);
                    break;
                case " ": 
                    this.movePlayer(PLAYER_X_WHITE, this.playerPositionWhiteImg);
                    break;
            }
        }
    },

    start: function() {
        console.log("start()", this);
    }
});

export {Minigame03};