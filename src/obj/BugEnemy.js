/*global Phaser*/
import 'phaser';
import {Util} from '../util/Util.js';

const CAUTION_TIME = 1000;
const WARNING_FLASH_TIME = 400;
const ENEMY_LAYER = 30;

const SPEEDS = {
    'slow': { warnAnim: 'flashSlow', pixelsPerMove: 350 / 10, moveDuration: 1000 },
    'medium': { warnAnim: 'flashMedium', pixelsPerMove: 350 / 5, moveDuration: 1000 },
    'fast': { warnAnim: 'flashFast', pixelsPerMove: 350 / 2, moveDuration: 1000, cautionSign: 'cautionSign' }
};

var BugEnemy = new Phaser.Class({

    initialize: function BugEnemy(scene, opts) {
        this.scene = scene;
        opts = opts || {};
        opts.speed = opts.speed || 'slow';
        opts.warnAnim = SPEEDS[opts.speed].warnAnim;
        opts.warnAnim += opts.warningFlashSuffix || '';
        console.log('warnAnim = '+opts.warnAnim);
        opts.moveDuration = opts.moveDuration || SPEEDS[opts.speed].moveDuration;
        opts.pixelsPerMove = opts.pixelsPerMove || SPEEDS[opts.speed].pixelsPerMove;
        opts.delayBetweenMoves = opts.delayBetweenMoves || 0;
        opts.cautionSign = SPEEDS[opts.speed].cautionSign;
        this.opts = opts;
        this.enemy = scene.add.sprite(opts.x, opts.y, opts.anim);
        this.enemy.setPosition(opts.x+opts.xOfs, opts.y);
        this.enemy.setOrigin(0,0);
        this.enemy.setScale(3);
        this.enemy.visible = false;
        this.enemy.z = opts.z || 100;
        this.enemy.play(opts.anim || 'enemyLadybug');
        this.warning = scene.add.sprite(opts.x, opts.y, opts.warnAnim);
        this.warning.visible = false;
        this.startMoving();
    },
    
    startMoving: function() {
        let _this = this;
        console.log('building tweens with opts: ', this.opts);
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
        console.log('starting caution sign', cautionSign);
        this.scene.tweens.add({
           targets: cautionSign,
           duration: CAUTION_TIME,
           completeDelay: CAUTION_TIME,
           onComplete: function() { 
               console.log('destroyed caution sign');
                cautionSign.destroy(); 
                _this.startWarningFlashTween();
           }
        });
    },
    
    startWarningFlashTween: function() {
        let _this = this;
        Util.spritePosition(this.warning, this.opts.x, this.opts.y, this.opts.z-5);
        this.warning.play(this.opts.warnAnim);
        console.log('starting warning flash', this.warning);
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
        console.log('starting movement');
        let _this = this;
        let numMoves = 350/this.opts.pixelsPerMove;
        this.enemy.play(_this.opts.anim);
        let tweenSettings = {
            targets: this.enemy,
            y: '+='+this.opts.pixelsPerMove,
            duration: this.opts.moveDuration,
            completeDelay: this.opts.delayBetweenMoves,
            onComplete: function() { 
                numMoves--;
                if(numMoves <= 0) {
                    _this.destroyEnemy(); 
                } else {
                    _this.scene.tweens.add(tweenSettings);
                    if(_this.opts.restartAnim) {
                        _this.enemy.play(_this.opts.anim);
                    }
                }
            }
        };
        this.scene.tweens.add(tweenSettings);
    },
    
    destroyEnemy: function() {
        this.scene.enemies.remove(this);
        this.enemy.destroy();
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