/*global Phaser*/
import 'phaser';
import {Order} from './obj/Order.js';

var minigameNames = ["minigame", "minigame2"];

const BG_LAYER = -3;
const OVERLAY_LAYER = 0;
const ORDER_LAYER = -2; // occupies 2 layers
const BUTTONS_LAYER = 2;
const FLYING_ITEM_LAYER = 10;
const SCORE_LAYER = 100;

const MS_PER_ORDER = 2000;

var RED_BUTTON;
var BLUE_BUTTON;
var GREEN_BUTTON;
var YELLOW_BUTTON;
var WHITE_BUTTON;

var inputToggle = true;

const TEXT_SCALE = 0.2;

var MainScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function MainScene ()
    {
        Phaser.Scene.call(this, { 
            key: 'MainScene'
        });
    },

    preload: function ()
    {
        this.load.image('background-calibration', 'assets/mockup01.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('burger', 'assets/burger.png');
        this.load.image('fries', 'assets/fries.png');
        this.load.image('salad', 'assets/salad.png');
        this.load.image('soda', 'assets/soda.png');
        this.load.image('orderCard', 'assets/orderCard.png');
          this.load.image('buttonPressed', 'assets/MAIN/button_pressed.png');
        this.load.bitmapFont('atari', 'assets/fonts/atari-classic.png', 'assets/fonts/atari-classic.xml');
        
        this.load.atlas('main','assets/MAIN/MAIN_GAMEjson.png','assets/MAIN/MAIN_GAMEjson.json');
    },

    create: function ()
    {
        this.registry.set('orderSpeed', 1,4);
        this.nextOrderTimer = MS_PER_ORDER / this.registry.get('orderSpeed');
        // Create item animations
        this.anims.create({ key: 'burger', frames: this.anims.generateFrameNames('main', { prefix: 'BURGER', end: 2, zeroPad: 2 }), frameRate: 12,yoyo: true, repeat: -1 });
        this.anims.create({ key: 'fries', frames: this.anims.generateFrameNames('main', { prefix: 'FRIES', end:2, zeroPad: 2 }) ,frameRate: 12,yoyo: true, repeat: -1 });
        this.anims.create({ key: 'soda', frames: this.anims.generateFrameNames('main', { prefix: 'DRINK_', end: 2, zeroPad: 2 }),frameRate: 12,yoyo: true, repeat: -1 });
        this.anims.create({ key: 'salad', frames: this.anims.generateFrameNames('main', { prefix: 'SALAD', end: 2, zeroPad: 2 }),frameRate: 12,yoyo: true, repeat: -1 });
        
        // Set up static images
        this.add.image(0, 0, 'main','WINDOW_FRAME00.png')
        .setOrigin(0,0)
        .setScale(3)
        .z = OVERLAY_LAYER;
        
        //TEMP Background setup
        //creates 2 images and offsets one by the firsts size.
        this.bg1= this.add.image(0, 0, 'main','BACKGROUND_03.png');
        this.spritePosition(this.bg1,0,0,BG_LAYER);
        this.bg2= this.add.image(0, 0, 'main','BACKGROUND_03.png');
        this.spritePosition(this.bg2,0,0,BG_LAYER);
        this.bg2.x = -this.bg1.displayWidth;
   // Button bar
   
        this.add.sprite(0, 0, 'main','BUTTONS_BAR.png')
        .setOrigin(0,0)
        .setScale(3)
        .OVERLAY_LAYER ;
        RED_BUTTON = this.add.sprite(0, 0, 'main','RED.png');
        this.spritePosition(RED_BUTTON,114,343,BUTTONS_LAYER);
        YELLOW_BUTTON = this.add.sprite(0, 0, 'main','YELLOW.png');
        this.spritePosition(YELLOW_BUTTON,171,343,BUTTONS_LAYER);
        BLUE_BUTTON = this.add.sprite(0, 0, 'main','BLUE.png');
        this.spritePosition(BLUE_BUTTON,345,343,BUTTONS_LAYER);
        GREEN_BUTTON = this.add.sprite(0, 0, 'main','GREEN.png');
        this.spritePosition(GREEN_BUTTON,288,341,BUTTONS_LAYER)
        // Set up the 'new order' event
        this.orders = this.add.group();
        this.addNewOrder();

        // Set up scoreboard integration
        let baseX = 5;
        let baseY = 10;
        this.add.bitmapText(baseX, baseY, 'atari', 'Foods:').setScale(TEXT_SCALE).setTint(0xa00000);
        this.addScoreboard(baseX, baseY+15, 'itemScore', 'Scr:');
        this.addScoreboard(baseX, baseY+60, 'itemCombo', 'Cmbo:');
        this.addHighScoreboard(baseX, baseY+75, 'itemCombo', 'highItemCombo', 'Hi:');
        
        baseY = 200;
        this.add.bitmapText(baseX, baseY, 'atari', 'Orders:').setScale(TEXT_SCALE).setTint(0x0000a0);
        this.addScoreboard(baseX, baseY+15, 'orderScore', 'Scr:');
        this.addScoreboard(baseX, baseY+60, 'orderCombo', 'Cmbo:');
        this.addHighScoreboard(baseX, baseY+75, 'orderCombo', 'highOrderCombo', 'Hi:');
        
        baseX = 420;
        baseY = 10;
        this.add.bitmapText(baseX, baseY, 'atari', 'Level').setScale(TEXT_SCALE).setTint(0xff0000);
        this.addScoreboard(baseX, baseY+15, 'orderSpeed', 'Spd:', 1);
        this.addHighScoreboard(baseX, baseY+30, 'orderSpeed', 'highOrderSpeed', 'Hi:', 1);
        this.addScoreboard(baseX, baseY+60, 'menuComplexity', 'Menu:', 1);
        this.addHighScoreboard(baseX, baseY+75, 'menuComplexity', 'highMenuComplexity', 'Hi:', 1);
        

        // Handle keyboard input; TODO: figure out how to hook into all KEY_DOWN events...looks like a patch may be needed
        var _this = this;
      if(inputToggle){
        this.input.events.on('KEY_DOWN_A', function (event) {
            _this.handleKeyboardInput(event);
           RED_BUTTON.setTexture('main','BUTTON_PRESS.png');
        });
        this.input.events.on('KEY_DOWN_S', function (event) {
            _this.handleKeyboardInput(event);
           YELLOW_BUTTON.setTexture('main','BUTTON_PRESS.png');
        });
        this.input.events.on('KEY_DOWN_D', function (event) {
            _this.handleKeyboardInput(event);
           GREEN_BUTTON.setTexture('main','BUTTON_PRESS.png');
        });
        this.input.events.on('KEY_DOWN_F', function (event) {
            _this.handleKeyboardInput(event);
             BLUE_BUTTON.setTexture('main','BUTTON_PRESS.png');
        });
        this.input.events.on('KEY_DOWN_SPACE', function (event) {
            _this.handleKeyboardInput(event);
        });
        
    }
        this.input.events.on('KEY_UP_A', function (event) {
           RED_BUTTON.setTexture('main','RED.png');
        });
        this.input.events.on('KEY_UP_S', function (event) {
           YELLOW_BUTTON.setTexture('main','YELLOW.png');
        });
        this.input.events.on('KEY_UP_D', function (event) {
           GREEN_BUTTON.setTexture('main','GREEN.png');
        });
        this.input.events.on('KEY_UP_F', function (event) {
             BLUE_BUTTON.setTexture('main','BLUE.png');
        });
        this.input.events.on('KEY_DOWN_SPACE', function (event) {
            _this.handleKeyboardInput(event);
        });

        // var _this = this;
        // this.input.events.once('MOUSE_DOWN_EVENT', function (event) {
        //     var minigameIdx = Math.floor(Math.random()*minigameNames.length);
        //     console.log("Launching "+minigameNames[minigameIdx]+" at idx "+minigameIdx);
        //     _this.scene.launch(minigameNames[minigameIdx]);
        //     _this.scene.pause();
        // });
    },
    
    spritePosition: function(sprite, xPos,yPos,layer){
        sprite.setScale(3);
        sprite.setOrigin(0,0);
        sprite.setPosition(xPos,yPos);
        sprite.z = layer;
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
        this.nextOrderTimer = 9999999; // Don't let the next order come in until this one has fully scrolled onscreen
        var newOrder = new Order(this, {z: ORDER_LAYER});
        this.children.add(newOrder); // Add this to the scene so it gets rendered/updated
        this.orders.add(newOrder); // Add this to the 'orders' group so we can reference it later
        this.nextOrderTimer = MS_PER_ORDER / this.registry.get('orderSpeed') + newOrder.entryTweenDuration;
    },
    
    removeOrder: function(order) {
        this.orders.remove(order);
    },
    
    handleKeyboardInput: function(event) {
        if(inputToggle){
        if(event.data.repeat) return;
        switch(event.data.key) {
            case "a": this.handleMainGameInput('burger'); break;
            case "s": this.handleMainGameInput('fries'); break;
            case "d": this.handleMainGameInput('salad'); break;
            case "f": this.handleMainGameInput('soda'); break;
            case " ": 
                var minigameIdx = Math.floor(Math.random()*minigameNames.length);
                console.log("Launching "+minigameNames[minigameIdx]+" at idx "+minigameIdx);
                this.scene.launch(minigameNames[minigameIdx]);
                this.scene.pause();
                break;
          }
            
        }
    },
    
    handleMainGameInput: function(ingredientType) {
        // console.log("Pressed button for "+ingredientType, this.input);
        var firstOrder;
        var firstItem;
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
            // console.log("Destroying an ingredient");
            firstOrder.removeItem(firstItem);
            firstItem.z = FLYING_ITEM_LAYER;
        } else {
            // They touched the wrong thing
            var penaltyTime = 250;
            firstOrder.badInput(penaltyTime);
            inputToggle = false;
            this.time.addEvent({delay: penaltyTime, callback: function() {
               inputToggle = true;}, callbackScope: this
        
            });
            // console.log("OUCH!!!! Wrong ingredient");
        }
        if(this.orders.getLength() == 0) {
            // The last order was filled! Quick, pull in another!
            console.log("Emergency order!");
            this.addNewOrder();
        }
        
    },

    ignoreInput: function(doIgnore) {
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
    },


    resume: function() {
        console.log("Doing stuff on resume");
        this.ignoreInput(false);
        // TODO: REMOVE, this is an easy way to trigger minigames
        var _this = this;
    },

    update: function (time, delta)
    {
      
        // TEMP BG SCROLLING. places the image thats in front to the back if it goes off screen.
        this.bg1.x += 1;
        this.bg2.x +=1;
    
        if(this.bg1.x > 640)
       this. bg1.x = this.bg2.x -this.bg2.displayWidth;
         if(this.bg2.x > 640)
        this.bg2.x = this.bg1.x - this.bg1.displayWidth;
        
        this.nextOrderTimer -= delta;
        if(this.nextOrderTimer<0) {
            this.addNewOrder();
        }
    }

});

export {MainScene};
