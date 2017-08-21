/*global Phaser*/
import 'phaser';

var itemOptions = ['burger', 'fries', 'soda', 'salad'];
const MIN_ORDER_SPEED = 0.5;
const MAX_ORDER_SPEED = 4;
const ORDER_SPEED_INCREMENT = 0.1;
const ORDER_SPEED_DECREMENT = 0.5;
const MIN_COMPLEXITY = 1;
const MAX_COMPLEXITY = 5;
const COMPLEXITY_SPREAD = 3;

const MENU_COMPLEXITY = 'menuComplexity';

// Order contains the items, accepts proxied input, and determines when it is fulfilled
var Order = new Phaser.Class({
   Extends: Phaser.GameObjects.Image,
   
   initialize:
   function Order(scene, opts) {
      opts = opts || {};
      Phaser.GameObjects.Image.call(this, scene);
      this.setPosition(opts.x || 135, opts.y || 405);
      this.setOrigin(0,0);
      this.setTexture('orderCard');
      this.dy = opts.dy || Phaser.Math.GetSpeed(-this.displayHeight * 1.3, 2);
      if(opts.z) this.z = opts.z;
      this.scene.sys.updateList.add(this);
      this.items = this.scene.add.group([], {ownsChildren:true});
      if(!this.scene.registry.get(MENU_COMPLEXITY)) {
         this.scene.registry.set(MENU_COMPLEXITY, MIN_COMPLEXITY);
      }
      var numItems = Phaser.Math.Between(this.scene.registry.get(MENU_COMPLEXITY), this.scene.registry.get(MENU_COMPLEXITY) + COMPLEXITY_SPREAD);
      this.nextOrderItemX = this.x + 5;
      this.nextOrderItemY = this.y + 5;
      for(var i=0;i<numItems;i++) {
         var key = itemOptions[Phaser.Math.Between(0, itemOptions.length-1)];
         this.addOrderItem(key);
      }
   },
   
   addOrderItem: function(key) {
      var newItem = this.scene.make.image({x:this.x,y:this.nextOrderItemY,z:this.z+1,key:key}).setOrigin(0,0);
      newItem.name = key;
      newItem.x = this.nextOrderItemX;
      newItem.setScale(4);
      this.nextOrderItemX += newItem.displayWidth +8;
      this.items.add(newItem);
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
      if(choicePct < 80) {
         // reduce speed;
         //var newSpeed = Math.max(this.scene.)
      } else {
         // reduce complexity
         var curComplexity = Math.max(this.scene.registry.get(MENU_COMPLEXITY) - 1, MIN_COMPLEXITY);
         this.scene.registry.set(MENU_COMPLEXITY, curComplexity);
      }
   },
   
   // Called when wrong button is pressed
   badInput: function(penaltyMs) {
      this.applyPenalty();
      var _this = this;
      var _x = this.x;
      var firstItem = this.getFirstItem();
      this.scene.tweens.add({
         targets: firstItem,
         x: "-=3",
         duration: 10,
         yoyo: true,
         repeat: Math.floor(penaltyMs/10),
         onComplete: function() { console.log("Finished jitter, moving back to "+_x); _this.x = _x; }
      });
   },
   
   removeItem: function(toRemove) {
      this.items.remove(toRemove);
      console.log("Tween starting, alpha="+toRemove.alpha, toRemove);
      var destroyTween = this.scene.tweens.add({
            targets: toRemove,
            alpha: { value: 0, duration: 4000 },
            x: { value: Phaser.Math.Between(-200,900), duration: 4000, ease: 'Power2' },
            y: { value: 400, duration: 1500, ease: 'Bounce.easeOut' },
            onComplete: function(tween) {
               console.log("Tween completed, alpha="+toRemove.alpha, toRemove);
               toRemove.destroy();
            }  
        });

      // this.scene.tweens.add({
      //    targets: toRemove,
      //    alpha: {value:0},
      //    duration: 20000,
      //    onComplete: function(tween) {
      //       console.log("Tween completed, alpha="+toRemove.alpha, toRemove);
      //       toRemove.destroy();
      //    }
      // })
      if(this.items.children.entries.length == 0) {
         var _this = this;
         var successTween = this.scene.tweens.add({
            targets: this,
            alpha: { value: 0.1, duration: 500 },
            onComplete: function(tween) {
               console.log("Tween completed, alpha="+toRemove.alpha, toRemove);
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
      if(this.y < 0) {
         // console.log("Parent's child count: "+this.parent.children.length);
         this.destroyOrder();
         return;
      }
      var moveAmt = this.dy * delta * this.scene.registry.get('orderSpeed');
      this.y += moveAmt;
      this.items.incY(moveAmt);
   }
    
});

export {Order};