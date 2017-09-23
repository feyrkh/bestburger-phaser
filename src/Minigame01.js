/* global Phaser */
import 'phaser';
import {Util} from './util/Util.js';

const BACKGROUND_LAYER = -10;
const DOOR_LAYER = -5;
const PLAYER_LAYER = 0;

const SCORE_PROGRESS_PER_CLICK = 0.1;
const DOOR_TIMER = 250; // Check for door state changes after this many milliseconds

const MAX_FUN = 100;
const DRAIN_PER_MS = 10/1000;
// const FUN_PER_CLICK = DRAIN_PER_MS * 1000 / 4;
const DRAIN_PROTECTION_MS_PER_CLICK = 100;
const FUN_PER_CLICK = 0;

let defaultScoreSettings = {
        type: 'score', 
        onWork: ['backToWork'],
        onFail: ['failed'],
        danger: true
};

// Generate a random function, for use in setting up timer ranges etc
function random(min, max) {
    if(!max) max = min;
    return function() { return Phaser.Math.Between(min, max) };
}


var Minigame01 = new Phaser.Class({
    Extends: Phaser.Scene,
    util: Util,
    curPlayerState: 'cleaning',
    playerStates: {
        timer: 0,
        curFrame: 0,
        cleaning: { 
            type: 'safe', 
            frames:'cleaning',
            onGoof: ['texting', 'angryTexting', 'selfie'],
            sfx:'working',
            danger: false
        },
        texting: Object.assign({}, defaultScoreSettings, {
            frames: 'texting'
        }),
        angryTexting: Object.assign({}, defaultScoreSettings, {
            frames: 'angryTexting'
        }),
        selfie: Object.assign({}, defaultScoreSettings, {
            frames: 'selfie'
        }),
        backToWork: {
            type: 'transition',
            frames: 'backToWork',
            onAnimationDone: 'cleaning'
        },
        bored: {
            type: 'bored',
            frames: 'bored',
            onAnimationDone: 'cleaning',
            bored: true, // regenerate boredom instead of losing it over time
            danger: true
        },
        fail: { 
            type: 'fail',
            danger: false
        }
    },
    curDoorState: 'doorClosed',
    doorStates: {
        timer: 500, // When this hits zero, check for state change
        defaultNextTimer: random(250), // If the state doesn't specify, use this default
        doorClosed: {
            type: 'timer',
            frames: 'doorClosed',
            onTimer: ['doorJiggle','doorJiggle','doorJiggle','doorJiggle','doorOpening'], 
            nextTimer: random(1000, 4500)
        },
        doorJiggle: {
            type: 'timer',
            frames: 'doorJiggle',
            onTimer: ['doorJiggle', 'doorPreOpen', 'doorPreOpen',  'doorPreOpen', 'doorClosed'],
            nextTimer: random(200, 1000),
            sfx: '01_creak'
        },
        doorPreOpen: {
            type: 'timer',
            frames: 'doorJiggle',
            onTimer: ['doorPreOpen', 'doorPreOpen', 'doorPreOpen', 'doorOpening', 'doorOpening', 'doorOpening', 'doorOpening', 'doorOpening', 'doorOpening', 'doorOpeningUp'],
            nextTimer: random(100, 500),
            sfx: '01_creak'
        },
        doorOpening: {
            type: 'transition',
            frames: 'doorOpening',
            onAnimationDone: ['doorOpen'],
            sfx: '01_open'
        },
        doorOpeningUp: {
            type: 'transition',
            frames: 'doorOpeningUp',
            onAnimationDone: ['doorOpen'],
            sfx: '01_open'
            
        },
        doorOpen: {
            type: 'timer',
            frames: 'doorOpen',
            onTimer: ['eyeSparkle'],
            nextTimer: random(50,50)
        },
        eyeSparkle: {
            type: 'timer',
            frames: 'eyeSparkle',
            onTimer: ['doorClosing'],
            nextTimer: random(500, 3000),
            danger: true,
        },
        doorClosing: {
            type: 'transition',
            frames: 'doorClosing',
            onAnimationDone: ['doorClosed'],
            sfx: '01_close'
        },
        fail1: {
            type: 'timer',
            frames: 'fail1',
            onTimer: 'fail2',
            nextTimer: random(200, 200)
        },
        fail2: {
            type: 'transition',
            frames: 'fail2',
            onAnimationDone: 'fail3'
        },
        fail3: {
            type: 'timer',
            frames: 'fail3',
            onTimer: 'fail4',
            nextTimer: random(2000)
        },
        fail4: {
            finishMinigame: true
        }
    },
    initialize:
    function Minigame01 ()
    {
        console.log("Minigame01()", this);
        this.util.registerMinigame(this, 'minigame01');
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
        // Background
        this.util.spritePosition(this.add.image(0, 0, 'minigame01', 'BACKGROUND/00.png'), 0, 0, BACKGROUND_LAYER);
        
        // Player
        this.playerSprite = this.add.sprite(0, 0, 'minigame01', 'CLEANING/00.png');
        this.anims.create({ key: 'cleaning', frames: this.buildFrames('CLEANING/', 2), frameRate: 10, yoyo: true, repeat: -1 });
        this.anims.create({ key: 'texting', frames: this.buildFrames('TEXTING/', 2), frameRate: 1, yoyo: false, repeat: -1 });
        this.anims.create({ key: 'angryTexting', frames: this.buildFrames('ANGRY TEXTING/', 2), frameRate: 1, yoyo: false, repeat: -1});
        this.anims.create({ key: 'selfie', frames: this.buildFrames('SELFIE/', 2), frameRate: 1, yoyo: false, repeat: -1 });
        this.anims.create({ key: 'bored', onComplete: this.finishPlayerStateTransition, callbackScope: this, frames: this.buildFrames('ANGRY TEXTING/', 2), frameRate: 2, yoyo: true, repeat: 3});
        this.anims.create({ key: 'backToWork', onComplete: this.finishPlayerStateTransition, callbackScope: this, frames: this.anims.generateFrameNames('minigame01', { prefix: 'CLEANING_TRANSITION/', suffix: ".png", start: 0, end: 0, zeroPad: 2 }), frameRate: 18, repeat: 0});
        this.util.spritePosition(this.playerSprite, 0, 0, PLAYER_LAYER);
        this.playerSprite.play('cleaning');
        
        
        // Door
        this.doorSprite = this.add.sprite(0, 0, 'minigame01', 'DOOR_CLOSE/05.png');
        this.util.spritePosition(this.doorSprite, 0, 0, DOOR_LAYER);
        this.anims.create({ key: 'doorJiggle', frames: this.buildFrames('DOOR_OPEN/', 1), frameRate: 10, yoyo: true, repeat: 1});
        this.anims.create({ key: 'doorOpening', onComplete: this.finishDoorStateTransition, callbackScope: this, frames: this.buildFrames('DOOR_OPEN/', 5), frameRate: 13, repeat: 0});
        this.anims.create({ key: 'eyeSparkle', frames: this.buildFrames('BOSS/', 1), frameRate: 10, repeat: -1});
        this.anims.create({ key: 'doorOpeningUp', onComplete: this.finishDoorStateTransition, callbackScope: this, frames: this.buildFrames('DOOR_OPEN_VERTICAL/', 5), frameRate: 20, repeat: 0});
        this.anims.create({ key: 'doorClosing', onComplete: this.finishDoorStateTransition, callbackScope: this, frames: this.buildFrames('DOOR_CLOSE/', 5), frameRate: 20, repeat: 0});
        this.anims.create({ key: 'doorOpen', frames: this.anims.generateFrameNames('minigame01', { prefix: 'DOOR_OPEN/', suffix: ".png", start: 4, end: 4, zeroPad: 2 }), frameRate: 10});
        this.anims.create({ key: 'doorClosed', frames: this.anims.generateFrameNames('minigame01', { prefix: 'DOOR_CLOSE/', suffix: ".png", start: 5, end: 5, zeroPad: 2 }), frameRate: 10});
        this.anims.create({ key: 'fail1', onComplete: this.finishDoorStateTransition, callbackScope: this, frames: this.anims.generateFrameNames('minigame01', { prefix: 'FAIL/', suffix: ".png", start: 0, end: 1, zeroPad: 2 }), frameRate: 30, repeat: -1});
        this.anims.create({ key: 'fail2', onComplete: this.finishDoorStateTransition, callbackScope: this, frames: this.anims.generateFrameNames('minigame01', { prefix: 'FAIL/', suffix: ".png", start: 2, end: 6, zeroPad: 2 }), frameRate: 10});
        this.anims.create({ key: 'fail3', onComplete: this.finishDoorStateTransition, callbackScope: this, frames: this.anims.generateFrameNames('minigame01', { prefix: 'FAIL/', suffix: ".png", start: 7, end: 11, zeroPad: 2 }), frameRate: 10, yoyo: true, repeat: -1});
        
        // UI
        this.healthBar = this.add.graphics({
            lineStyle: {width:5, color: 0x00ff00}
        });
        
        // Sounds
        Util.loadSound('bgm', 'assets/SOUND FX/MUSIC/EVENT_01_PHONE BGM.mp3',true);
        Util.loadSound('heartbeat','assets/SOUND FX/phone minigame/mp3/heartbeat.mp3',true);
        Util.loadSound('01_creak', 'assets/SOUND FX/phone minigame/mp3/door_rattle_04.mp3');
        Util.loadSound('01_open',  'assets/SOUND FX/phone minigame/mp3/door_open.mp3');
        Util.loadSound('01_close',  'assets/SOUND FX/phone minigame/mp3/door_close.mp3');
        Util.loadSound('working',  'assets/SOUND FX/phone minigame/mp3/RAG_SWISH.mp3');
        Util.adjustVolume('working',.5);
        
        Util.loadSound('caught',  'assets/SOUND FX/phone minigame/mp3/got_caught.mp3');
      
         
        Util.loadSound('good', '/assets/SOUND FX/BB_GOOD01.mp3');
        Util.adjustVolume('good',.2);
        
        // Setup input
        if(!this.inputInitialized) {
            this.inputInitialized = true;
            var _this = this;
            this.input.events.on('KEY_DOWN_A', function (event) {
                _this.handleKeyboardInput(event);
                Util.playSound('good');
            });
            this.input.events.on('KEY_DOWN_S', function (event) {
                _this.handleKeyboardInput(event); 
                Util.playSound('good');
            });
            this.input.events.on('KEY_DOWN_D', function (event) {
                _this.handleKeyboardInput(event);
                    Util.playSound('good');
            });
            this.input.events.on('KEY_DOWN_F', function (event) {
                _this.handleKeyboardInput(event);
                    Util.playSound('good');
            });
            this.input.events.on('KEY_DOWN_SPACE', function (event) {
                _this.handleKeyboardInput(event);
            });
        }
                
        this.registry.set('minigameScore', 0);

        this.inputToggle = true;
        this.gameTimer = 0;
        this.setNextDoorState('doorClosed');
        this.setNextPlayerState('cleaning');
        this.fun = MAX_FUN;
        this.pauseFunLoss = false;
        this.drainProtectionMs = 0;
        
        this.time.addEvent({delay: 800, callback: function() {
            // add score
            let playerState = this.getCurPlayerState();
            if(playerState.sfx)
            {
                Util.playSound(playerState.sfx);
            }
            if(!playerState.danger || playerState.bored) return;
        }, callbackScope: this, loop: true});

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
                case "f":
                case "A": 
                case "S": 
                case "D":
                case "F":this.playerGoofOff(); break;
                case " ": this.playerWork(); break;
            }
        }
    },
    
    getCurPlayerState: function() {
//        console.log("Returning state "+curPlayerState, playerStates[curPlayerState]);
        return this.playerStates[this.curPlayerState];
    },
    
    
    setNextPlayerState: function(nextStateName) {
        console.log("setting next state: "+nextStateName);
        this.curPlayerState = nextStateName;
        let state = this.getCurPlayerState();
        this.playerSprite.play(state.frames);
    },

    finishPlayerStateTransition: function() {
        let state = this.getCurPlayerState();
        if(state.onAnimationDone) {
            this.setNextPlayerState(this.util.randomEntry(state.onAnimationDone));
        }
    },
    
    
    getCurDoorState: function() {
//        console.log("Returning state "+curPlayerState, playerStates[curPlayerState]);
        return this.doorStates[this.curDoorState];
    },
    
    finishDoorStateTransition: function() {
        let state = this.getCurDoorState();
        if(state.onAnimationDone) {
            this.setNextDoorState(this.util.randomEntry(state.onAnimationDone));
        }
    },
    
    setNextDoorState: function(nextStateName) {
        console.log("setting next door state: "+nextStateName);
        this.curDoorState = nextStateName;
        let state = this.getCurDoorState();
        this.doorSprite.play(state.frames);
        if(state.type == 'timer') {
            state.nextTimer = state.nextTimer || this.doorStates.defaultNextTimer();
            this.doorStates.timer = state.nextTimer();
        }
        // sets the heartbeat to go off when being watched
         if(nextStateName == 'eyeSparkle')
             Util.playSound('heartbeat');
            else
            Util.stopSound('heartbeat');
            
        if(state.sfx) {
            Util.playSound(state.sfx);
        }
    },
     addScore: function(amt) {
        console.log("Adding "+amt+" points");
        this.util.incrementRegistry(this.registry, 'minigameScore', amt);
        this.util.incrementRegistry(this.registry, 'minigameScoreTotal', amt);
    },

    playerGoofOff: function() {
            if(this.songStarted != true){
            Util.playSound('bgm');
            this.songStarted = true;
            }
       Util.adjustVolume('bgm',.75);
        let state = this.getCurPlayerState();
        switch(state.type) {
            case 'safe': 
                this.setNextPlayerState(this.util.randomEntry(state.onGoof));
                break;
            case 'score':
                this.addScore(10);
                this.playerSprite.anims.currentAnim.nextFrame(this.playerSprite.anims);
                console.log("New frame: "+this.playerSprite.anims.currentFrame.frame.name);
               // this.fun = Math.min(this.fun+FUN_PER_CLICK, MAX_FUN);
             //   this.drainProtectionMs = DRAIN_PROTECTION_MS_PER_CLICK;
                break;
            case 'fail': 
                // Do nothing
                break;
        }
    },
    
    playerWork: function() {
       Util.adjustVolume('bgm',0);
        let state = this.getCurPlayerState();
        this.scoreProgress = 0;
        if(state.onWork) {
            this.setNextPlayerState(this.util.randomEntry(state.onWork));
        }
    },
    
    gameOver: function() {
        this.playerSprite.visible = false;
        this.pauseFunLoss = true;
        Util.playSound('caught');
        Util.stopSound('bgm');
        this.setNextPlayerState('fail');
        this.setNextDoorState('fail1');
    },
    
    finishMinigame: function() {
        this.scene.stop();
        this.scene.resume('MainScene');
    },

    update: function (time, delta)
    {
        let playerState = this.getCurPlayerState();
        let doorState = this.getCurDoorState();
        this.gameTimer += delta;
        if(!this.pauseFunLoss) {
            let drainAmt = delta;
            if(playerState.bored) {
               // this.fun += drainAmt * DRAIN_PER_MS * 1.5;
            } else {
                if(this.drainProtectionMs > 0) {
                    drainAmt = 0;
                    this.drainProtectionMs = Math.max(this.drainProtectionMs - delta, 0);
                }
                
           //     console.log("delta: "+delta+", drain protection: "+this.drainProtectionMs+", drainAmt: "+drainAmt);
               // this.fun -= DRAIN_PER_MS * drainAmt * (doorState.danger ? -0.3 : 1) / (120000/(120000+this.gameTimer));
            }
        }
        /*Draw fun bar
        this.healthBar.clear();
        let funPercent = this.fun/MAX_FUN;
        if(funPercent > 0.8) {
            this.scoreLevel = 1;
            this.healthBar.lineStyle(5, 0x00ff00);
        } else if(funPercent > 0.5) {
            this.scoreLevel = 0.8;
            this.healthBar.lineStyle(5, 0xffff00);
        } else if(funPercent > 0.2) {
            this.scoreLevel = 0.3;
            this.healthBar.lineStyle(5, 0xff0000);
        } else {
            this.scoreLevel = 0.05;
            this.healthBar.lineStyle(5, 0x000000);
        }
        this.healthBar.lineBetween(0,5, this.cameras.main.width*(funPercent),5);
        if(this.fun <= 0) {
            this.setNextPlayerState('bored');
        }
       */
        
        if(doorState.finishMinigame) {
            this.finishMinigame(); 
            return; 
        }
        
        if(playerState.danger && doorState.danger) {
            // End the game
            console.log("Game over, man!");
            this.gameOver();
        }
        
        // Door state change
        if(doorState.type == 'timer') {
            this.doorStates.timer -= delta;
            if(this.doorStates.timer <= 0) {
                if(doorState.onTimer) {
                    let nextStateName = this.util.randomEntry(doorState.onTimer);
                    if(nextStateName != 'this') this.setNextDoorState(nextStateName);
                }
            }
        }
    }
});

export {Minigame01};