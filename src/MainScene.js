/*global Phaser*/
import 'phaser';
import {Order} from './obj/Order.js';

var minigameNames = ["minigame", "minigame2"];

const BG_LAYER = 0;
const CALIBRATION_LAYER = 1;
const ORDER_LAYER = -2; // occupies 2 layers

const MS_PER_ORDER = 5000;
const MIN_ORDER_SPEED = 0.5;
const MAX_ORDER_SPEED = 4;
const ORDER_SPEED_INCREMENT = 0.1;
const ORDER_SPEED_DECREMENT = 0.5;

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
    },

    create: function ()
    {
        this.registry.set('orderSpeed', 2);
        this.nextOrderTimer = MS_PER_ORDER / this.registry.get('orderSpeed');
        
        // Set up static images
        this.add.image(0, 0, 'background')
            .setOrigin(0,0)
            .z = BG_LAYER;
            
        // Set up the 'new order' event
        this.orders = this.add.group();
        this.addNewOrder();

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
    
    addNewOrder: function() {
        // console.log("adding new scrolling arrow");
        var newOrder = new Order(this, {z: ORDER_LAYER});
        this.children.add(newOrder); // Add this to the scene so it gets rendered/updated
        this.orders.add(newOrder); // Add this to the 'orders' group so we can reference it later
    },
    
    removeOrder: function(order) {
        this.orders.remove(order);
    },
    
    handleKeyboardInput: function(event) {
        if(event.data.repeat) return;
        switch(event.data.key) {
            case "a": this.handleMainGameInput('burger'); break;
            case "s": this.handleMainGameInput('fries'); break;
            case "d": this.handleMainGameInput('soda'); break;
            case "f": this.handleMainGameInput('salad'); break;
            case " ": 
                var minigameIdx = Math.floor(Math.random()*minigameNames.length);
                console.log("Launching "+minigameNames[minigameIdx]+" at idx "+minigameIdx);
                this.scene.launch(minigameNames[minigameIdx]);
                this.scene.pause();
                break;
        }
    },
    
    handleMainGameInput: function(ingredientType) {
        console.log("Pressed button for "+ingredientType, this.input);
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
            console.log("Destroying an ingredient");
            firstOrder.removeItem(firstItem);
        } else {
            // They touched the wrong thing
            var penaltyTime = 250;
            firstOrder.badInput(penaltyTime);
            this.ignoreInput(true);
            this.time.addEvent({delay: penaltyTime*3.5, callback: function() {this.ignoreInput(false);}, callbackScope: this});
            console.log("OUCH!!!! Wrong ingredient");
        }
        
    },

    ignoreInput: function(doIgnore) {
        if(doIgnore != this.ignoring) {
            this.ignoring = doIgnore;
            console.log("Ignoring input: "+this.ignoring);
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
        this.nextOrderTimer -= delta;
        if(this.nextOrderTimer<0) {
            this.nextOrderTimer = MS_PER_ORDER / this.registry.get('orderSpeed');
            this.addNewOrder();
        }
    }

});

export {MainScene};
