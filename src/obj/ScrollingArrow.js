import 'phaser';

var ScrollingArrow = new Phaser.Class({
   Extends: Phaser.GameObjects.Image,
   
   preload: function() {
       this.load.image('arrow', 'assets/logo.png');
   },
   
   initialize:
   function ScrollingArrow(scene, opts) {
      opts = opts || {};
      Phaser.GameObjects.Image.call(this, scene);
      this.setScale(0.1);
       this.setPosition(opts.x || 800, opts.y || 300);
       this.dx = opts.dx/1000 || -400/1000.0;
       this.dy = opts.dy/1000 || 0;
       this.setTexture('arrow');
       this.scene.sys.updateList.add(this);
   },
   
   preUpdate: function(time, delta) {
      if(this.x < -this.displayWidth) {
         // console.log("Parent's child count: "+this.parent.children.length);
         this.destroy();
         // console.log("Destroying an arrow");
      }

      this.x += this.dx * delta;
      this.y += this.dy * delta;
   }
    
});

export {ScrollingArrow};