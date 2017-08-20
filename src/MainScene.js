/*global Phaser*/
import 'phaser';
import {Order} from './obj/Order.js';

var minigameNames = ["minigame", "minigame2"];

const BG_LAYER = 0;
const CALIBRATION_LAYER = 1;
const ORDER_LAYER = 50; // occupies 2 layers

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
        this.load.image('arrow', 'assets/logo.png');
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
        this.add.image(0, 0, 'background').setOrigin(0,0).z = BG_LAYER;
        this.add.image(0.25, 0.25, 'salad').setOrigin(0,0).setScale(2).z = CALIBRATION_LAYER;
        this.time.addEvent({delay: 5000, callback: this.addNewOrder, callbackScope: this, loop: true});
        this.orders = this.add.group();
        this.addNewOrder();
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
        
        // TODO: REMOVE
        var _this = this;
        this.input.events.once('MOUSE_DOWN_EVENT', function (event) {
            var minigameIdx = Math.floor(Math.random()*minigameNames.length);
            console.log("Launching "+minigameNames[minigameIdx]+" at idx "+minigameIdx);
            _this.scene.launch(minigameNames[minigameIdx]);
            _this.scene.pause();
        });
    },
    
    addNewOrder: function() {
        // console.log("adding new scrolling arrow");
        var newOrder = new Order(this, {z: ORDER_LAYER});
        this.children.add(newOrder);
        this.orders.add(newOrder);
    },
    
    handleKeyboardInput: function(event) {
        if(event.data.repeat) return;
        switch(event.data.key) {
            case "a": this.handleMainGameInput('burger'); break;
            case "s": this.handleMainGameInput('fries'); break;
            case "d": this.handleMainGameInput('soda'); break;
            case "f": this.handleMainGameInput('salad'); break;
            case " ": this.handleMainGameInput('special'); break;
        }
    },
    
    handleMainGameInput: function(ingredientType) {
        console.log("Pressed button for "+ingredientType, this.input);
        var firstOrder = this.orders.getFirst();
        console.log("First order in list: ", firstOrder.items);
        for(var i=0;i<firstOrder.items.Length();i++) {
            
        }
    },

    ignoreInput: function(event) {
        event._propagate = false;
        // console.log("Ignoring event: ", event);
    },

    pause: function() {
        var _this = this;
        console.log("Doing stuff on pause", this);
        this.input.events.filter(this.ignoreInput);
    },


    resume: function() {
        console.log("Doing stuff on resume");
        this.input.events.filter(this.ignoreInput);
        
        // TODO: REMOVE
        var _this = this;
        this.input.events.once('MOUSE_DOWN_EVENT', function (event) {
            var minigameIdx = Math.floor(Math.random()*minigameNames.length);
            console.log("Launching "+minigameNames[minigameIdx]+" at idx "+minigameIdx);
            _this.scene.launch(minigameNames[minigameIdx]);
            _this.scene.pause();
        });
    },

    update: function (time, delta)
    {
    }

});

export {MainScene};
