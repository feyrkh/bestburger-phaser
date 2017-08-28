/* global Phaser */
import 'phaser';
import {Util} from './util/Util.js';

const BACKGROUND_LAYER = -10;
const DOOR_LAYER = -5;
const PLAYER_LAYER = 0;

const SCORE_PROGRESS_PER_CLICK = 0.1;
const COMBO_TIMER = 200; // Milliseconds between button presses to sustain a combo
const COMBO_MULTIPLIER_TIME = 1000; // Time you have to sustain a combo to get a score speed increase
const COMBO_MULTIPLIER_INCREASE = 0.1; // Additional combo bonus per COMBO_MULTIPLIER_TIME

var curPlayerState = 'cleaning';
var playerStates = {
    timer: 0,
    curFrame: 0,
    cleaning: { 
        type: 'safe', 
        frames:'cleaning',
        onGoof: ['texting', 'angryTexting', 'selfie']
    },
    texting: { 
        type: 'score', 
        frames: 'texting',
        onWork: ['cleaning'],
        onFail: ['failed']
    },
    angryTexting: { 
        type: 'score',
        frames: 'angryTexting',
        onWork: ['cleaning'],
        onFail: ['failed']
        
    },
    selfie: { 
        type: 'score', 
        frames: 'selfie',
        onWork: ['cleaning'],
        onFail: ['failed']
        
    },
    failed: { 
        type: 'fail' 
        
    }
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
        this.comboBreakTimer = COMBO_TIMER; // Counts down to 0 and breaks combo, reset to COMBO_TIMER on goof-off
        this.comboTimer = 0; // Counts up as long as comboBreakTimer > 0, otherwise resets to 0
        this.comboMultiplier = 1; // Multiply our score increase by this amount
        this.scoreProgress = 0;
        this.registry.set('minigameScore', 0);

        // Background
        Util.spritePosition(this.add.image(0, 0, 'minigame01', 'BACKGROUND/00.png'), 0, 0, BACKGROUND_LAYER);

        // Player
        this.playerSprite = this.add.sprite(0, 0, 'minigame01', 'CLEANING/00.png');
        this.anims.create({ key: 'cleaning', frames: this.buildFrames('CLEANING/', 2), frameRate: 10, yoyo: true, repeat: -1 });
        this.anims.create({ key: 'texting', frames: this.buildFrames('TEXTING/', 2), frameRate: 1, yoyo: false, repeat: -1 });
        this.anims.create({ key: 'angryTexting', frames: this.buildFrames('ANGRY TEXTING/', 2), frameRate: 1, yoyo: false, repeat: -1 });
        this.anims.create({ key: 'selfie', frames: this.buildFrames('SELFIE/', 2), frameRate: 1, yoyo: false, repeat: -1 });
        this.anims.create({})
        Util.spritePosition(this.playerSprite, 0, 0, PLAYER_LAYER);
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
//        console.log("Returning state "+curPlayerState, playerStates[curPlayerState]);
        return playerStates[curPlayerState];
    },
    
    setNextPlayerState: function(nextStateName) {
        console.log("setting next state: "+nextStateName);
        curPlayerState = nextStateName;
        let state = this.curPlayerState();
        this.playerSprite.play(state.frames);
    },
    
    playerGoofOff: function() {
        let state = this.curPlayerState();
        switch(state.type) {
            case 'safe': 
                this.scoreProgress = 0;
                this.setNextPlayerState(state.onGoof[Phaser.Math.Between(0, state.onGoof.length-1)]);
                break;
            case 'score':
                // state.curFrame = state.curFrame || 0;
                // state.curFrame = (state.curFrame+1) % state.frames.length;
                this.playerSprite.anims.currentAnim.nextFrame(this.playerSprite.anims);
                this.scoreProgress += SCORE_PROGRESS_PER_CLICK * this.comboMultiplier;
                // console.log("Score progress: "+this.scoreProgress);
                while(this.scoreProgress >= 1) {
                    this.scoreProgress -= 1;
                    this.addScore();
                }
                this.comboBreakTimer = COMBO_TIMER; // Reset combo break
                break;
            case 'fail': 
                // Do nothing
                break;
        }
    },
    
    addScore: function() {
        console.log("Adding a point");
        Util.incrementRegistry(this.registry, 'minigameScore', 1);
        Util.incrementRegistry(this.registry, 'minigameScoreTotal', 1);
    },
    
    playerWork: function() {
        let state = this.curPlayerState();
        this.scoreProgress = 0;
        if(state.onWork) {
            this.setNextPlayerState(state.onWork[Phaser.Math.Between(0, state.onWork.length-1)]);
        }
    },
    

    update: function (time, delta)
    {
        this.comboBreakTimer -= delta;
        if(this.comboBreakTimer <= 0) {  // Combo break!
            if(this.comboMultiplier > 1) console.log("Combo break!");
            this.comboTimer = 0;
            this.comboMultiplier = 1;
        } else {
            this.comboTimer += delta;
            if(this.comboTimer >= COMBO_MULTIPLIER_TIME) {
                this.comboTimer = 0;
                this.comboMultiplier += COMBO_MULTIPLIER_INCREASE;
                console.log("Combo multiplier increase: "+this.comboMultiplier);
            }
        }
    }
});

export {Minigame01};