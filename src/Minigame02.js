/* global Phaser */
import 'phaser';
import {Util} from './util/Util.js';

var Minigame02 = new Phaser.Class({
        initialize:
    function Minigame02 ()
    {
        console.log("Minigame02()", this);
        this.util.registerMinigame(this, 'minigame02');
    },
    preload: function ()
    {
        console.log("preload()", this);
        this.load.atlas('minigame02', 'assets/EVENT_01_PHONE/EVENT_03_BUGBLOCKER.png', 'assets/EVENT_01_PHONE/EVENT_03_BUGBLOCKER.json');
        this.load.atlas('hud', 'assets/HUD/HUD.png', 'assets/HUD/HUD.json');
    },
    create: function ()
    {
        this.BG= this.add.image(0, 0, 'minigame02','"BG/00.png"');
        Util.spritePosition(this.restaurantBG,0,0,-100);
        
    }
});

export {Minigame02};