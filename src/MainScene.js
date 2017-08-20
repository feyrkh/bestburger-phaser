import 'phaser';
import {ScrollingArrow} from './obj/ScrollingArrow.js';

var minigameNames = ["minigame", "minigame2"];

var MainScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainScene ()
    {
        Phaser.Scene.call(this, { key: 'MainScene' });
    },

    preload: function ()
    {
        this.load.image('arrow', 'assets/logo.png');
    },

    create: function ()
    {
        this.pic = this.add.image(400, 300, 'arrow').setOrigin(0, 5);
        this.time.addEvent({delay: 1000, callback: this.addNewItem, callbackScope: this, loop: true});
        this.arrows = this.add.group();
        this.resume();
    },
    
    addNewItem: function() {
        console.log("adding new scrolling arrow");
        this.children.add(new ScrollingArrow(this));
    },

    pause: function() {

        var _this = this;
        console.log("Doing stuff on pause", this);
    },


    resume: function() {
        console.log("Doing stuff on resume");

        var _this = this;
        this.input.events.once('MOUSE_DOWN_EVENT', function (event) {
            var minigameIdx = Math.floor(Math.random()*minigameNames.length);
            console.log("Launching "+minigameNames[minigameIdx]+" at idx "+minigameIdx);
            _this.scene.launch(minigameNames[minigameIdx]);
            _this.scene.pause();
        });
    },

    update: function (time, delta)
    {
        this.pic.rotation += 0.01;
    }

});

export {MainScene};
