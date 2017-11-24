/* global Phaser */
import 'phaser';
import 'howler';

var sfx = {};
var Util = {
  
 Pad : function (str, len, pad, dir)
{
    if (len === undefined) { len = 0; }
    if (pad === undefined) { pad = ' '; }
    if (dir === undefined) { dir = 3; }

    str = str.toString();

    var padlen = 0;

    if (len + 1 >= str.length)
    {
        switch (dir)
        {
            case 1:
                str = new Array(len + 1 - str.length).join(pad) + str;
                break;

            case 3:
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
                str = new Array(left + 1).join(pad) + str + new Array(right + 1).join(pad);
                break;

            default:
                str = str + new Array(len + 1 - str.length).join(pad);
                break;
        }
    }

    return str;
},
    registerMinigame: function(minigameScene, key) {
        console.log("Registering minigame: "+key, minigameScene);
        Phaser.Scene.call(minigameScene, {key:key});
        minigameScene.minigameKey = key;
        Phaser.minigameList = Phaser.minigameList || [];
        Phaser.minigameList.push(key);
        if(minigameScene.preloadSounds) minigameScene.preloadSounds();
    },
    
    spritePosition: function(sprite, xPos, yPos,layer){
        sprite.setScale(3);
        sprite.setOrigin(0,0);
        sprite.setPosition(xPos,yPos);
        sprite.z = layer;
        return sprite;
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
    
    //Sound
    loadSound: function(name, url, loop, volume) {
      console.log("Loading sound: "+name);
        sfx[name] = new Howl({
            src: [url],
            loop: loop,
            volume: volume || 1
        });
    },
    getSound: function(name) {
      return sfx[name];
    },
    playSound: function(name){
        sfx[name].play();
    },
    pauseSound: function(name){
        sfx[name].pause();
    },
    adjustVolume: function(name, volume)
    {
       sfx[name].volume(volume);
    },
    stopSound: function(name){
        sfx[name].stop();
    },
    
    //zoom effects
    incrementZoom:function(currentZoom,incrementAmount){
      if(currentZoom < 1.2)
      currentZoom += incrementAmount;
      return currentZoom;
    },
        windowBounce: function(scene,target,intensity){
        var newX =intensity || 3;
        var newY = 1;
        
        if( Math.random() *100 < 40) newY = 0; else newY =-newY;
         if( Math.random() *100 < 50)
        newX = -newX;
        
        target.setPosition(newX ,newY);
        scene.time.addEvent({ delay:50, callback: function(){
        target.setPosition(0,0);
        }, callbackScope: this});
    
    },
   
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