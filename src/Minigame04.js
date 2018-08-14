/* global Phaser */
import 'phaser';
import {Util} from './util/Util.js';
import {InputBar} from './obj/InputBar.js';

const BG_LAYER = -10;
const CAR_LAYER = -1;
const WINDOW_LAYER = 3; 
const LENNY_LAYER = 5;

var Minigame04 = new Phaser.Class({
   Extends: Phaser.Scene,
    initialize: function Minigame03 ()
    {
        console.log("Minigame04()", this);
        Util.registerMinigame(this, 'minigame04');
    },
    preload: function ()
    {
        console.log("preload()", this);
        this.load.atlas('minigame04', 'assets/EVENT_06_BUFFET/EVENT_06_BUFFET.png', 'assets/EVENT_06_BUFFET/EVENT_06_BUFFET.json');
        this.load.atlas('hud', 'assets/HUD/HUD.png', 'assets/HUD/HUD.json');
        this.load.atlas('interface', 'assets/INTERFACE/INTERFACE.png', 'assets/INTERFACE/INTERFACE.json');
    },
       preloadSounds: function() {
        Util.loadSound('02_bgm', 'assets/SOUND FX/MUSIC/EVENT_02_DRIVETHRU_BGM.mp3',true,0.4);
     
    },
      create: function ()
    {
        this.bg = this.add.image(0, 0, 'minigame04','01.PNG');
         Util.spritePosition(this.bg,0,0,BG_LAYER);
          this.bg1 = this.add.image(0, 0, 'minigame04','01.PNG');
         
        var _this = this;
               // Setup input
        if(!this.inputInitialized) {
            this.regularKeyListener = function (event) {
                _this.handleKeyboardInput(event);
                Util.playSound('good');
            };
            this.specialKeyListener = function (event) {
                _this.handleKeyboardInput(event);
            };
            
            this.inputInitialized = true;
        }
        this.input.enabled = true;
        this.inputToggle = true;
        
        this.buttonBar = new InputBar(this, {
            buttonCount: 4,
            inputCallback: this.handleKeyboardInput,
            layer: 7
        });
    },
       
});

export {Minigame04};