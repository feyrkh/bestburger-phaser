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
    
    incrementRegistry: function(registry, key, incrementAmt) {
        let curAmt = registry.get(key);
        let newAmt = curAmt+incrementAmt;
        registry.set(key, newAmt);
        return newAmt;
    },
    
    randomEntry: function(arr) {
        if(arr instanceof Array) {
            return arr[Phaser.Math.Between(0, arr.length-1)];
        } else {
            return arr;
        }
    }
};

export {Util};