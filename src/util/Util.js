/* global Phaser */
import 'phaser';

var Util = {
    getMinigameNames: function() {
        return Phaser.minigameList;  
    },
    
    registerMinigame: function(minigameScene, key) {
        console.log("Registering minigame: "+key, minigameScene);
        Phaser.Scene.call(minigameScene, {key:key});
        minigameScene.minigameKey = key;
        Phaser.minigameList = Phaser.minigameList || [];
        Phaser.minigameList.push(key);
    },
    
    spritePosition: function(sprite, xPos, yPos,layer){
        sprite.setScale(3);
        sprite.setOrigin(0,0);
        sprite.setPosition(xPos,yPos);
        sprite.z = layer;
    },
};

export {Util};