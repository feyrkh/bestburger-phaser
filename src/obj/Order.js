/*global Phaser*/
import 'phaser';

var itemOptions = ['burger', 'fries', 'soda', 'salad', 'slowMo', 'bomb','itemRush'];
var rushOptionOne;
var rushOptionTwo;

const MIN_ORDER_SPEED = 1;
const MAX_ORDER_SPEED = 6;
const ORDER_SPEED_INCREMENT = 0.2;
const ORDER_SPEED_DECREMENT = 0.4;
const MIN_COMPLEXITY = 2;
const MAX_COMPLEXITY = 4;
const COMPLEXITY_SPREAD = 1;
const MISTAKES_TO_RANKDOWN = 3;
const MENU_COMPLEXITY = 'menuComplexity';
const ORDER_SPEED = 'orderSpeed';
const SPECIAL_FREQ = 'specialFrequency';

function gray(value) {
      return value+(value<<8)+(value<<16);
}

const GRAY_TINT = gray(0x80);
const FAILURE_LINE = 17;
const ENTRY_TWEEN_DURATION = 300;

// Order contains the items, accepts proxied input, and determines when it is fulfilled
var Order = new Phaser.Class({
   Extends: Phaser.GameObjects.Image,
   
   initialize:
   function Order(scene, opts, allowSpecials,itemRushActive,itemRushItem1,itemRushItem2) {
      opts = opts || {};
      Phaser.GameObjects.Image.call(this, scene);
      // Set up initial position and speed of the order card
      this.setPosition(opts.x || -215, opts.y || 620-this.displayHeight);
      this.setOrigin(0,0);
      this.setScale(3);
      this.setTexture('orderCard');
      this.dy = opts.dy || Phaser.Math.GetSpeed(-this.displayHeight * 1, 3);
      if(opts.z) this.z = opts.z;
      
      // Add to the parent scene
      this.scene.sys.updateList.add(this);
      this.items = this.scene.add.group([], {ownsChildren:true});
      if(!this.scene.registry.get(MENU_COMPLEXITY)) this.scene.registry.set(MENU_COMPLEXITY, MIN_COMPLEXITY);
      if(!this.scene.registry.get(SPECIAL_FREQ)) this.scene.registry.set(SPECIAL_FREQ, 30);
      
      // Start zipping onto the screen
      let origX = this.x;
      let moveAmt = this.displayWidth + 30;
      let tweenTargets = [this];
      let _this = this;
      this.x += moveAmt;
      
      if(this.scoreToAdd == undefined)
      this.scoreToAdd = 0;
      // Set up order items
      var numItems = Phaser.Math.Between(this.scene.registry.get(MENU_COMPLEXITY), this.scene.registry.get(MENU_COMPLEXITY) + COMPLEXITY_SPREAD);
      this.nextOrderItemX = this.x + 3;
      this.nextOrderItemY = this.y + 0;
      this.orderText = "";
      this.itemSpacing = 1;
      var specialOrderPosition = Math.floor(Math.random()*numItems);
      for(var i=0;i<numItems;i++) {
         if(allowSpecials == true && i == specialOrderPosition){
             let key = itemOptions[Phaser.Math.Between(4,6)];
             let newItem = this.addOrderItem(key);
         tweenTargets.push(newItem);
         this.orderText += key+" ";
         allowSpecials = false;
         }
         else{
            if(itemRushActive == undefined)
          var key = itemOptions[Phaser.Math.Between(0, itemOptions.length-4)];
          else {
             
         if(Math.floor(Math.random()*100) > 50)  var key = itemOptions[itemRushItem1];
         else  var key = itemOptions[itemRushItem2];
          }
         let newItem = this.addOrderItem(key);
         tweenTargets.push(newItem);
         this.orderText += key+" ";
         }
      }
      
      // Set up the 'bounce into the screen' animation
      this.entryTweenDuration = ENTRY_TWEEN_DURATION;
      this.scene.tweens.add({
         targets: tweenTargets,
         y: "-="+moveAmt,
         duration: this.entryTweenDuration,
         onComplete:  function() { console.log("Finished bouncing in: "+_this.orderText); _this.readyToMove = true;
            
          var tweenTargets =_this.items.children.entries;
          _this.items.children.each(function(child) {child.setScale(4);});
      
         _this.scene.tweens.add({
              targets: tweenTargets,
              scaleX: "-=1",
              scaleY: "-=1",
              duration: 60
              }); } });
   },
   
   addOrderItem: function(key) {
      var newItem = this.scene.add.sprite(this.x,this.nextOrderItemY,'main','MAIN_BUTTONS/RED.png');
      newItem.setOrigin(0,0);
      newItem.name = key;
      newItem.orderPosition = this.items.getLength();
      
      switch(this.itemSpacing){
         case 1: newItem.x = 111; break;
         case 2: newItem.x = 168; break;
         case 3: newItem.x = 227; break;
         case 4: newItem.x = 285; break;
         case 5: newItem.x = 342; break;
      }

      newItem.z = this.z + 1;
      newItem.setScale(3);
      newItem.play(key);
     this.itemSpacing++;
      this.items.add(newItem);
      return newItem;
   },
   
   animateBounceWave: function(waveDelay) {
      this.items.children.each(function(child) {
         console.log("Animating child", child);
         child.anims.delayedPlay(child.orderPosition * waveDelay, child.name);
      })   
   },
   getFirstItem: function() {
      if(this.items.children && this.items.children.entries && this.items.children.entries.length > 0) {
         return this.items.children.entries[0];
      } else {
         return null;
      }
   },

   // Called when wrong button is pressed
   badInput: function(penaltyMs,specialActive) {
      var _this = this;
      var _x = this.x;
      var firstItem = this.getFirstItem();
      var startTime = Date.now();
      this.scene.registry.set('itemCombo', 0);
      this.scene.tweens.add({
         targets: firstItem,
         x: "-=3",
         yoyo: true,
         duration: 33,
         repeat: Math.floor(penaltyMs/66),
         onComplete: function() { 
            _this.x = _x; 
         }
      });
   },
   
   addScore: function(name, amt) {
      if(amt === undefined) amt = 1;
       var score = this.scene.registry.get(name+'Score')+amt;
      this.scene.registry.set(name+'Score', score);
   },
   
   removeItem: function(toRemove) {
      this.items.remove(toRemove);
      // console.log("Tween starting, alpha="+toRemove.alpha, toRemove);
      if(this.scene.registry.get('ranking') >=6)
     this.scoreToAdd += 10;
     else this.scoreToAdd += 1*(this.scene.registry.get('ranking'));
      this.scene.registry.set('itemCombo', this.scene.registry.get('itemCombo')+1);
      var destroyTween = this.scene.tweens.add({

            targets: toRemove,
            alpha: { value: 1, duration: 1000 },
            onComplete: function(tween) {
              toRemove.destroy();
            } 
         });
      
      toRemove.play('itemCleared', 9, true, true);
      toRemove.x -= 44;
      toRemove.y -= 53;
      // Order is empty, all children have been removed
      if(this.items.children.entries.length == 0) {
         this.addScore('order');
         var _this = this;
         this.scene.removeOrder(this);
         
         var successTween = this.scene.tweens.add({
            targets: this,
            alpha: { value: 0.1, duration: 500 },
            onComplete: function(tween) {
               _this.destroyOrder();
            } 
         });
         return true; // Order was completed
      }
      return false; // Order not completed
   },
   
   getOrderText: function() {
      return this.orderText;
   },

   disableOrder: function() {
      if(!this.readyToMove) return; // they weren't even all the way into the screen, don't disable
      this.scene.registry.set('itemCombo',0);
      this.grayedOut = true;
      this.scene.removeOrder(this);
      this.setTint(GRAY_TINT);
      this.items.children.each(function(child) {
         child.setTint(GRAY_TINT);
      });
      var targets = this.items.children.getArray();
      targets.push(this);
      this.scene.tweens.add({
         targets: targets,
         x: "-=3",
         yoyo: true,
         duration: 33,
         repeat: Math.floor(500/66)
      });
   },
   
   destroyOrder: function() {
      if(!this.scene) return; // We've already been destroyed
      console.log("Destroying order");
      this.scene.removeOrder(this);
      this.items.destroy();
      this.destroy();
   },
   
   preUpdate: function(time, delta) {
      if(!this.readyToMove) return;
         if(this.scoreToAdd > 0){
         this.scoreToAdd--;
         this.addScore('item');
      }
      
      if(this.y < -this.displayHeight) {
         // console.log("Parent's child count: "+this.parent.children.length);
         this.destroyOrder();
         return;
      } else if(!this.grayedOut && this.y < FAILURE_LINE && this.items.getLength() > 0) {
         this.scene.orderFailed();
         if(this.items.getLength() != 0) {
            // Didn't clear it out before the failure line
           // this.applyPenalty(4);
         }
         this.disableOrder();
      }
      var moveAmt = (this.dy * delta * this.scene.registry.get('orderSpeed')) * this.scene.registry.get('speedModifier');
      if(this.grayedOut) moveAmt *= 20;
      this.y += moveAmt;
      this.items.incY(moveAmt);
   }
    
});

export {Order};