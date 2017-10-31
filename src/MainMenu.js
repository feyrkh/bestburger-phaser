/*global Phaser*/
import 'phaser';
import {Util} from './util/Util.js';

const BG_LAYER = -10;
const TEXT_LAYER = 0;
const TRANSITION_LAYER = 1;

const SFX_START = "assets/SOUND FX/ding03.mp3";

const STATE_START = "start";
const STATE_TRANSITION_IN = "transition_in";
const STATE_TUTORIAL = "tutorial";
const STATE_TUTORIAL_2 = "tutorial2";
const STATE_TRANSITION_OUT = "transition_out";
const STATE_PLAYING = "playing";

const TEXT_SCALE = 0.3;

// ### If this isn't null, auto-load the named minigame ###
// const STARTUP_MINIGAME = 'minigame01';

var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function MainMenu ()
    {
        Phaser.Scene.call(this, { 
            key: 'MainMenu'
        });
        this.preloadSounds();
    },

    preload: function ()
    {
        this.load.atlas('mainMenu','assets/BETA/BETA.png','assets/BETA/BETA.json');
        this.load.bitmapFont('atari', 'assets/fonts/atari-classic.png', 'assets/fonts/atari-classic.xml');
    },
    
    preloadSounds: function() {
        Util.loadSound('SFX_START',  SFX_START,false,1);
        Util.loadSound('main_bgm', 'assets/SOUND FX/MUSIC/SALSA_BGM_2.mp3',.5);
    },

    create: function ()
    { 
        Util.playSound('main_bgm');
        
        this.state = STATE_START;
        
        this.background = Util.spritePosition(this.add.image(0, 0, 'mainMenu', '00.png'), 0, 0, BG_LAYER);
        this.tutorial = Util.spritePosition(this.add.image(0, 0, 'mainMenu', '01.png'), 1000, 0, BG_LAYER+1);
        this.tutorial2 = Util.spritePosition(this.add.image(0, 0, 'mainMenu', '02.png'), 1000, 0, BG_LAYER+2);

        this.background.setScale(1);
        this.tutorial.setScale(1);
        this.tutorial2.setScale(1);

        var _this = this;
        this.input.events.on('KEY_DOWN_SPACE', function (event) {
            console.log("In state: "+_this.state);
            switch(_this.state) {
                case STATE_START: _this.startTutorial(); break;
                case STATE_TUTORIAL: _this.showTutorial2(); break;
                case STATE_TUTORIAL_2: _this.startGame(); break;
                default: break; // do nothing
            }
        });
    },
    
    startTutorial: function() {
        let _this = this;
        this.state = STATE_TRANSITION_IN;
        this.tweens.add({
            targets: this.tutorial,
            x: 0,
            duration: 1000,
            onComplete: function() {
                _this.state = STATE_TUTORIAL;
            }
        })
    },
    
    showTutorial2: function() {
        let _this = this;
        this.state = STATE_TRANSITION_IN;
        this.tweens.add({
            targets: _this.tutorial2,
            x: 0,
            duration: 1000,
            onComplete: function() {
                _this.state = STATE_TUTORIAL_2;
            }
        })
    },
    
    startGame: function() {
        let _this = this;
        this.state = STATE_TRANSITION_OUT;
        this.tweens.add({
            targets: [_this.background, _this.tutorial2, _this.tutorial],
            x: -1000,
            duration: 1000,
            onComplete: function() {
                Util.stopSound('main_bgm');
                _this.state = STATE_PLAYING;
                _this.input.events.off('KEY_DOWN_SPACE');
                _this.scene.swap("MainScene");
            }
        });
    }

});

export {MainMenu};
