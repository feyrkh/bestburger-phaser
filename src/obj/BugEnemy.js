/*global Phaser*/
import 'phaser';

const SPEEDS = {
    'slow': { warnAnim: 'flashSlow', moveDuration: 10000 },
    'medium': { warnAnim: 'flashMedium', moveDuration: 5000 },
    'fast': { warnAnim: 'flashFast', moveDuration: 2000, cautionSign: true }
};

var BugEnemy = new Phaser.Class({

    initialize: function BugEnemy(scene, opts) {
        this.scene = scene;
        opts = opts || {};
        opts.speed = opts.speed || 'slow';
        opts.warnAnim = opts.warnAnim || SPEEDS[opts.speed].warnAnim;
        opts.moveDuration = opts.moveDuration || SPEEDS[opts.speed].moveDuration;
        opts.cautionSign = opts.cautionSign !== undefined ? opts.cautionSign : SPEEDS[opts.speed].cautionSign;
        this.opts = opts;
        this.enemy = scene.add.sprite(opts.x, opts.y, opts.anim);
        this.enemy.setPosition(opts.x, opts.y);
        this.enemy.setOrigin(0,0);
        this.enemy.setScale(3);
        this.enemy.z = opts.z || 100;
        this.enemy.play(opts.anim || 'enemyLadybug');
        this.warning = scene.add.sprite(opts.x, opts.y, opts.warning);
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
        console.log('starting caution sign');
        let cautionSign = this.scene.add.sprite(this.opts.cautionSign);
        this.scene.tweens.add({
           targets: cautionSign,
           duration: 1000,
           onComplete: function() { 
                cautionSign.destroy(); 
                _this.startWarningFlashTween();
           }
        });
    },
    
    startWarningFlashTween: function() {
        let _this = this;
        console.log('starting warning flash');
        this.scene.tweens.add({
            targets: this.warning,
            duration: 250,
            onStart: function() { _this.warning.visible = true; },
            onComplete: function() { 
                _this.startMovingTween();
                _this.warning.destroy();
            }
        });
    },
    
    startMovingTween: function() {
        console.log('starting movement');
        let _this = this;
        this.scene.tweens.add({
            targets: this.enemy,
            y: 350,
            duration: this.opts.moveDuration,
            onComplete: function() { 
                _this.enemy.destroy(); 
            }
        });
    }
});


export {BugEnemy};