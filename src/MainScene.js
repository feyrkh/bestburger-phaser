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

const TEXT_SCALE = 0.2;

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
    },
    
    preloadSounds: function() {
    this.comboSoundTracker = 0;
    Util.loadSound('whack',  'assets/SOUND FX/whack.mp3',false,1);
    Util.loadSound('ding0',  'assets/SOUND FX/ding00.mp3',false,1);
    Util.loadSound('ding1',  'assets/SOUND FX/ding01.mp3',false,1);
    Util.loadSound('ding2',  'assets/SOUND FX/ding02.mp3',false,1);
    Util.loadSound('ding3',  'assets/SOUND FX/ding03.mp3',false,1);
    Util.loadSound('ding4',  'assets/SOUND FX/ding04.mp3',false,1);
    Util.loadSound('ding5',  'assets/SOUND FX/ding05.mp3',false,1);
    
    Util.loadSound('slow',  'assets/SOUND FX/slow.mp3',false,1);
    Util.loadSound('speedUp',  'assets/SOUND FX/speedup.mp3',false,1);
    Util.loadSound('main_bgm', 'assets/SOUND FX/MUSIC/SALSA_BGM.mp3',true,.3);
    
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
    {
         this.registry.set('zoom',  this.registry.get('zoom')+5);

        this.backgroundCounter = 3;
       Util.playSound('main_bgm');
        this.inputToggle = true;
        this.registry.set('orderSpeed', 1,4);
        // Create item animations
        this.anims.create({ key: 'burger', frames: this.buildFrames('MAIN_ICONS/BURGER', 4, 1), frameRate: 12, yoyo: true, repeat: 0 });
        this.anims.create({ key: 'fries', frames: this.buildFrames('MAIN_ICONS/FRIES', 4, 1), frameRate: 12, yoyo: true, repeat: 0 });
        this.anims.create({ key: 'soda', frames: this.buildFrames('MAIN_ICONS/DRINK_', 4, 1), frameRate: 12, yoyo: true, repeat: 0 });
        this.anims.create({ key: 'salad', frames: this.buildFrames('MAIN_ICONS/SALAD', 4, 1), frameRate: 12, yoyo: true, repeat: 0 });
         this.anims.create({ key: 'slowMo', frames: this.buildFrames('MAIN_ICONS/SLOW', 1, 1), frameRate: 12, yoyo: true, repeat: 0 });
        this.anims.create({ key: 'itemCleared', frames: this.buildFrames('MAIN_ICON_CLEAR/', 6), frameRate: 24});
        this.anims.create({key:'points',frames:this.anims.generateFrameNames('hud', { prefix: 'POINTS_', suffix: ".png", end: 5, zeroPad: 2 }), frameRate:12, yoyo:true});
         this.anims.create({key:'timer',frames:this.anims.generateFrameNames('hud', { prefix: 'TIMER_', suffix: ".png", end: 5, zeroPad: 2 }), frameRate:10, yoyo:true, repeat: -1});
        
        this.anims.create({key:'rankUp',frames:this.anims.generateFrameNames('interface', { prefix: 'SPIN_POSE/', suffix: ".png", end: 20, zeroPad: 2 }), frameRate:11 });
        
        let failureLineAnim = this.anims.create({ key: 'failureLine', frames: this.buildFrames('MAIN_WINDOW/WINDOW_FAILURE_LINE', 3), frameRate: 8, yoyo: true, repeat: -1});
        
        
        // Set up static images
       this.restaurantBG= this.add.image(0, 0, 'main','MAIN_WINDOW/RESTAURANT_BG.png');
        Util.spritePosition(this.restaurantBG,0,0,ORDER_LAYER-1);
        this.mainWindow= this.add.image(0, 0, 'main','MAIN_WINDOW/WINDOW_FRAME00.png');
        Util.spritePosition(this.mainWindow,0,0,OVERLAY_LAYER);
         this.windowTint = this.add.sprite(0, 0, 'main', 'MAIN_WINDOW/WINDOW_BACKGROUND00.png');
        Util.spritePosition(this.windowTint, 0, 0, ORDER_LAYER-1);
        

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
        //this.addScoreboard(baseX, baseY+15, 'itemScore', 'Scr:');
        this.addScoreboard(418, 113, 'itemCombo', '');
       // this.addHighScoreboard(baseX, baseY+75, 'itemCombo', 'highItemCombo', 'Hi:');
        
     //   baseY = 200;
      //  this.add.bitmapText(baseX, baseY, 'atari', 'Orders:').setScale(TEXT_SCALE).setTint(0x0000a0);
      //  this.addScoreboard(baseX, baseY+15, 'orderScore', 'Scr:');
      //  this.addScoreboard(baseX, baseY+60, 'orderCombo', 'Cmbo:');
      //  this.addHighScoreboard(baseX, baseY+75, 'orderCombo', 'highOrderCombo', 'Hi:');
        
        baseX = 420;
        baseY = 10;
        this.add.bitmapText(baseX, baseY, 'atari', 'Level').setScale(TEXT_SCALE).setTint(0xff0000);
        this.addScoreboard(baseX, baseY+15, 'orderSpeed', 'Spd:', 1);
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

    addScoreboard: function(x, y, registryName, label, startingVal, tint) {

        tint = tint || 0x202020;
        startingVal = startingVal || 0;
        let board = this.add.bitmapText(x, y, 'atari', label+startingVal);
        let _this = this;
        board.setScale(TEXT_SCALE);
        board.z = SCORE_LAYER;
        this.registry.set(registryName, startingVal);
        this.registry.after(registryName, function(game, key, value) {
            board.setText(label+value);
            _this.registry.set(registryName+"_HI", value);
            if(value != 0) {
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
            }
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
    
    addNewOrder: function() {
        // console.log("adding new scrolling arrow");
         var newOrder;
         var specialOnScreen = false;
         for(var i=0; this.orders.children.entries[i]; i++)
         {
             var curOrder = this.orders.children.entries[i];
             for(var e=0; curOrder.items.children.entries[e]; e++){
                 if(curOrder.items.children.entries[e].name == 'slowMo'){
                 specialOnScreen = true;
                 }
             }
         }
        if(this.orders.children.entries[0]!= undefined && this.orders.children.entries[0].y < 150 && !specialOnScreen)
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
            case " ": 
                let minigameNames = Util.getMinigameNames();
                var minigameIdx = Math.floor(Math.random()*minigameNames.length);
                console.log("Launching "+minigameNames[minigameIdx]+" at idx "+minigameIdx);
                this.inputToggle = false;
                this.scene.launch(minigameNames[minigameIdx]);
                this.scene.pause();
                break;
          }
            
        }
    },
    
    orderFailed: function() {
         this.registry.set('orderCombo', 0);
         if(this.registry.get('itemCombo') >=10)
         this.updateComboCounter('close')
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
        this.slowMo(10000);
            var orderCompleted = firstOrder.removeItem(firstItem);
            // bring in the combo counter. if its already in play the rank up animation.
      if(this.registry.get('itemCombo') ==10)
            this.updateComboCounter('opening');
        if(this.registry.get('itemCombo') >11 &&this.registry.get('itemCombo')  % 10 ==0)
            this.updateComboCounter('rankUp');
            // ding pitch scaling
            if(!orderCompleted){
              Util.playSound('whack');    
            if(this.comboSoundTracker < 5) this.comboSoundTracker++;
            }
             else{ this.comboSoundTracker = 0;
              Util.playSound('whack');    
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
             for(var e=0;e<this.orders.children.entries.length;e++){
                 this.orders.children.entries[e].y -=BAD_INPUT_BUMP;
                 this.orders.children.entries[e].items.children.each(function(child) {child.y-=BAD_INPUT_BUMP });
             }
             if(this.registry.get('itemCombo') >=10)
             this.updateComboCounter('close');
            var penaltyTime = 250;
            firstOrder.badInput(penaltyTime);
            this.inputToggle = false;
            this.comboSoundTracker = 0;
            this.time.addEvent({delay: penaltyTime, callback: function() {_this.inputToggle = true;}, callbackScope: this
            });
            Util.playSound('bad1');
            // console.log("OUCH!!!! Wrong ingredient");
        }
        if(this.orders.getLength() == 0) {
            // The last order was filled! Quick, pull in another!
            console.log("Emergency order!");
            this.addNewOrder();
        }
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
    },

    resume: function() {
        console.log("Doing stuff on resume");
        this.ignoreInput(false);
        Util.playSound('main_bgm');
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
                             this.time.addEvent({ delay:1000, callback: function(){tempRankup.destroy();}, callbackScope: this});
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

    hitstop:function(){
        this.currentSpeed = (this.registry.get('orderSpeed'));
        this.registry.set('orderSpeed',0);
        var newX =1;
        var newY = 0;
        
        if( Math.random() *100 < 40) newY = 0; else newY = -1.5;

         if( Math.random() *100 < 50)
        newX = -newX;
        
        this.mainWindow.setPosition(newX ,newY);
         this.windowTint.x = this.mainWindow.x *1.05;
         
        console.log("NEW WINDOW POSITION : " + this.mainWindow.x +" : " +this.mainWindow.y);
        this.time.addEvent({ delay:110, callback: function(){
        this.registry.set('orderSpeed',this.currentSpeed);
        this.mainWindow.setPosition(0,0);
         this.windowTint.x = this.mainWindow.x;
        }, callbackScope: this});
        
    },
    
    // halves the speed of the orders on screen
    
     slowMo:function(slowDownTime){
        let maxZoom = 1.09;
        let bounceRate = .03;
        
        let zoomAMT = maxZoom; 
     this.cameras.main.setZoom(zoomAMT);
  //this.mainWindow.setTint(GRAY_TINT);  
  this.bg1.setTint(GRAY_TINT);this.newbg1.setTint(GRAY_TINT);this.newbg2.setTint(GRAY_TINT);this.bg2.setTint(GRAY_TINT);
  this.pointsBar.setTint(GRAY_TINT); this.timerBar.setTint(GRAY_TINT);this.comboCounter.setTint(GRAY_TINT);this.restaurantBG.setTint(GRAY_TINT);
       
        let originalSpeed = this.registry.get('orderSpeed');
        this.registry.set('orderSpeed',originalSpeed * .4);
        Util.playSound('slow');
        Util.getSound('main_bgm').rate(.5);
        
         this.time.addEvent({ delay: 100, callback:function(){  
         if(zoomAMT !=maxZoom) this.cameras.main.setZoom(zoomAMT+=bounceRate);
        else this.cameras.main.setZoom(zoomAMT -= bounceRate); }, callbackScope: this, repeat:1, startAt: 1 });
        
          this.time.addEvent({ delay:slowDownTime-1000, callback: function(){ Util.playSound('speedUp')}});
          this.time.addEvent({ delay:slowDownTime, callback: function(){ this.registry.set('orderSpeed',originalSpeed); 
          Util.getSound('main_bgm').rate(1);
         
          this.time.addEvent({ delay: 5, callback:function(){  this.cameras.main.setZoom(zoomAMT -= ((maxZoom-1)/5)) }, callbackScope: this, repeat: 4, startAt: 5 });
          this.bg1.setTint(0xffffff);this.bg2.setTint(0xffffff);this.mainWindow.setTint(0xffffff);this.pointsBar.setTint(0xffffff); this.timerBar.setTint(0xffffff);this.comboCounter.setTint(0xffffff);
          this.restaurantBG.setTint(0xffffff);this.newbg1.setTint(0xffffff);this.newbg2.setTint(0xffffff); }, callbackScope: this});
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
    update: function (time, delta)
    {
             // TEMP BG SCROLLING. places the image thats in front to the back if it goes off screen.
        this.bg1.x += 1;
        this.bg2.x += 1;
         this.newbg1.x=this.bg1.x;
         this.newbg2.x=this.bg2.x;
         
        if(this.bg1.x > 640)
       this. bg1.x = this.bg2.x -this.bg2.displayWidth;
         if(this.bg2.x > 640)
        this.bg2.x = this.bg1.x - this.bg1.displayWidth;
       
        let lastOrder = null;
        if(this.orders.children.size > 0) {
            lastOrder = this.orders.children.entries[this.orders.children.size-1];
        }
        if(lastOrder == null || lastOrder.y < START_LINE - lastOrder.displayHeight *1.05) {
           if(lastOrder != null) console.log("Last order y: "+lastOrder.y+", spawn y: "+(START_LINE - lastOrder.displayHeight *1.5));
            this.addNewOrder();
        }
    }

});

export {MainScene};
