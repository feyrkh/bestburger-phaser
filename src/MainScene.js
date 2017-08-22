/*global Phaser*/
import 'phaser';
import {Order} from './obj/Order.js';

var minigameNames = ["minigame", "minigame2"];

const BG_LAYER = -3;
const OVERLAY_LAYER = 0;
const ORDER_LAYER = -2; // occupies 2 layers
const FLYING_ITEM_LAYER = 10;
const SCORE_LAYER = 100;

const MS_PER_ORDER = 2000;

var bg1;
var bg2;

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
        
        this.load.bitmapFont('atari', 'assets/fonts/atari-classic.png', 'assets/fonts/atari-classic.xml');
        
        this.load.atlas('main','assets/MAIN/MAIN_GAMEjson.png','assets/MAIN/MAIN_GAMEjson.json');
    },

    create: function ()
    {
        this.registry.set('orderSpeed', 1.5);
        this.nextOrderTimer = MS_PER_ORDER / this.registry.get('orderSpeed');
        
        // Set up static images
        this.add.image(0, 0, 'main','WINDOW_FRAME00.png')
        .setScale(3.7)
        .setOrigin(0,0)
        .z = OVERLAY_LAYER;
        
        //TEMP Background setup
        //creates 2 images and offsets one by the firsts size.
        bg1= this.add.image(0, 0, 'main','BACKGROUND_03.png')
         .setScale(3.7)
         .setOrigin(0,0);
        bg1.z = -3;
        bg2= this.add.image(0, 0, 'main','BACKGROUND_03.png')
        .setScale(3.7)
        .setOrigin(0,0);
        bg2.x = -bg1.displayWidth;
        bg2.z = -3;            

        // Set up the 'new order' event
        this.orders = this.add.group();
        this.addNewOrder();

        // Set up scoreboard integration
        let baseX = 5;
        let baseY = 10;
        this.add.bitmapText(baseX, baseY, 'atari', 'Foods:').setScale(0.25).setTint(0xa00000);
        this.addScoreboard(baseX, baseY+15, 'itemScore', 'Scr:');
        // this.addHighScoreboard(baseX, baseY+30, 'itemScore', 'highItemScore', 'Hi:');
        this.addScoreboard(baseX, baseY+60, 'itemCombo', 'Cmbo:');
        this.addHighScoreboard(baseX, baseY+75, 'itemCombo', 'highItemCombo', 'Hi:');
        
        baseY = 200;
        this.add.bitmapText(baseX, baseY, 'atari', 'Orders:').setScale(0.25).setTint(0x0000a0);
        this.addScoreboard(baseX, baseY+15, 'orderScore', 'Scr:');
        // this.addHighScoreboard(baseX, baseY+30, 'orderScore', 'highOrderScore', 'Hi:');
        this.addScoreboard(baseX, baseY+60, 'orderCombo', 'Cmbo:');
        this.addHighScoreboard(baseX, baseY+75, 'orderCombo', 'highOrderCombo', 'Hi:');
        

        // Handle keyboard input; TODO: figure out how to hook into all KEY_DOWN events...looks like a patch may be needed
        var _this = this;
        this.input.events.on('KEY_DOWN_A', function (event) {
            _this.handleKeyboardInput(event);
        });
        this.input.events.on('KEY_DOWN_S', function (event) {
            _this.handleKeyboardInput(event);
        });
        this.input.events.on('KEY_DOWN_D', function (event) {
            _this.handleKeyboardInput(event);
        });
        this.input.events.on('KEY_DOWN_F', function (event) {
            _this.handleKeyboardInput(event);
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
    
    addScoreboard: function(x, y, registryName, label, tint) {
        tint = tint || 0x202020;
        let board = this.add.bitmapText(x, y, 'atari', label+'0');
        let _this = this;
        board.setScale(0.25);
        board.z = SCORE_LAYER;
        this.registry.set(registryName, 0);
        this.registry.after(registryName, function(game, key, value) {
            board.setText(label+value);
            _this.registry.set(registryName+"_HI", value);
        });
        board.setTint(tint);
        return board;
    },
    
    addHighScoreboard: function(x, y, scoreName, highScoreName, label) {
        let board = this.addScoreboard(x, y, highScoreName, label);
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
            this.ignoreInput(true);
            this.time.addEvent({delay: penaltyTime, callback: function() {
                this.ignoreInput(false);}, callbackScope: this
                
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
            this.input.events.filter(this._ignoreInput);
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
        bg1.x += 1;
        bg2.x +=1;
    
        if(bg1.x > 620)
        bg1.x = bg2.x -bg2.displayWidth;
         if(bg2.x > 620)
        bg2.x = bg1.x - bg1.displayWidth;
        this.nextOrderTimer -= delta;
        if(this.nextOrderTimer<0) {
            this.addNewOrder();
        }
    }

});

export {MainScene};
