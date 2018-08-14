/* global Phaser */
import 'phaser';
import {Util} from './util/Util.js';
import {InputBar} from './obj/InputBar.js';
import {MinigameTimer} from './obj/MinigameTimer.js';

const BG_LAYER = -10;
const CAR_LAYER = -1;
const WINDOW_LAYER = 3; 
const LENNY_LAYER = 5;

var carsCleared =0;
var Minigame02 = new Phaser.Class({
   Extends: Phaser.Scene,
     curPlayerState: 'g1',
    playerStates:
        {
              g1: {
            frames: 'good1'},
              g2: {
            frames: 'good2'},
              g3: {
            frames: 'good3'},
              g4: {
            frames: 'good4'},
              g5: {
            frames: 'good5'},
              g6: {
            frames: 'good6'},
              b1: {
            frames: 'bad1'},
              b2: {
            frames: 'bad2'},
              b3: {
            frames: 'bad3'},
              b4: {
            frames: 'bad4'},
              b5: {
            frames: 'bad5'},            
        },
    
    
    initialize: function Minigame03 ()
    {
        console.log("Minigame02()", this);
        Util.registerMinigame(this, 'minigame02');
    },
    preload: function ()
    {
        console.log("preload()", this);
     
        this.load.atlas('hud', 'assets/HUD/HUD.png', 'assets/HUD/HUD.json');
        this.load.atlas('interface', 'assets/INTERFACE/INTERFACE.png', 'assets/INTERFACE/INTERFACE.json');
        this.load.image('shadow', 'assets/EVENT_02_SERVICE_SMILE/EVENT_02_SHADOW_LAYER.png');
    },
       preloadSounds: function() {
        Util.loadSound('02_bgm', 'assets/SOUND FX/MUSIC/EVENT_02_DRIVETHRU_BGM.mp3',true,0.4);
     
    },
      create: function ()
    {
        let _this = this;
           this.bounceTimer =1500;
        this.spacing = 78;
     
   
       
        this.cars = this.add.group();
         this.carAmt = 0;
        while(this.cars.children.entries.length <10)
        this.newCar();
        this.bg = this.add.image(0, 0, 'minigame02','BACKGROUND.png');
        this.shadow = this.add.image(0,0,'shadow');
        this.intro = this.add.sprite(0, 0, 'minigame02','INTRO/00.png');
               // Setup input
        if(!this.inputInitialized) {
            this.regularKeyListener = function (event) {
                this.handleKeyboardInput(event);
                Util.playSound('good');
            };
            this.specialKeyListener = function (event) {
               this.handleKeyboardInput(event);
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
        
        Util.spritePosition(this.intro,0,0,WINDOW_LAYER);
         Util.spritePosition(this.shadow,0,0,CAR_LAYER +1);
        Util.spritePosition(this.bg,0,0,BG_LAYER);
        Util.playSound('02_bgm');
        this.intro.play('intro');
   
         this.timer = new MinigameTimer(this, {
            time: 20000,
            callback: this.finishMinigame
        });
    },
          removeCar:function(){
              console.log("Car removed : "+ this.cars.children.entries[0].name+ "current Cars = "+this.cars.children.entries.length);
               this.cars.children.entries[0].destroy();
              this.cars.remove(this.cars.children.entries[0]);
              this.spacing = 78;
              this.newCar();
             
          },
          newCar: function (){
              let carToSpawn = Math.floor(1+Math.random()*4);
              var car = null;
              if(carToSpawn ==1){
              car = this.add.sprite(0, 0, 'minigame02','CARS/BLUE.png');
              car.name = 'blue';
              }
               if(carToSpawn ==2){
              car = this.add.sprite(0, 0, 'minigame02','CARS/RED.png');
                car.name = 'red';
              }
               if(carToSpawn ==3){
              car = this.add.sprite(0, 0, 'minigame02','CARS/GREEN.png');
                car.name = 'green';
              }
               if(carToSpawn ==4){
              car = this.add.sprite(0, 0, 'minigame02','CARS/YELLOW.png');
                car.name = 'yellow';
              }
              if(this.cars.children.entries.length <=0) {Util.spritePosition(car,624,281.5,CAR_LAYER);
               this.cars.add(car);
              }
               else {
                   Util.spritePosition(car,this.cars.children.entries[this.cars.children.entries.length-1].x-78,281.5,CAR_LAYER);
                   this.cars.add(car);
               }

              console.log('New car is '+ car.name);
               this.carAmt++;
         console.log("CARS CREATED: " + this.carAmt );
          },
          
        getCurPlayerState: function() {
//        console.log("Returning state "+curPlayerState, playerStates[curPlayerState]);
        return this.playerStates[this.curPlayerState];
         },
    
        setNextPlayerState: function(nextStateName) {
        console.log("setting next state: "+nextStateName);
        this.curPlayerState = nextStateName;
        let state = this.getCurPlayerState();
        this.lenny.play(state.frames);
      //  this.stopPlayerStateSoundEffect();
        if(state.sfx) {
            this.stateSoundEffect = state.sfx;
            Util.playSound(this.stateSoundEffect);
        }
    },
    
    checkInput:function (input){
        this.spacing = 0;
        var carPOS =702;
        var delay =0;
        var i=0;
        carsCleared++;
        
        if(input !=this.cars.children.entries[3].name){
          this.setNextPlayerState('b'+Math.floor(1+Math.random()*5));
          delay = 500;
        }
         if(input ==this.cars.children.entries[3].name){
          this.setNextPlayerState('g'+Math.floor(1+Math.random()*6));
          delay = 70;
            this.addScore(20);
        }
        
        while (i <10)
        {
           var moveCarTween = this.tweens.add({targets: [this.cars.children.entries[i]], x: { value:carPOS,duration: delay }});
          i++;
         carPOS -=78;
         console.log(this.cars.children.entries[4].name +' '+'at window');
        }
    },
    
     addScore: function(amt) {
        console.log("Adding "+amt+" points");
        Util.incrementRegistry(this.registry, 'itemScore', amt);
        //Util.incrementRegistry(this.registry, 'minigameScoreTotal', amt);
    },
    
    carSquish:function(){
        this.allowBounce = true;
        var i1 =0;
        let delayedTime = 0;
         while (i1 <10){
          
        var carHop =this.tweens.add({
         targets: this.cars.children.entries[i1],
       y: "-=10",
         delay: delayedTime,
         yoyo: true,
         duration: 100,
         repeat: 0
      });
             i1++;
             delayedTime+=40;
        
         }
    },
      handleKeyboardInput: function(event) {
        if(this.inputToggle){
            //removes the intro scene window and replaces it with a static one.
            if(!this.introRemoved){   
                this.intro.destroy();
                   this.lenny = this.add.sprite(0,0,'minigame02','GOOD1/00.png');
                Util.spritePosition(this.lenny,0,0,LENNY_LAYER);
                
                this.window = this.add.sprite(0,0,'minigame02',"WINDOW.png");
                Util.spritePosition(this.window,-3,-3,WINDOW_LAYER);
             
                this.introRemoved = true;
                }
            if(event.data.repeat) return;
           
            switch(event.data.key) {
                case "a": 
                case "A": 
                    this.checkInput('red');
                    break;
                case "s": 
                case "S": 
                   this.checkInput('yellow');
                    break;
                case "d":
                case "D":
                  this.checkInput('green');
                    break;
                case "f":
                case "F":
                    this.checkInput('blue');
                    break;
            }
        }
    },
       finishMinigame: function() {
        Util.stopSound('02_bgm');
        this.scene.stop();
        this.scene.resume('MainScene');
         this.input.enabled = false;
         this.inputToggle = false;
        this.input.events.off('KEY_DOWN_A', this.regularKeyListener);
        this.input.events.off('KEY_DOWN_S', this.regularKeyListener);
        this.input.events.off('KEY_DOWN_D', this.regularKeyListener);
        this.input.events.off('KEY_DOWN_F', this.regularKeyListener);
        this.input.events.off('KEY_DOWN_SPACE', this.specialKeyListener);
    },

    update: function (time, delta)
    {
         this.timer.update(time, delta);
        if(this.cars.children.entries[0].x >= 702) this.removeCar();
       if(this.bounceTimer < 5000 && this.bounceTimer > 0) this.bounceTimer-= delta ;
        else{
            this.carSquish();
            this.bounceTimer =2000;
        }
    }
});

export {Minigame02};