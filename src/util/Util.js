/* global Phaser */
import 'phaser';
import 'howler';

var sfx = {};

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
    },
    
    loadSound: function(name, url) {
        sfx[name] = new Howl({
            src: [url]
        });
    },
    
    playSound: function(name){
        sfx[name].play();
    }

};

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

export {Util};