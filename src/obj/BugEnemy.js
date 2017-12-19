/*global Phaser*/
import 'phaser';
import {Util} from '../util/Util.js';

const CAUTION_TIME = 1000;
const WARNING_FLASH_TIME = 400;
const ENEMY_LAYER = 30;
const EXPLODE_LAYER = 50;

const SPEEDS = {
    'slow': { warnAnim: 'flashSlow', pixelsPerMove: 350 / 10, moveDuration: 1000 },
    'medium': { warnAnim: 'flashMedium', pixelsPerMove: 350 / 5, moveDuration: 1000 },
    'fast': { warnAnim: 'flashFast', pixelsPerMove: 350 / 2, moveDuration: 1000, cautionSign: 'cautionSign' }
};

const SIZES = {
    'normal': { scale: 3, speed: 1.2, xOfs: 0 },
    'small' : { scale: 2, speed: 1, xOfs: 10 },
    'tiny' : {scale: 1, speed: 0.8, xOfs: 20 }
};

const SIZE_OPTIONS = ['normal', 'small', 'tiny'];

var BugEnemy = new Phaser.Class({

    initialize: function BugEnemy(scene, opts) {
        this.scene = scene;
        opts = opts || {};
        opts.speed = opts.speed || 'slow';
        opts.size = SIZES[opts.size] || SIZES[Util.randomEntry(SIZE_OPTIONS)];
        opts.warnAnim = SPEEDS[opts.speed].warnAnim;
        opts.warnAnim += opts.warningFlashSuffix || '';
        opts.moveDuration = opts.moveDuration || SPEEDS[opts.speed].moveDuration;
        opts.pixelsPerMove = opts.pixelsPerMove || SPEEDS[opts.speed].pixelsPerMove;
        opts.pixelsPerMove = opts.pixelsPerMove * opts.size.speed;
        opts.delayBetweenMoves = opts.delayBetweenMoves || 0;
        opts.cautionSign = SPEEDS[opts.speed].cautionSign;
        opts.explodeAnim = opts.explodeAnim || 'explode';
        opts.xOfs = opts.xOfs || 0;
        this.opts = opts;
        this.enemy = scene.add.sprite(opts.x, opts.y, opts.anim);
        this.enemy.setPosition(opts.x+opts.xOfs+opts.size.xOfs, opts.y);
        this.enemy.setOrigin(0,0);
        this.enemy.setScale(opts.size.scale);
        this.enemy.visible = false;
        this.enemy.z = opts.z || 100;
        this.enemy.play(opts.anim || 'enemyLadybug');
        this.warning = scene.add.sprite(opts.x, opts.y, opts.warnAnim);
        this.warning.visible = false;
        this.startMoving();
    },
    
    startMoving: function() {
        let _this = this;
        //console.log('building tweens with opts: ', this.opts);
        if(this.opts.cautionSign) {
            this.startCautionSignTween();
        } else {
            this.startWarningFlashTween();
        }
    },
    
    startCautionSignTween: function() {
        let _this = this;
        let cautionSign = this.scene.add.sprite(this.opts.cautionSign);
        Util.spritePosition(cautionSign, this.opts.x-3, 0, this.opts.z-1);
        //Util.spritePosition(cautionSign, 0, 0, this.opts.z-1);
        cautionSign.play(this.opts.cautionSign);
        //console.log('starting caution sign', cautionSign);
        this.scene.tweens.add({
           targets: cautionSign,
           duration: CAUTION_TIME,
           completeDelay: CAUTION_TIME,
           onComplete: function() { 
          //     console.log('destroyed caution sign');
                cautionSign.destroy(); 
                _this.startWarningFlashTween();
           }
        });
    },
    
    startWarningFlashTween: function() {
        let _this = this;
        Util.spritePosition(this.warning, this.opts.x, this.opts.y, this.opts.z-5);
        this.warning.play(this.opts.warnAnim);
       // console.log('starting warning flash', this.warning);
        this.scene.tweens.add({
            targets: this.warning,
            duration: WARNING_FLASH_TIME,
            completeDelay: WARNING_FLASH_TIME,
            onStart: function() { 
                _this.enemy.visible = true;
                _this.warning.visible = true; 
                _this.startMovingTween();
            },
            onComplete: function() { 
                _this.warning.destroy();
            }
        });
    },
    
    startMovingTween: function() {
       // console.log('starting movement');
        let _this = this;
        this.enemy.play(_this.opts.anim);
        let tweenSettings = {
            targets: this.enemy,
            y: '+='+this.opts.pixelsPerMove,
            duration: this.opts.moveDuration,
            completeDelay: this.opts.delayBetweenMoves,
            onComplete: function() {
                if(_this.enemy.y > 350) {
                    _this.destroyEnemy(); 
                } else {
                    if(!_this.checkTransformation(tweenSettings)) {
                        _this.scene.tweens.add(tweenSettings);
                        if(_this.opts.restartAnim) {
                            _this.enemy.play(_this.opts.anim);
                        }
                    }
                    if(this.nextPixelsPerMove) {
                        tweenSettings.pixelDepth = this.nextPixelsPerMove;
                        this.nextPixelsPerMove = null;
                    }
                }
            }
        };
        this.scene.tweens.add(tweenSettings);
    },
    
    // Return true if a delayed transformation is happening
    checkTransformation: function(originalTween) {
        if(!this.opts.transform) return false;
        if(Math.random() >= this.opts.transform.chance) return false;
        this.originalTween = originalTween;
        if(this.opts.transform.transformAnim) {
            this.enemy.play(this.opts.transform.transformAnim);
            this.scene.time.addEvent({ delay: this.opts.transform.transformDelay, callback: this.finishTransformation, callbackScope: this, repeat: 0 });
            return true;
        } else {
            this.finishTransformation();
            return true;
        }
    },
    
    finishTransformation: function() {
        this.opts.anim = this.opts.transform.anim || this.opts.anim;
        this.enemy.play(this.opts.anim);
        this.opts.restartAnim = this.opts.transform.restartAnim;
        this.opts.delayBetweenMoves = this.opts.transform.delayBetweenMoves;
        if(this.opts.transform.startupSpeedMultiplier) this.nextPixelsPerMove = this.opts.pixelsPerMove * this.opts.transform.startupSpeedMultiplier;
        this.opts.pixelsPerMove = this.opts.pixelsPerMove * (this.opts.transform.startupSpeedMultiplier || this.opts.transform.speedMultiplier || 1);
        this.originalTween.completeDelay = this.opts.delayBetweenMoves;
        this.originalTween.y = '+='+this.opts.pixelsPerMove;
        console.log('TRANSFORM!', this.originalTween);
        this.opts.transform = null;
        this.startMovingTween();
    },
    
    destroyEnemy: function() {
        this.scene.enemies.remove(this);
        this.enemy.destroy();
    },
    
    killedEnemy: function() {
        //console.log('explodeAnim playing: ', this.opts.explodeAnim);
        let explosion = this.scene.add.sprite(this.enemy.x, this.enemy.y, this.opts.explodeAnim);
        explosion.setOrigin(0, 0);
        explosion.x = (this.enemy.x + this.opts.xOfs);
        explosion.y = (this.enemy.y);
        explosion.z = EXPLODE_LAYER;
        explosion.setScale(this.opts.size.scale);
        explosion.play(this.opts.explodeAnim);        
        this.scene.tweens.add({
           targets: explosion,
           duration: CAUTION_TIME,
           completeDelay: CAUTION_TIME,
           onComplete: function() { 
          //     console.log('destroyed explosion');
                explosion.destroy(); 
           }
        });

        this.destroyEnemy();    
    },
    
    update: function() {
        //if(this.enemy.scene) {
         //   this.enemy.z = ENEMY_LAYER + this.enemy.y;
        //}
    },
    
    getBounds: function(output) {
        return this.enemy.getBounds(output);
    }
});


export {BugEnemy};