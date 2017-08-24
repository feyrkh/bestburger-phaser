/*global Phaser*/
import 'phaser';

var itemOptions = ['burger', 'fries', 'soda', 'salad'];
const MIN_ORDER_SPEED = 0.7;
const MAX_ORDER_SPEED = 4;
const ORDER_SPEED_INCREMENT = 0.1;
const ORDER_SPEED_DECREMENT = 0.2;
const MIN_COMPLEXITY = 1;
const MAX_COMPLEXITY = 5;
const COMPLEXITY_SPREAD = 2;

const MENU_COMPLEXITY = 'menuComplexity';
const ORDER_SPEED = 'orderSpeed';

function gray(value) {
      return value+(value<<8)+(value<<16);
}

const GRAY_TINT = gray(0x80);
const FAILURE_LINE = 17;
const ENTRY_TWEEN_DURATION = 600;

// Order contains the items, accepts proxied input, and determines when it is fulfilled
var Order = new Phaser.Class({
   Extends: Phaser.GameObjects.Image,
   
   initialize:
   function Order(scene, opts) {
      opts = opts || {};
      Phaser.GameObjects.Image.call(this, scene);
      // Set up initial position and speed of the order card
      this.setPosition(opts.x || 116, opts.y || 340-this.displayHeight);
      this.setOrigin(0,0);
      this.setScale(.8);
      this.setTexture('orderCard');
      this.dy = opts.dy || Phaser.Math.GetSpeed(-this.displayHeight * 1.5, 2);
      if(opts.z) this.z = opts.z;
      
      // Add to the parent scene
      this.scene.sys.updateList.add(this);
      this.items = this.scene.add.group([], {ownsChildren:true});
      if(!this.scene.registry.get(MENU_COMPLEXITY)) {
         this.scene.registry.set(MENU_COMPLEXITY, MIN_COMPLEXITY);
      }
      
      // Start zipping onto the screen
      let origX = this.x;
      let moveAmt = this.displayWidth + 30;
      let tweenTargets = [this];
      let _this = this;
      this.x += moveAmt;
      
      // Set up order items
      var numItems = Phaser.Math.Between(this.scene.registry.get(MENU_COMPLEXITY), this.scene.registry.get(MENU_COMPLEXITY) + COMPLEXITY_SPREAD);
      this.nextOrderItemX = this.x + 5;
      this.nextOrderItemY = this.y + 5;
      for(var i=0;i<numItems;i++) {
         let key = itemOptions[Phaser.Math.Between(0, itemOptions.length-1)];
         let newItem = this.addOrderItem(key);
         tweenTargets.push(newItem);
      }
      
      // Set up the 'bounce into the screen' animation
      this.entryTweenDuration = ENTRY_TWEEN_DURATION;
      this.scene.tweens.add({
         targets: tweenTargets,
         x: "-="+moveAmt,
         duration: this.entryTweenDuration,
         ease: 'Bounce.easeOut',
         callback: function() { _this.readyToMove = true; }
      });
   },
   
   addOrderItem: function(key) {
      var newItem = this.scene.add.sprite(this.x,this.nextOrderItemY,'main','RED.png');
      newItem.setOrigin(0,0);
      newItem.name = key;
      newItem.x = this.nextOrderItemX;
      newItem.setScale(3);
       newItem.play(key);
      this.nextOrderItemX += newItem.displayWidth +6;
      this.items.add(newItem);
      return newItem;
   },
   
   getFirstItem: function() {
      if(this.items.children && this.items.children.entries && this.items.children.entries.length > 0) {
         return this.items.children.entries[0];
      } else {
         return null;
      }
   },
   
   applyPenalty: function() {
      var choicePct = Math.random() * 100;
      if(choicePct < 40) {
         // reduce speed
         var newSpeed = Math.max(this.scene.registry.get(ORDER_SPEED) - ORDER_SPEED_DECREMENT, MIN_ORDER_SPEED)
         this.scene.registry.set(ORDER_SPEED, newSpeed);
         console.log("Slowing down: "+newSpeed);
      } else if(choicePct<50) {
         // reduce complexity
         var curComplexity = Math.max(this.scene.registry.get(MENU_COMPLEXITY) - 1, MIN_COMPLEXITY);
         this.scene.registry.set(MENU_COMPLEXITY, curComplexity);
         console.log("Decrease complexity: "+curComplexity);
      }
   },
   
   applyBonus: function() {
      var choicePct = Math.random() * 100;
      if(choicePct < 30) {
         // reduce speed
         var newSpeed = Math.min(this.scene.registry.get(ORDER_SPEED) + ORDER_SPEED_INCREMENT, MAX_ORDER_SPEED)
         this.scene.registry.set(ORDER_SPEED, newSpeed);
         console.log("Speeding up: "+newSpeed);
      } else if(choicePct<36) {
         // reduce complexity
         var curComplexity = Math.min(this.scene.registry.get(MENU_COMPLEXITY) + 1, MAX_COMPLEXITY);
         this.scene.registry.set(MENU_COMPLEXITY, curComplexity);
         console.log("Increasing complexity: "+curComplexity);
      }
      
   },
   
   // Called when wrong button is pressed
   badInput: function(penaltyMs) {
      this.applyPenalty();
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
             console.log("Finished jitter after "+(Date.now()-startTime)+", moving back to "+_x); 
            _this.x = _x; 
         }
      });
   },
   
   addScore: function(name, amt) {
      if(amt === undefined) amt = 1;
      this.scene.registry.set(name+'Score', this.scene.registry.get(name+'Score')+amt);
      this.scene.registry.set(name+'Combo', this.scene.registry.get(name+'Combo')+amt);
   },
   
   removeItem: function(toRemove) {
      this.items.remove(toRemove);
      // console.log("Tween starting, alpha="+toRemove.alpha, toRemove);
      this.addScore('item');
      var destroyTween = this.scene.tweens.add({
            targets: toRemove,
            alpha: { value: 0, duration: 4000 },
            x: { value: Phaser.Math.Between(-200,900), duration: 4000, ease: 'Power2' },
            y: { value: 400, duration: 1500, ease: 'Bounce.easeOut' },
            onComplete: function(tween) {
               // console.log("Tween completed, alpha="+toRemove.alpha, toRemove);
               toRemove.destroy();
            }  
        });

      // Order is empty, all children have been removed
      if(this.items.children.entries.length == 0) {
         this.addScore('order');
         var _this = this;
         this.scene.removeOrder(this);
         this.applyBonus();
         var successTween = this.scene.tweens.add({
            targets: this,
            alpha: { value: 0.1, duration: 500 },
            onComplete: function(tween) {
               // console.log("Tween completed, alpha="+toRemove.alpha, toRemove);
               _this.destroyOrder();
            } 
         });
      }
   },
   
   getOrderText: function() {
      
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
      if(this.y < -this.displayHeight) {
         // console.log("Parent's child count: "+this.parent.children.length);
         this.destroyOrder();
         return;
      } else if(!this.grayedOut && this.y < FAILURE_LINE && this.items.getLength() > 0) {
         this.scene.registry.set('orderCombo', 0);
         if(this.items.getLength() != 0) {
            // Didn't clear it out before the failure line
            this.applyPenalty();
         }
         this.grayedOut = true;
         this.scene.removeOrder(this);
         this.setTint(GRAY_TINT);
         this.items.children.each(function(child) {
            child.setTint(GRAY_TINT);
         });
      }
      var moveAmt = this.dy * delta * this.scene.registry.get('orderSpeed');
      this.y += moveAmt;
      this.items.incY(moveAmt);
   }
    
});

export {Order};