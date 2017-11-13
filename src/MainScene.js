/*global Phaser*/
import 'phaser';
import {Order} from './obj/Order.js';
import {Util} from './util/Util.js';

const START_LINE = 275;

const BG_LAYER = -10;
const OVERLAY_LAYER = 0;
const ORDER_LAYER = -2; // occupies 2 layers
const BUTTONS_LAYER = 2;
const FLYING_ITEM_LAYER = 10;
const SCORE_LAYER = 100;

const HITSTOP_BUMP_RATE = 5;
const BAD_INPUT_BUMP = 4;

var RED_BUTTON;
var BLUE_BUTTON;
var GREEN_BUTTON;
var YELLOW_BUTTON;
var WHITE_BUTTON;


const TIME_IN_SECONDS = 90;
const TEXT_SCALE =3;
const RANKING = 'ranking';
const SPEED_MODIFIER = 'speedModifier';
const SFX_GOOD1 = "assets/SOUND FX/ding03.mp3";
const SFX_GOOD2 = "assets/SOUND FX/BB_GOOD02.mp3";
const SFX_BAD1 = "assets/SOUND FX/BB_BAD01.mp3";

// ### If this isn't null, auto-load the named minigame ###
// const STARTUP_MINIGAME = 'minigame01';
const STARTUP_MINIGAME = false;

function gray(value) {
      return value+(value<<8)+(value<<16);
}

const GRAY_TINT = gray(0x60);

var MainScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function MainScene ()
    {
        Phaser.Scene.call(this, { 
            key: 'MainScene'
        });
        this.preloadSounds();
    },

    preload: function ()
    {
        this.load.image('orderCard', 'assets/orderCard.png');
        this.load.bitmapFont('atari', 'assets/fonts/atari-classic.png', 'assets/fonts/atari-classic.xml');
        this.load.atlas('main','assets/MAIN/MAIN.png','assets/MAIN/MAIN.json');
        this.load.atlas('hud','assets/HUD/HUD.png','assets/HUD/HUD.json');
        this.load.atlas('interface','assets/INTERFACE/INTERFACE.png','assets/INTERFACE/INTERFACE.json');
         this.load.atlas('_interface','assets/INTERFACE/INTERFACE.png','assets/INTERFACE/_INTERFACE.json');
        this.load.bitmapFont('digitsFont', 'assets/fonts/SMALL_DIGITS.png', 'assets/fonts/SMALL_DIGITS.xml');
        this.load.bitmapFont('comboFont', 'assets/fonts/font.png', 'assets/fonts/DIGITS.xml');
        
    },
    
    preloadSounds: function() {
    this.comboSoundTracker = 0;
    Util.loadSound('ding1b',  'assets/SOUND FX/phone minigame/new sounds/ding_good_1b.mp3',false,.3);
     Util.loadSound('countdown',  'assets/SOUND FX/COUNTDOWN.mp3',false,.5);
    Util.loadSound('whack',  'assets/SOUND FX/whack.mp3',false,2);
    Util.loadSound('ding0',  'assets/SOUND FX/ding00.mp3',false,1);
    Util.loadSound('ding1',  'assets/SOUND FX/ding01.mp3',false,1);
    Util.loadSound('ding2',  'assets/SOUND FX/ding02.mp3',false,1);
    Util.loadSound('ding3',  'assets/SOUND FX/ding03.mp3',false,1);
    Util.loadSound('ding4',  'assets/SOUND FX/ding04.mp3',false,1);
    Util.loadSound('ding5',  'assets/SOUND FX/ding05.mp3',false,1);
    Util.loadSound('ohman',  'assets/SOUND FX/VOICES/LENNY_OHMAN.mp3',false,4);
    Util.loadSound('maxRank',  'assets/SOUND FX/VOICES/LENNY_RANKMAX.mp3',false,3);
    Util.loadSound('lennyslow',  'assets/SOUND FX/VOICES/LENNY_WHOA01.mp3',false,4);
    Util.loadSound('timeup',  'assets/SOUND FX/VOICES/LENNY_TIMEUP01.mp3',false,4);
    Util.loadSound('lennyrankdown',  'assets/SOUND FX/VOICES/LENNY_RANKDOWN01.mp3',false,4);
    Util.loadSound('lennynice01',  'assets/SOUND FX/VOICES/LENNY_NICE01.mp3',false,5);
    
    Util.loadSound('slow',  'assets/SOUND FX/slow.mp3',false,1);
    Util.loadSound('speedUp',  'assets/SOUND FX/speedup.mp3',false,1);
   // Util.loadSound('main_bgm', 'assets/SOUND FX/MUSIC/SALSA_BGM.mp3',.5);
    Util.loadSound('main_bgm', 'assets/SOUND FX/MUSIC/SALSA_BGM_2.mp3',.1);
    Util.loadSound('rankup',  'assets/SOUND FX/RANK_UP_CHEER.mp3',false,1);
    
        Util.loadSound('good2', SFX_GOOD2);
        Util.adjustVolume('good2',1);
        Util.loadSound('bad1', SFX_BAD1);
    },

    buildFrames: function(keyPrefix, frameCount, extraHoldFrameIdx, extraHoldCount) {
        let frames = this.anims.generateFrameNames('main', { prefix: keyPrefix, suffix: ".png", end: frameCount, zeroPad: 2 });
        if(extraHoldFrameIdx !== undefined) {
            // Extra hold for frame
            extraHoldCount = extraHoldCount || 1;
            for(var i=0;i<extraHoldCount;i++) {
                frames.splice(extraHoldFrameIdx, 0, frames[extraHoldFrameIdx]);
            }
        }
        return frames;
    },
    
    create: function ()
    { Util.playSound('main_bgm');
        // set up the timers for the main game.
        this.specialTimer = 20000; 
        this.gameTimer = 0;
        this.gameTimeLeft = TIME_IN_SECONDS;
        this.gameTime = '1:30';
        this.zoomAMT = 1;
        this.backgroundCounter = 3;
      
        this.inputToggle = true;
        this.registry.set('orderSpeed', 1,4);
         this.registry.set(RANKING, 1);
         this.registry.set(SPEED_MODIFIER, 1);
        // Create item animations
        this.anims.create({ key: 'burger', frames: this.buildFrames('MAIN_ICONS/BURGER', 4, 1), frameRate: 12, yoyo: true, repeat: 0 });
        this.anims.create({ key: 'fries', frames: this.buildFrames('MAIN_ICONS/FRIES', 4, 1), frameRate: 12, yoyo: true, repeat: 0 });
        this.anims.create({ key: 'soda', frames: this.buildFrames('MAIN_ICONS/DRINK_', 4, 1), frameRate: 12, yoyo: true, repeat: 0 });
        this.anims.create({ key: 'salad', frames: this.buildFrames('MAIN_ICONS/SALAD', 4, 1), frameRate: 12, yoyo: true, repeat: 0 });
         this.anims.create({ key: 'slowMo', frames: this.buildFrames('MAIN_ICONS/SLOW', 1, 1), frameRate: 12, yoyo: true, repeat: 0 });
        this.anims.create({ key: 'itemCleared', frames: this.buildFrames('MAIN_ICON_CLEAR/', 8), frameRate: 15});
        
        this.anims.create({key:'points',frames:this.anims.generateFrameNames('hud', { prefix: 'POINTS_', suffix: ".png", end: 5, zeroPad: 2 }), frameRate:12, yoyo:true});
        this.timerAnim = this.anims.create({key:'timer',frames:this.anims.generateFrameNames('hud', { prefix: 'TIMER_', suffix: ".png", end: 5, zeroPad: 2 }), frameRate:10, yoyo:true, repeat: -1});
        
        //Special item animations
        this.anims.create({ key: 'slowMoEnter', frames: this.anims.generateFrameNames('main', { prefix: 'BORDER SLOW MOTION/', suffix: ".png", start: 0, end: 3, zeroPad: 2 }), frameRate: 18});
        this.anims.create({ key: 'slowMoLoop', frames: this.anims.generateFrameNames('main', { prefix: 'BORDER SLOW MOTION/', suffix: ".png", start: 4, end: 18, zeroPad: 2 }), frameRate: 12, yoyo: true, repeat: -1 });
         this.anims.create({ key: 'slowMoExit', frames: this.anims.generateFrameNames('main', { prefix: 'BORDER SLOW MOTION/', suffix: ".png", start: 19, end: 21, zeroPad: 2 }), frameRate: 18});
         
         //Rank animations
        this.anims.create({key:'rankUp',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_TEXT/', suffix: ".png", end: 14, zeroPad: 2 }), frameRate:15 });
        this.anims.create({key:'rankDown',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_DOWN_TEXT/', suffix: ".png", end: 14, zeroPad: 2 }), frameRate:15 });
         this.anims.create({key:'rainbowTransition',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_EFFECTS/RANK_UP_RAINBOW/', suffix: ".png", end: 2, zeroPad: 2 }), frameRate:8, yoyo: true, repeat: -1 });
         
         this.anims.create({key:'rank1Down',frames:this.anims.generateFrameNames('_interface', { prefix: 'RANK_UP_EFFECTS/RANK_1/', suffix: ".png", start: 11, end: 13, zeroPad: 2 }), frameRate:15 });
        this.anims.create({key:'rank2Intro',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_EFFECTS/RANK_2/', suffix: ".png", start: 0, end: 2, zeroPad: 2 }), frameRate:15 });
        this.anims.create({key:'rank2Loop',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_EFFECTS/RANK_2/', suffix: ".png", start: 3, end: 10, zeroPad: 2 }), frameRate:15, repeat: -1 });
        this.anims.create({key:'rank2Down',frames:this.anims.generateFrameNames('_interface', { prefix: 'RANK_UP_EFFECTS/RANK_2/', suffix: ".png", start: 11, end: 13, zeroPad: 2 }), frameRate:15 });
        this.anims.create({key:'rank3Intro',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_EFFECTS/RANK_3/', suffix: ".png", start: 0, end: 2, zeroPad: 2 }), frameRate:15 });
        this.anims.create({key:'rank3Loop',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_EFFECTS/RANK_3/', suffix: ".png", start: 3, end: 10, zeroPad: 2 }), frameRate:15, repeat: -1 });
        this.anims.create({key:'rank3Down',frames:this.anims.generateFrameNames('_interface', { prefix: 'RANK_UP_EFFECTS/RANK_3/', suffix: ".png", start: 11, end: 13, zeroPad: 2 }), frameRate:15 });
        this.anims.create({key:'rank4Intro',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_EFFECTS/RANK_4/', suffix: ".png", start: 0, end: 2, zeroPad: 2 }), frameRate:15 });
        this.anims.create({key:'rank4Loop',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_EFFECTS/RANK_4/', suffix: ".png", start: 3, end: 10, zeroPad: 2 }), frameRate:15,repeat: -1 });
        this.anims.create({key:'rank4Down',frames:this.anims.generateFrameNames('_interface', { prefix: 'RANK_UP_EFFECTS/RANK_4/', suffix: ".png", start: 11, end: 13, zeroPad: 2 }), frameRate:15 });
        this.anims.create({key:'rank5Intro',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_EFFECTS/RANK_5/', suffix: ".png", start: 0, end: 2, zeroPad: 2 }), frameRate:15 });
        this.anims.create({key:'rank5Loop',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_EFFECTS/RANK_5/', suffix: ".png", start: 3, end: 10, zeroPad: 2 }), frameRate:15,repeat: -1 });
        this.anims.create({key:'rank5Down',frames:this.anims.generateFrameNames('_interface', { prefix: 'RANK_UP_EFFECTS/RANK_5/', suffix: ".png", start: 11, end: 13, zeroPad: 2 }), frameRate:15 });
        this.anims.create({key:'rank6Intro',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_EFFECTS/RANK_6/', suffix: ".png", start: 0, end: 2, zeroPad: 2 }), frameRate:15 });
        this.anims.create({key:'rank6Loop',frames:this.anims.generateFrameNames('interface', { prefix: 'RANK_UP_EFFECTS/RANK_6/', suffix: ".png", start: 3, end: 10, zeroPad: 2 }), frameRate:15, repeat: -1 });
        let failureLineAnim = this.anims.create({ key: 'failureLine', frames: this.buildFrames('MAIN_WINDOW/WINDOW_FAILURE_LINE', 3), frameRate: 8, yoyo: true, repeat: -1});
        
        
        // Set up static images
       this.restaurantBG= this.add.image(0, 0, 'main','MAIN_WINDOW/RESTAURANT_BG.png');
        Util.spritePosition(this.restaurantBG,0,0,ORDER_LAYER-1);
        this.mainWindow= this.add.image(0, 0, 'main','MAIN_WINDOW/WINDOW_FRAME00.png');
        Util.spritePosition(this.mainWindow,0,0,OVERLAY_LAYER);
         this.windowTint = this.add.sprite(0, 0, 'main', 'MAIN_WINDOW/WINDOW_BACKGROUND00.png');
        Util.spritePosition(this.windowTint, 0, 0, ORDER_LAYER-1);
        this.orderPointer = this.add.sprite(0,0, 'main', 'MAIN_ICONS/POINTER.png');
         Util.spritePosition(this.orderPointer, 80, 0, BUTTONS_LAYER-1);
         
        this.pointsBar= this.add.sprite(0, 0, 'hud','POINTS_00.png');
        Util.spritePosition(this.pointsBar,0,0,OVERLAY_LAYER);
        this.timerBar= this.add.sprite(0, 0, 'hud','TIMER_00.png');
        Util.spritePosition(this.timerBar,0,0,OVERLAY_LAYER);
      
        let failureLine = this.add.sprite(0, 0, 'failureLine')
        .setOrigin(0,0)
        .setScale(3);
        failureLine.z = OVERLAY_LAYER;
        failureLine.play('failureLine');
        
        //Background Setup. creates 4 background images, 2 invisible and 2 not. fades between them for a crossfade effect
        this.bg1= this.add.image(0, 0, 'main','MAIN_BACKGROUND/BACKGROUND_03.png');
        Util.spritePosition(this.bg1,0,0,BG_LAYER);
        this.bg2= this.add.image(0, 0, 'main','MAIN_BACKGROUND/BACKGROUND_03.png');
        Util.spritePosition(this.bg2,-this.bg1.displayWidth,0,BG_LAYER);
        this.bg2.x = -this.bg1.displayWidth;
         this.newbg1= this.add.image(0, 0, 'main','MAIN_BACKGROUND/BACKGROUND_03.png');
        Util.spritePosition(this.newbg1,0,0,BG_LAYER);
         this.newbg2= this.add.image(0, 0, 'main','MAIN_BACKGROUND/BACKGROUND_03.png');
        Util.spritePosition(this.newbg2,-this.bg1.displayWidth,0,BG_LAYER);
        
        this.timedEvent = this.time.addEvent({ delay: 10000, callback: this.backgroundCrossfade, callbackScope: this, repeat: -1, startAt: 5000 });
        
   // Button bar
        this.add.sprite(0, 0, 'main','MAIN_BUTTONS/BUTTONS_BAR.png')
        .setOrigin(0,0)
        .setScale(3)
        .OVERLAY_LAYER ;
        RED_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/RED.png').setInteractive();
        RED_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'a'}});
        };
        Util.spritePosition(RED_BUTTON,114,343,BUTTONS_LAYER);
        YELLOW_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/YELLOW.png').setInteractive();
        YELLOW_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'s'}});
        };
        Util.spritePosition(YELLOW_BUTTON,171,343,BUTTONS_LAYER);
        BLUE_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/BLUE.png').setInteractive();
        BLUE_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'f'}});
        };
        Util.spritePosition(BLUE_BUTTON,345,343,BUTTONS_LAYER);
        GREEN_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/GREEN.png').setInteractive();
        GREEN_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'d'}});
        };
        Util.spritePosition(GREEN_BUTTON,288,343,BUTTONS_LAYER);
        WHITE_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/SPECIAL.png').setInteractive();
        WHITE_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':' '}});
        };
        Util.spritePosition(WHITE_BUTTON,228,343,BUTTONS_LAYER);
        
        //setup combo counter
        this.comboCounter =this.add.sprite(0, 0, 'main','MAIN_COMBO/COUNTER/07.png');
        Util.spritePosition(this.comboCounter,0,0,SCORE_LAYER);
        this.comboCounter.alpha = 0;
        this.anims.create({ key: 'comboCounterEnter', frames: this.anims.generateFrameNames('main', { prefix: 'MAIN_COMBO/COUNTER/', suffix: ".png", start: 0, end: 9, zeroPad: 2 }), frameRate: 18});
        this.anims.create({ key: 'comboRankUp', frames: this.anims.generateFrameNames('main', { prefix: 'MAIN_COMBO/COUNTER/', suffix: ".png", start: 10, end: 16, zeroPad: 2 }), frameRate: 12});
        this.anims.create({ key: 'comboCounterLeave', frames: this.anims.generateFrameNames('main', { prefix: 'MAIN_COMBO/COUNTER/', suffix: ".png", start: 17, end: 21 , zeroPad: 2 }), frameRate: 15});
         
        // Set up the 'new order' event
        this.orders = this.add.group();
        this.addNewOrder();
       
        // Set up scoreboard integration
        let baseX = 5;
        let baseY = 10;
        //this.add.bitmapText(baseX, baseY, 'atari', 'Foods:').setScale(TEXT_SCALE).setTint(0xa00000);
        this.addScoreboard(418, 342, 'itemScore', '',0,'digitsFont');
        this.addScoreboard(395, 63, 'itemCombo', '',0,'comboFont',3);
       // this.addHighScoreboard(baseX, baseY+75, 'itemCombo', 'highItemCombo', 'Hi:');
        
     //   baseY = 200;
      //  this.add.bitmapText(baseX, baseY, 'atari', 'Orders:').setScale(TEXT_SCALE).setTint(0x0000a0);
      //  this.addScoreboard(baseX, baseY+15, 'orderScore', 'Scr:');
      //  this.addScoreboard(baseX, baseY+60, 'orderCombo', 'Cmbo:');
      //  this.addHighScoreboard(baseX, baseY+75, 'orderCombo', 'highOrderCombo', 'Hi:');
        
        baseX = 420;
        baseY = 10;
        this.timer =this.add.bitmapText(10, 342, 'digitsFont',''+this.gameTime).setScale(TEXT_SCALE); 
       // this.add.bitmapText(baseX, baseY, 'atari', 'Level').setScale(TEXT_SCALE).setTint(0xff0000);
        this.addScoreboard(baseX, baseY+15, 'orderSpeed', 'Spd:', 1,'atari',.2);
      //  this.addHighScoreboard(baseX, baseY+30, 'orderSpeed', 'highOrderSpeed', 'Hi:', 1);
      //  this.addScoreboard(baseX, baseY+60, 'menuComplexity', 'Menu:', 1);
//this.addHighScoreboard(baseX, baseY+75, 'menuComplexity', 'highMenuComplexity', 'Hi:', 1);
        
       // baseX = 410;
     //   baseY = 330;
       // this.add.bitmapText(baseX, baseY, 'atari', 'Minigame').setScale(TEXT_SCALE).setTint(0xff0000);
       // this.addScoreboard(baseX, baseY+15, 'minigameScore', 'Scr:', 0).setTint(0xffffff);
      //  this.addScoreboard(baseX, baseY+27, 'minigameScoreTotal', 'Tot:', 0).setTint(0xffffff);

        // Handle keyboard input; TODO: figure out how to hook into all KEY_DOWN events...looks like a patch may be needed
        var _this = this;
      if(this.inputToggle){
            this.input.events.on('KEY_DOWN_A', function (event) {
                _this.handleKeyboardInput(event);
               RED_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS.png');
            });
            this.input.events.on('KEY_DOWN_S', function (event) {
                _this.handleKeyboardInput(event);
               YELLOW_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS.png');
            });
            this.input.events.on('KEY_DOWN_D', function (event) {
                _this.handleKeyboardInput(event);
               GREEN_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS.png');
            });
            this.input.events.on('KEY_DOWN_F', function (event) {
                _this.handleKeyboardInput(event);
                 BLUE_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS.png');
            });
            this.input.events.on('KEY_DOWN_SPACE', function (event) {
                _this.handleKeyboardInput(event);
                  WHITE_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS.png');
            });
        }
        this.input.events.on('KEY_UP_A', function (event) {
           RED_BUTTON.setTexture('main','MAIN_BUTTONS/RED.png');
        });
        this.input.events.on('KEY_UP_S', function (event) {
           YELLOW_BUTTON.setTexture('main','MAIN_BUTTONS/YELLOW.png');
        });
        this.input.events.on('KEY_UP_D', function (event) {
           GREEN_BUTTON.setTexture('main','MAIN_BUTTONS/GREEN.png');
        });
        this.input.events.on('KEY_UP_F', function (event) {
             BLUE_BUTTON.setTexture('main','MAIN_BUTTONS/BLUE.png');
        });
         this.input.events.on('KEY_UP_SPACE', function (event) {
             WHITE_BUTTON.setTexture('main','MAIN_BUTTONS/SPECIAL.png');
        });

        // var _this = this;
        // this.input.events.once('MOUSE_DOWN_EVENT', function (event) {
        //     var minigameIdx = Math.floor(Math.random()*minigameNames.length);
        //     console.log("Launching "+minigameNames[minigameIdx]+" at idx "+minigameIdx);
        //     _this.scene.launch(minigameNames[minigameIdx]);
        //     _this.scene.pause();
        // });
        
        // Handle animation of orders
        this.time.addEvent({delay: 1800, callback: this.animateOrders, callbackScope: this, loop: true});
    
        // For debugging purposes, immediately launch a minigame    
        if(STARTUP_MINIGAME) {
                this.inputToggle = false;
                this.scene.launch(STARTUP_MINIGAME);
                this.scene.pause();
        }
    },
    
    animateOrders: function() {
        console.log("Animating orders");
      this.orders.children.each(function(order) {  order.animateBounceWave(0.25);
      });  
    },

    addScoreboard: function(x, y, registryName, label, startingVal, font, scale) {
        let tint = 0xffffff;
        
        if(font == 'atari') tint = 0x202020;
        startingVal = startingVal || 0;
        let board = this.add.bitmapText(x, y, font, label+startingVal);
        let _this = this;
        if(scale)board.setScale(scale);
        else board.setScale(TEXT_SCALE);
        board.z = SCORE_LAYER;
        this.registry.set(registryName, startingVal);
        this.registry.after(registryName, function(game, key, value) {
            board.setText(label+value);
            _this.registry.set(registryName+"_HI", value);
/*           if(value != 0) {
                _this.tweens.add({
                    targets: board,
                    scaleX: "+=0.05",
                    scaleY: "+=0.05",
                    duration: 100, 
                    repeat: 1, 
                    yoyo: true, 
                    ease: 'Bounce.easeOut',
                    onComplete: function() {
                        board.setScale(TEXT_SCALE);
                    }
                })
            }*/
        });
        board.setTint(tint);
        return board;
    },
    
    addHighScoreboard: function(x, y, scoreName, highScoreName, label, startingVal) {
        let board = this.addScoreboard(x, y, highScoreName, label, startingVal);
        let _this = this;
        this.registry.after(scoreName+"_HI", function(game, key, value) {
            if(value > _this.registry.get(highScoreName))
                _this.registry.set(highScoreName, value);
        });
        return board;
    },
    
    addNewOrder: function(addSpecial) {
        // console.log("adding new scrolling arrow");
         var newOrder;
         if(addSpecial == undefined) addSpecial = false;
         //searches the screen to see if a special item is currently on the screen
         for(var i=0; this.orders.children.entries[i]; i++)
         {
             var curOrder = this.orders.children.entries[i];
             for(var e=0; curOrder.items.children.entries[e]; e++){
                 if(curOrder.items.children.entries[e].name == 'slowMo'){
                 addSpecial = false;
                 console.log("FOUND AN EXISTING SPECIAL");
                 }
             }
         }
        if(addSpecial)
         newOrder = new Order(this, {z: ORDER_LAYER}, true);
       else 
         newOrder = new Order(this, {z: ORDER_LAYER});
        this.children.add(newOrder); // Add this to the scene so it gets rendered/updated
        this.orders.add(newOrder); // Add this to the 'orders' group so we can reference it later
    },
    
    removeOrder: function(order) {
        this.orders.remove(order);
    },
    
    handleKeyboardInput: function(event) {
        if(this.inputToggle){
        if(event.data.repeat) return;
        switch(event.data.key) {
            case "A": 
            case "a": if(this.orders.children.entries[0].getFirstItem().name == 'slowMo')
                        this.handleMainGameInput('slowMo');
                      else
                      this.handleMainGameInput('burger');break;
            case "S":
            case "s": this.handleMainGameInput('fries'); break;
            case "D":
            case "d": this.handleMainGameInput('salad'); break;
            case "F":
            case "f": this.handleMainGameInput('soda'); break;
            case " ": this.calorieBomb();
           /*     let minigameNames = Util.getMinigameNames();
                var minigameIdx = Math.floor(Math.random()*minigameNames.length);
                console.log("Launching "+minigameNames[minigameIdx]+" at idx "+minigameIdx);
                this.inputToggle = false;
                this.scene.launch(minigameNames[minigameIdx]);
               this.scene.pause(); */
                break;
          }
            
        }
    },
    
    orderFailed: function() {
         Util.playSound('ohman'); 
         this.registry.set('orderCombo', 0);
         this.ranking('rankDown');
         this.orders.children.each(function(order) { order.disableOrder(); });
    },
    
    handleMainGameInput: function(ingredientType) {
        // console.log("Pressed button for "+ingredientType, this.input);
        var firstOrder;
        var firstItem;
        var _this = this;
        // Find the first non-empty order. The very first one can be empty if they're still fading out.
        for(var i=0;i<this.orders.children.entries.length;i++) {
            firstOrder = this.orders.children.entries[i];
            firstItem = firstOrder.getFirstItem();
            if(firstItem) break;
        }
        if(firstItem == null) return;
        // console.log("First item in list: "+firstItem.name, firstItem);
        if(firstItem.name === ingredientType) {
            // They touched the right thing, let's destroy it
        if(firstItem.name == 'slowMo')
            this.slowMoEnter(10000);
            var orderCompleted = firstOrder.removeItem(firstItem);
            // bring in the combo counter. if its already in play the rank up animation.
      //  if(this.registry.get('itemCombo') ==10)
      //      this.updateComboCounter('opening');
        if(this.registry.get('itemCombo') >9 && this.registry.get('itemCombo')  % 15 == 0){
             if(this.registry.get('ranking') < 6)
            this.updateComboCounter('rankUp');
            this.ranking('rankUp');
            Util.playSound('rankup'); 
            Util.playSound('lennynice01'); 

        }
        if(this.specialActive) this.cameraBounce(.03,100);
        
            this.windowShake();
            Util.playSound('whack');
         if(orderCompleted){ Util.playSound('ding1b');
         if(this.orders.children.entries.length == 0)
         this.activeSpecialTimer = 0;
         }
         
        firstItem.z = FLYING_ITEM_LAYER;
            //bounces the remaining top order up and stops the screen briefly
        firstOrder.items.children.each(function(child) {child.y-=HITSTOP_BUMP_RATE });
            this.time.addEvent({ delay:100, callback: function(){ firstOrder.items.children.each(function(child) {child.y+=HITSTOP_BUMP_RATE });}, callbackScope: this});
            //hitstop bounce
        if(firstOrder.y < 150 && this.registry.get('orderSpeed') > .0)
            this.hitstop();
                 
        } else {
            // They touched the wrong thing
            if(this.registry.get('ranking') > 1)
            this.ranking('rankDown');
             for(var e=0;e<this.orders.children.entries.length;e++){
                 this.orders.children.entries[e].y -=BAD_INPUT_BUMP;
                 this.orders.children.entries[e].items.children.each(function(child) {child.y-=BAD_INPUT_BUMP });
             }
           //  if(this.registry.get('itemCombo') >=10)
            // this.updateComboCounter('close');
            var penaltyTime = 250;
            firstOrder.badInput(penaltyTime,this.specialActive);
            this.inputToggle = false;
            this.comboSoundTracker = 0;
            this.time.addEvent({delay: penaltyTime, callback: function() {_this.inputToggle = true;}, callbackScope: this
            });
            Util.playSound('bad1');
            // console.log("OUCH!!!! Wrong ingredient");
        }
        if(this.orders.getLength() == 0) {
            // The last order was filled! Quick, pull in another!
            console.log("Emergency order!")
            this.addNewOrder();
        }
    },
       ranking: function(rankStatus,rank) {
      let newRank = this.registry.get('ranking');
    if(rankStatus == 'rankDown' && newRank == 1)
    return;
      if(rankStatus == 'rankDown' && newRank > 1){ newRank --;
            var tempRankup= this.add.sprite(0,0,'main','MAIN_BUTTONS/RED.png');
            Util.spritePosition(tempRankup,0,0,BUTTONS_LAYER+1);
            tempRankup.play('rankDown');
            Util.playSound('lennyrankdown');
            this.time.addEvent({ delay:1818, callback: function(){tempRankup.destroy();}, callbackScope: this});
      }
      else if(rankStatus == 'rankUp'&& newRank < 6){
            newRank ++;
            if(newRank +1 == 7)
            Util.playSound('maxRank'); 
      }
        console.log('RANK CHANGING '+newRank);
      
       this.registry.set('ranking',newRank);
       
     this.changeRankAnimation(this.bgEffects, rankStatus);
      switch(newRank){
         case 1: 
           
   
                   this.registry.set('orderSpeed', 1.3);
                   this.registry.set('menuComplexity', 2);
                   // How many minimum seconds to add to the special timer
                   this.registry.set('specialFrequency',12);
                  break;
         case 2: 
                   this.registry.set('orderSpeed', 1.5);
                   this.registry.set('menuComplexity', 2);
                   this.registry.set('specialFrequency',28);
                  break;
         case 3: 
      
                   this.registry.set('orderSpeed', 1.8);
                   this.registry.set('menuComplexity', 3);
                   this.registry.set('specialFrequency',25);
                  break;
         case 4: 
       
                   this.registry.set('orderSpeed',2.2);
                   this.registry.set('menuComplexity', 3);
                   this.registry.set('specialFrequency',22);
                  break;                  
         case 5:
                   this.registry.set('orderSpeed',2.6);
                   this.registry.set('menuComplexity', 4);
                   this.registry.set('specialFrequency',18);
                  break;     
        case 6:
                   this.registry.set('orderSpeed',3.2);
                   this.registry.set('menuComplexity', 4);
                   this.registry.set('specialFrequency',16);
                  break;         
      }

   },

      changeRankAnimation: function(sprite,rankstatus){
          if(this.bgEffects == undefined){
            this.bgEffects= this.add.sprite(0, 0, 'main','MAIN_BUTTONS/BLUE.png');
            Util.spritePosition(this.bgEffects,0,0,OVERLAY_LAYER-1);
          }
                  
         var _this = this;
         if(rankstatus == 'rankUp'){
           this.rainbow= this.add.sprite(0, 0, 'main','MAIN_BUTTONS/BLUE.png');
           Util.spritePosition(this.rainbow,0,0,OVERLAY_LAYER -1);
           this.rainbow.play('rainbowTransition');
          this.bgEffects.play('rank'+this.registry.get('ranking')+'Intro');
        }
         else if(rankstatus == 'rankDown')
             this.bgEffects.play('rank'+this.registry.get('ranking')+'Down');
          
         this.time.addEvent({delay: 200, callback: function(){_this.bgEffects.play('rank'+this.registry.get('ranking')+'Loop'); if(_this.rainbow)_this.rainbow.destroy();}, callbackScope: this});
   },
   
    ignoreInput: function(doIgnore) {
        this.inputToggle = !doIgnore;
        if(doIgnore != this.ignoring) {
            this.ignoring = doIgnore;
        }
    },
    
    _ignoreInput: function(event) {
        event._propagate = false;
        // console.log("Ignoring event: ", event);
    },

    pause: function() {
        var _this = this;
        console.log("Doing stuff on pause", this);
        this.ignoreInput(true);
        Util.pauseSound('main_bgm');
          _this.gameTimeLeft = TIME_IN_SECONDS;
         
    },

    resume: function() {
        console.log("Doing stuff on resume");
        this.ignoreInput(false);
        Util.playSound('main_bgm');
         let songVolume = 0;
         this.time.addEvent({ delay: 100, callback:function(){ 
             songVolume += .05;
             Util.adjustVolume('main_bgm', songVolume); }, callbackScope: this, repeat:19, startAt: 100 });
    },
      // controls the the state of the combo counter
     updateComboCounter: function(comboState){
      
        switch(comboState){
           
            case 'opening': this.comboCounter.play('comboCounterEnter');
                            this.comboCounter.alpha = 1;
                            break;
            case 'rankUp':  this.comboCounter.play('comboRankUp');
                            var tempRankup= this.add.sprite(0,0,'main','MAIN_BUTTONS/RED.png');
                             Util.spritePosition(tempRankup,0,0,BUTTONS_LAYER+1);
                            tempRankup.play('rankUp');
                             this.time.addEvent({ delay:1818, callback: function(){tempRankup.destroy();}, callbackScope: this});
                             this.cameraBounce(.05,100,0.4,100);
                            // this.changeRankAnimation();
                            break;
            
            case 'close':   this.comboCounter.play('comboCounterLeave');
                              var _comboCounter = this.comboCounter;
                              var leaveTween = this.tweens.add({
                             targets: [this.comboCounter],
                             alpha: { value: 1, duration: 300 },
                              onComplete: function(tween) {
                                  _comboCounter.alpha = 0;
                                 }}); break;
        }
       
    },
    cameraBounce:function(bounceRate, delay, slowRate,slowTime){
        this.cameras.main.setZoom(this.zoomAMT+=bounceRate);
        this.time.addEvent({ delay: delay, callback:function(){this.cameras.main.setZoom(this.zoomAMT -= bounceRate); }, callbackScope: this, startAt: 1 });
        
        if(slowRate){
            this.registry.set('speedModifier', this.registry.get('speedModifier')-slowRate);
             this.time.addEvent({ delay: slowTime, callback:function(){this.registry.set('speedModifier',this.registry.get('speedModifier')+slowRate); }, callbackScope: this, startAt: 1 });
        }
    },
    
    hitstop:function(){
        this.currentSpeed = (this.registry.get('orderSpeed'));
        this.registry.set('orderSpeed',0);

        this.time.addEvent({ delay:110, callback: function(){this.registry.set('orderSpeed',this.currentSpeed);}, callbackScope: this});
        
    },
    //wiggles the main window
    windowShake: function(){
        var newX =3;
        var newY = 1;
        
        if( Math.random() *100 < 40) newY = 0; else newY =-newY;

         if( Math.random() *100 < 50)
        newX = -newX;
        
        this.mainWindow.setPosition(newX ,newY);
         this.windowTint.x = this.mainWindow.x *1.05;
        if(this.sloMoWall != undefined)
        this.sloMoWall.x = this.mainWindow.x;
        
        this.time.addEvent({ delay:50, callback: function(){
        this.mainWindow.setPosition(0,0);
         this.windowTint.x = this.mainWindow.x;
          if(this.sloMoWall != undefined)
          this.sloMoWall.x = this.mainWindow.x;
          
        }, callbackScope: this});
    
    },
    // halves the speed of the orders on screen
     slowMoEnter:function(slowDownTime){
        this.maxZoom =  1.07;
        let bounceRate =  .03;
        let slowdownRate = .5;
        this.specialActive = true;
        this.activeSpecialTimer = slowDownTime;
        
      
         this.activeSpecialTimer -= 1000;
         this.sloMoWall= this.add.sprite(0,0,'main','MAIN_BUTTONS/RED.png');
         Util.spritePosition(this.sloMoWall,0,0,BUTTONS_LAYER+1);
         
         Util.getSound('main_bgm').rate(slowdownRate);
          Util.playSound('slow');
          Util.playSound('lennyslow');
         this.sloMoWall.play('slowMoEnter');
        
         this.time.addEvent({ delay:222, callback: function(){this.sloMoWall.play('slowMoLoop');}, callbackScope: this});
         
        this.zoomAMT = this.maxZoom; 
        this.cameras.main.setZoom(this.zoomAMT);
     
        this.comboCounter.setTint(GRAY_TINT)
     
        // saves the original speed and slows down the movement speed and song rate.
        this.registry.set('speedModifier',slowdownRate);
        
        //bounces the camera for the intro 
         this.time.addEvent({ delay: 100, callback:function(){  
         if(this.zoomAMT !=this.maxZoom) this.cameras.main.setZoom(this.zoomAMT+=bounceRate);
        else this.cameras.main.setZoom(this.zoomAMT -= bounceRate); }, callbackScope: this, repeat:1, startAt: 1 });
          
      
    },
    
      slowMoExit:function(){
          let _this = this;
          
          Util.playSound('speedUp');
          _this.time.addEvent({ delay:1000, callback: function(){_this.registry.set('speedModifier',1);
          Util.getSound('main_bgm').rate(1);
          //plays the exit animation and deletes it once it finishes
          _this.sloMoWall.play('slowMoExit');
          _this.time.addEvent({ delay:222, callback: function(){this.sloMoWall.destroy(); this.sloMoWall = null;}, callbackScope: _this});
          // gradually zooms back out.
          let oldZoom = _this.zoomAMT;
          _this.time.addEvent({ delay: 5, callback:function(){  _this.cameras.main.setZoom(_this.zoomAMT -= ((oldZoom-1)/5)) }, callbackScope: _this, repeat: 4, startAt: 5 });
          _this.comboCounter.setTint(0xffffff);  }}); 

      },
      calorieBomb:function(){
                   for(var e=0;e<50;e++){
                        if( this.orders.children.entries[0] != undefined)
                        this.orders.children.entries[0].removeItem(this.orders.children.entries[0].items.children.entries[0]);
                        else 
                        break;
                       }
        
      },
      
    backgroundCrossfade: function()
    { 
        this.bg1.setTexture('main','MAIN_BACKGROUND/BACKGROUND_0'+this.backgroundCounter+'.png');
        this.bg2.setTexture('main','MAIN_BACKGROUND/BACKGROUND_0'+this.backgroundCounter+'.png');
        this.bg1.alpha = 1;
        this.bg2.alpha = 1;
    
         this.backgroundCounter -= 1;
         if(this.backgroundCounter == 0)
         this.backgroundCounter = 3;
         
         this.newbg1.setTexture('main','MAIN_BACKGROUND/BACKGROUND_0'+this.backgroundCounter+'.png');
        this.newbg2.setTexture('main','MAIN_BACKGROUND/BACKGROUND_0'+this.backgroundCounter+'.png');
        this.newbg1.alpha = 0;
         this.newbg2.alpha = 0;
    
             var fadeoutTween = this.tweens.add({
            targets: [this.bg1,this.bg2],
            alpha: { value: 0, duration: 9800 },
            onComplete: function(tween) {
            } 
         });
              var fadeinTween = this.tweens.add({
            targets: [this.newbg1,this.newbg2],
            alpha: { value: 1, duration: 9800 },
            onComplete: function(tween) {
                } 
         });
    },
    
    minigameTransition: function(){
        let _this = this;
        
     //   this.transitionScreen =this.add.sprite(0, 0, 'interface','BURGER_FADE_TRANSITION.png');
        let songVolume = 1;
     //   Util.spritePosition(_this.transitionScreen,-1100,0,15);
        
         _this.time.addEvent({ delay: 100, callback:function(){ 
             songVolume -= .05;
             Util.adjustVolume('main_bgm', songVolume); }, callbackScope: _this, repeat:19, startAt: 100 });
        
     /*   _this.tweens.add({
            targets: [this.transitionScreen],
            x: { value: -120, duration: 4000 },
            onComplete: function() {                
                let minigameNames = Util.getMinigameNames();
                var minigameIdx = Math.floor(Math.random()*minigameNames.length);
                console.log("Launching "+minigameNames[minigameIdx]+" at idx "+minigameIdx);
                _this.inputToggle = false;
                _this.scene.launch(minigameNames[minigameIdx]);
               _this.scene.pause(); 
                } 
         }); */
    },
    
    update: function (time, delta)
    {
        if(this.gameTimer < 1000 && this.gameTimeLeft > 0) this.gameTimer+= delta * this.registry.get('speedModifier');
        else{
            
            let minutes = Math.floor(this.gameTimeLeft / 60);
            let seconds =  Math.floor(this.gameTimeLeft % 60);
            //formats the text.
            if(seconds < 10) this.gameTime = minutes+':0'+seconds;
            else this.gameTime = minutes+':'+seconds;
            
            if(this.gameTimeLeft == 10){   this.timerAnim.resume(); this.timerBar.play('timer'); Util.playSound('countdown'); Util.playSound('timeup');   }
            
            this.gameTimeLeft--;
            this.timer.setText(this.gameTime);
            
            this.gameTimer = 0;
             if(this.gameTime =='0:00'){
                  this.timerAnim.pause();
                  this.timerBar.setTexture('hud','TIMER_00.png');
                    let minigameNames = Util.getMinigameNames();
                var minigameIdx = Math.floor(Math.random()*minigameNames.length);
                console.log("Launching "+minigameNames[minigameIdx]+" at idx "+minigameIdx);
                this.inputToggle = false;
                this.scene.launch(minigameNames[minigameIdx]);
               this.scene.pause(); 
            }
            
        }
        
        if(this.specialTimer>0) this.specialTimer -=delta;

        if(this.specialActive){ 
            this.activeSpecialTimer -=delta;
         if(this.activeSpecialTimer <=0){
            this.slowMoExit();
            this.specialActive = false;
         }
        }

        this.bg1.x += 1 * this.registry.get('speedModifier');
        this.bg2.x += 1 * this.registry.get('speedModifier');
         this.newbg1.x=this.bg1.x;
         this.newbg2.x=this.bg2.x;
         
        if(this.bg1.x > 640)
       this. bg1.x = this.bg2.x -this.bg2.displayWidth;
         if(this.bg2.x > 640)
        this.bg2.x = this.bg1.x - this.bg1.displayWidth;
       
        let lastOrder = null;
        if(this.orders.children.size > 0) {
            lastOrder = this.orders.children.entries[this.orders.children.size-1];
            this.orderPointer.y = this.orders.children.entries[0].items.children.entries[0].y-18 ;
             this.orderPointer.x = this.orders.children.entries[0].items.children.entries[0].x + 20;
        }
        if(lastOrder == null || lastOrder.y < START_LINE - lastOrder.displayHeight *1.05) {
           if(lastOrder != null) console.log("Last order y: "+lastOrder.y+", spawn y: "+(START_LINE - lastOrder.displayHeight *1.5));
           
            if(this.specialTimer <=0){
        this.specialTimer = (Math.random()*5 +this.registry.get('specialFrequency') * 1000);
             this.addNewOrder(true);
        }else
            this.addNewOrder();
        }
    }

});

export {MainScene};
