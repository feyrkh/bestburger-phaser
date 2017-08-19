import 'phaser';

var MainScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA' });

        this.pic;
    },

    preload: function ()
    {
        this.load.image('arrow', 'assets/logo.png');
    },

    create: function ()
    {
        this.pic = this.add.image(400, 300, 'arrow').setOrigin(0, 0.5);
        this.resume();
    },

    pause: function() {

        var _this = this;

        this.input.events.once('MOUSE_DOWN_EVENT', function (event) {
            _this.scene.resume();
        });

        console.log("Doing stuff on pause");
    },


    resume: function() {
        console.log("Doing stuff on resume");

        var _this = this;
        this.input.events.once('MOUSE_DOWN_EVENT', function (event) {
            _this.scene.pause();
        });
    },

    update: function (time, delta)
    {
        this.pic.rotation += 0.001;
    }

});

export {MainScene};
