/*global Phaser*/
import 'phaser';

var MinigameTimer = new Phaser.Class({
    Extends: Phaser.GameObjects.Group,
   
    initialize: function MinigameTimer(scene, opts) {
        let _this = this;
        opts = opts || {};
        opts.layer = opts.layer ||6;
        opts.time = opts.time || 30000;
        opts.callback = opts.callback.bind(opts.callbackContext || scene);
        Phaser.GameObjects.Group.call(this, scene, []);
        this.scene = scene;
        this.opts = opts;

        this.healthBar = scene.add.graphics({
            lineStyle: {width:5, color: 0x00ff00}
        });
        this.timeLeft = this.opts.time;
    },
   
    update: function(time, delta) {
        this.timeLeft -= delta;
        //Draw fun bar
        this.healthBar.clear();
        let timePercent = this.timeLeft/this.opts.time;
        if(timePercent > 0.8) {
            this.healthBar.lineStyle(5, 0x00ff00);
        } else if(timePercent > 0.5) {
            this.healthBar.lineStyle(5, 0xffff00);
        } else if(timePercent > 0.2) {
            this.healthBar.lineStyle(5, 0xff0000);
        } else if(timePercent > 0) {
            this.healthBar.lineStyle(5, 0x606060);
        } else {
            this.opts.callback();
        }
        this.healthBar.lineBetween(0,5, this.scene.cameras.main.width*(timePercent),5);
   }
});

export {MinigameTimer};