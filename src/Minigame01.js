/* global Phaser */
import 'phaser';
import {Util} from './util/Util.js';

const BACKGROUND_LAYER = -10;
const DOOR_LAYER = -5;
const PLAYER_LAYER = 0;

var curPlayerState = 'cleaning';
var playerStates = {
    timer: 0,
    curFrame: 0,
    cleaning: { 
        type: 'safe', 
        frames: ['CLEANING/00.png', 'CLEANING/01.png'],
        onGoof: ['texting', 'angryTexting', 'selfie']
    },
    texting: { 
        type: 'score', 
        frames: ['TEXTING/00.png', 'TEXTING/01.png'],
        onWork: ['cleaning'],

    },
    angryTexting: { 
        type: 'score',
        frames: ['ANGRY TEXTING/00.png', 'ANGRY TEXTING/01.png'],
        onWork: ['cleaning'],
        
    },
    selfie: { 
        type: 'score', 
        frames: ['SELFIE/00.png', 'SELFIE/01.png'],
        onWork: ['cleaning'],
        
    },
    failed: { type: 'failed' }
};

var curBossState = 'away';
var bossStates = {
    timer: 0,
    nextEventTime: 500,
    away: {},
    doorJiggle: {},
    doorOpen: {},
    doorOpenUp: {},
    eyeSparkle: {},
    arrived: {}
};

var Minigame01 = new Phaser.Class({
    Extends: Phaser.Scene,
    
    initialize:
    function Minigame01 ()
    {
        console.log("Minigame01()", this);
        Util.registerMinigame(this, 'minigame01');
    },

    buildFrames: function(keyPrefix, frameCount) {
        let frames = this.anims.generateFrameNames('minigame01', { prefix: keyPrefix, suffix: ".png", end: frameCount, zeroPad: 2 });
        return frames;
    },

    preload: function ()
    {
        console.log("preload()", this);
        this.load.atlas('minigame01', 'assets/EVENT_01_PHONE/EVENT_01_PHONE.png', 'assets/EVENT_01_PHONE/EVENT_01_PHONE.json');
    },

    create: function ()
    {
        console.log("create()", this);
        this.inputToggle = true;

        // Background
        Util.spritePosition(this.add.image(0, 0, 'minigame01', 'BACKGROUND/00.png'), 0, 0, BACKGROUND_LAYER);

        // Player
        this.playerSprite = this.add.sprite(0, 0, 'minigame01', 'CLEANING/00.png');
        this.anims.create({ key: 'cleaning', frames: this.buildFrames('CLEANING/', 2), frameRate: 10, yoyo: true, repeat: -1 });
        this.anims.create({})
        Util.spritePosition(this.playerSprite, 49, 2, PLAYER_LAYER);
        this.playerSprite.play('cleaning');
        
        
        // Door
        this.doorSprite = this.add.sprite(0, 0, 'minigame01', 'DOOR_OPEN/00.png');
        Util.spritePosition(this.doorSprite, 0, 0, DOOR_LAYER);
        
        // Setup input
        var _this = this;
        this.input.events.on('KEY_DOWN_A', function (event) {
            _this.handleKeyboardInput(event);
        });
        this.input.events.on('KEY_DOWN_S', function (event) {
            _this.handleKeyboardInput(event);
        });
        this.input.events.on('KEY_DOWN_D', function (event) {
            _this.handleKeyboardInput(event);
        });
        this.input.events.on('KEY_DOWN_F', function (event) {
            _this.handleKeyboardInput(event);
        });
        this.input.events.on('KEY_DOWN_SPACE', function (event) {
            _this.handleKeyboardInput(event);
        });
    },

    start: function() {
        console.log("start()", this);
    },
    
    handleKeyboardInput: function(event) {
        if(this.inputToggle){
            if(event.data.repeat) return;
            switch(event.data.key) {
                case "a": 
                case "s": 
                case "d": 
                case "f": this.playerGoofOff(); break;
                case " ": this.playerWork(); break;
            }
        }
    },
    
    curPlayerState: function() {
        return playerStates[curPlayerState];
    },

    playerGoofOff: function() {
        
    },
    
    playerWork: function() {
        
    },
    

    update: function (time, delta)
    {
    }
});

export {Minigame01};