import 'phaser';

var PopUpScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:
    function PopUpScene ()
    {
        console.log("PopUpScene()", this);
        Phaser.Scene.call(this, {key:'minigame'});
    },

    preload: function ()
    {
        console.log("preload()", this);
        this.load.image('arrow', 'assets/logo.png');
    },

    create: function ()
    {
        console.log("create()", this);
        this.pic = this.add.image(400, 300, 'arrow').setOrigin(0, 0.5);
        this.timer = 1000;
        console.log("timer: "+this.timer);
    },

    start: function() {
        console.log("start()", this);
    },

    update: function (time, delta)
    {
        this.pic.rotation -= 0.005;
        this.timer -= delta;
        // console.log("timer="+this.timer+", delta="+delta);
        if(this.timer<=0) {
            this.scene.stop();
            this.scene.resume('MainScene');
        }
    }
});

export {PopUpScene};