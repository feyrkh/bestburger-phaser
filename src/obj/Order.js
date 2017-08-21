/*global Phaser*/
import 'phaser';

var itemOptions = ['burger', 'fries', 'soda', 'salad'];
const MIN_ORDER_SPEED = 0.5;
const MAX_ORDER_SPEED = 4;
const ORDER_SPEED_INCREMENT = 0.1;
const ORDER_SPEED_DECREMENT = 0.5;

// Order contains the items, accepts proxied input, and determines when it is fulfilled
var Order = new Phaser.Class({
   Extends: Phaser.GameObjects.Image,
   
   initialize:
   function Order(scene, opts) {
      opts = opts || {};
      Phaser.GameObjects.Image.call(this, scene);
      this.setPosition(opts.x || 140, opts.y || 405);
      this.setOrigin(0,0);
      this.setTexture('orderCard');
      this.dy = opts.dy || Phaser.Math.GetSpeed(-this.displayHeight * 2, 5);
      if(opts.z) this.z = opts.z;
      this.scene.sys.updateList.add(this);
      this.items = this.scene.add.group([], {ownsChildren:true});
      
      var numItems = Phaser.Math.Between(3,6);
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
      this.nextOrderItemX += newItem.displayWidth;
      this.items.add(newItem);
   },
   
   getFirstItem: function() {
      if(this.items.children && this.items.children.entries && this.items.children.entries.length > 0) {
         return this.items.children.entries[0];
      } else {
         return null;
      }
   },
   
   // Called when wrong button is pressed
   badInput: function(penaltyMs) {
      var firstItem = this.getFirstItem();
   },
   
   removeItem: function(toRemove) {
      this.items.remove(toRemove);
      console.log("Tween starting, alpha="+toRemove.alpha, toRemove);
      var destroyTween = this.scene.tweens.add({
            targets: toRemove,
            alpha: { value: 0, duration: 4000 },
            x: { value: Phaser.Math.Between(-200,900), duration: 4000, ease: 'Power2' },
            y: { value: 400, duration: 1500, ease: 'Bounce.easeOut' }
        });
      destroyTween.setCallback('onComplete', function(tween) {
               console.log("Tween completed, alpha="+toRemove.alpha, toRemove);
               toRemove.destroy();
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
         var successTween = this.scene.tweens.add({
            targets: this,
            alpha: { value: 0.1, duration: 500 }
         });
         var _this = this;
         
         successTween.setCallback('onComplete', function(tween) {
            console.log("Tween completed, alpha="+toRemove.alpha, toRemove);
            _this.destroyOrder();
         });
      }
   },
   
   getOrderText: function() {
      
   },
   
   destroyOrder: function() {
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