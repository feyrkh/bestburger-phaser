/* global Phaser */
import 'phaser';
import {Util} from './util/Util.js';
import {BugEnemy} from './obj/BugEnemy.js';

const BG_LAYER = -100;
const BORDER_LAYER = 5;
const PLAYFIELD_LAYER = 0;
const PLAYER_LAYER = 500;

const PLAYER_Y = 277;
const PLAYER_X_RED = 111;
const PLAYER_X_YELLOW = 168;
const PLAYER_X_WHITE = 226;
const PLAYER_X_GREEN = 285;
const PLAYER_X_BLUE = 342;

const ENEMY_LADYBUG = { anim: 'enemyLadybug', xOfs: 0};
const ENEMY_ROBOT = { anim: 'enemyRobot', xOfs: -5, pixelsPerMove: {slow: 350/15, medium: 350/10, fast: 350/5}, delayBetweenMoves: 500, restartAnim: true, moveDuration: 100 };
const ENEMY_WORM = { anim: 'enemyWorm', xOfs: 5};
const ENEMY_JUMPER = { anim: 'enemyJumper', xOfs: -3, pixelsPerMove: {slow: 350/9, medium: 350/6, fast: 350/3}, delayBetweenMoves: 150, restartAnim: true, moveDuration: 500 };

const ENEMY_SPAWN_DELAY = 1500;

const ENEMY_LIST = [
                ENEMY_LADYBUG,
                ENEMY_ROBOT,
                ENEMY_WORM,
                ENEMY_JUMPER
            ];

var Minigame03 = new Phaser.Class({
    Extends: Phaser.Scene,
    
    initialize: function Minigame03 ()
    {
        console.log("Minigame03()", this);
        Util.registerMinigame(this, 'minigame03');
    },
    
    preload: function ()
    {
        console.log("preload()", this);
        this.load.atlas('minigame03', 'assets/EVENT_03_BUGBLOCKER/EVENT_03_BUGBLOCKER.png', 'assets/EVENT_03_BUGBLOCKER/EVENT_03_BUGBLOCKER.json');
        this.load.atlas('hud', 'assets/HUD/HUD.png', 'assets/HUD/HUD.json');
    },
    
    preloadSounds: function() {
        Util.loadSound('03_bgm', 'assets/SOUND FX/MUSIC/BOSSA_BGM.mp3',true,1);
    },
    
    buildFlashAnims(key) {
        console.log('creating animation with key: '+key+' and prefix: '+'WARNING FLASHES/'+key.toUpperCase());
        this.anims.create({ key: key, frames: this.anims.generateFrameNames('minigame03', {prefix: 'WARNING FLASHES/'+key.toUpperCase(), suffix: '.png', start: 0, end: 1, zeroPad: 2}), frameRate: 20, repeat: 0, hideOnComplete: true});
        this.anims.create({ key: key+'Center', frames: this.anims.generateFrameNames('minigame03', {prefix: 'WARNING FLASHES/'+key.toUpperCase()+'-CENTER', suffix: '.png', start: 0, end: 1, zeroPad: 2}), frameRate: 20, repeat: 0, hideOnComplete: true});
    },
    
    create: function ()
    {
        let _this = this;
        this.anims.create({ key: 'bg', frames: this.anims.generateFrameNames('minigame03', { prefix: 'BG/', suffix: ".png", start: 0, end: 11, zeroPad: 2 }), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'shootingStar', frames: this.anims.generateFrameNames('minigame03', {prefix: 'SHOOTING STAR/', suffix: '.png', start: 0, end: 5, zeroPad: 2}), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'enemyLadybug', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_LADYBUG/', suffix: '.png', start: 0, end: 5, zeroPad: 2}), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'enemyRobot', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_ROBOT/', suffix: '.png', start: 0, end: 5, zeroPad: 2}), frameRate: 10, repeat: 1});
        this.anims.create({ key: 'enemyWorm', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_WORM/', suffix: '.png', start: 0, end: 2, zeroPad: 2}), frameRate: 15, repeat: -1});
        let jumperFrames = this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_JUMPER/', suffix: '.png', start: 2, end: 4, zeroPad: 2});
        jumperFrames = this.anims.generateFrameNames('minigame03', {framesArray: jumperFrames, prefix: 'ENEMY_JUMPER/', suffix: '.png', start: 0, end: 2, zeroPad: 2});
        this.anims.create({ key: 'enemyJumper', frames: jumperFrames, frameRate: 6, repeat: 0});

        this.playerMoving = false;
        let lennyFrames = this.anims.generateFrameNames('minigame03', { prefix: 'LENNY/', suffix: ".png", start: 0, end: 7, zeroPad: 2 });
        lennyFrames = this.anims.generateFrameNames('minigame03', { framesArray: lennyFrames, prefix: 'LENNY/', suffix: ".png", start: 0, end: 0, zeroPad: 2 });
        this.anims.create({ key: 'lenny', frames: lennyFrames, frameRate: 15, repeat: 0, onComplete: this.onPlayerMovingComplete, callbackScope: this });

        this.anims.create({ key: 'cautionSign', frames: this.anims.generateFrameNames('minigame03', { prefix: 'CAUTION SIGN/', suffix: ".png", start: 0, end: 1, zeroPad: 2 }), frameRate: 4, repeat: -1});
        this.anims.create({ key: 'playerPosition', frames: this.anims.generateFrameNames('minigame03', { prefix: 'PLAYER_POSITION/', suffix: ".png", start: 0, end: 11, zeroPad: 2 }), frameRate: 15, repeat: -1});
        
        this.buildFlashAnims('flashSlow');
        this.buildFlashAnims('flashMedium');
        this.buildFlashAnims('flashFast');

        this.bg = this.add.sprite(0, 0, 'bg');
        Util.spritePosition(this.bg,0,0,BG_LAYER);
        this.bg.play('bg');
        
        this.borderImg = this.add.image(0, 0, 'minigame03', 'BORDER.png');
        Util.spritePosition(this.borderImg, 0, 0, BORDER_LAYER);
        this.playfieldImg = this.add.image(0, 0, 'minigame03', 'PLAYFIELD.png');
        Util.spritePosition(this.playfieldImg, 0, 0, PLAYFIELD_LAYER);
        this.playerPositionBlueImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/BLUE.png'), 0, 0, PLAYER_LAYER-1);
        this.playerPositionRedImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/RED.png'), 0, 0, PLAYER_LAYER-1);
        this.playerPositionWhiteImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/WHITE.png'), 0, 0, PLAYER_LAYER-1);
        this.playerPositionYellowImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/YELLOW.png'), 0, 0, PLAYER_LAYER-1);
        this.playerPositionGreenImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/GREEN.png'), 0, 0, PLAYER_LAYER-1);
        
        this.player = this.add.sprite(0, 0, 'lenny');
        Util.spritePosition(this.player, PLAYER_X_BLUE, PLAYER_Y, PLAYER_LAYER);
        this.player.play('lenny');
        
        // Setup input
        if(!this.inputInitialized) {
            console.log('Initializing input');
            this.regularKeyListener = function (event) {
                _this.handleKeyboardInput(event);
            };
            
            this.inputInitialized = true;
        }
        this.input.enabled = true;
        this.input.events.on('KEY_DOWN_A', this.regularKeyListener);
        this.input.events.on('KEY_DOWN_S', this.regularKeyListener);
        this.input.events.on('KEY_DOWN_D', this.regularKeyListener);
        this.input.events.on('KEY_DOWN_F', this.regularKeyListener);
        this.input.events.on('KEY_DOWN_SPACE', this.regularKeyListener);
        this.inputToggle = true;

        this.movePlayer(PLAYER_X_WHITE, this.playerPositionWhiteImg);
        this.enemies = this.add.group();
        this.spawnEnemyEvent = this.time.addEvent({ delay: ENEMY_SPAWN_DELAY, callback: this.spawnEnemy, callbackScope: this, repeat: -1 });
    },
    
    spawnEnemy: function() {
        console.log('Spawning enemy');
        var xPos = Util.randomEntry([
                    PLAYER_X_BLUE, PLAYER_X_GREEN, PLAYER_X_RED, PLAYER_X_WHITE, PLAYER_X_YELLOW
                ]);
        xPos += 5;
        var speed = Util.randomEntry([ 'slow', 'slow', 'medium', 'medium', 'medium', 'fast']);
        var warningFlashSuffix = xPos == PLAYER_X_WHITE ? 'Center' : '';
        var enemy = Util.randomEntry(ENEMY_LIST);
        var newEnemy = new BugEnemy(this, {
            x: xPos,
            xOfs: enemy.xOfs,
            y: -10, 
            z: 30,
            speed: speed,
            warningFlashSuffix: warningFlashSuffix,
            anim: enemy.anim,
            pixelsPerMove: enemy.pixelsPerMove ? enemy.pixelsPerMove[speed] : undefined,
            restartAnim: enemy.restartAnim,
            delayBetweenMoves: enemy.delayBetweenMoves,
            player: this.player
        });
        this.enemies.add(newEnemy);
    },
    
    lennyAttack: function() {
        console.log('LENNY ATTACKS!');
    },
    
    movePlayer: function(xPos, positionImg) {
        if(this.playerMoving == xPos) {
            return;
        }
        this.playerMoving = xPos;
        this.player.x = xPos;
        this.player.play('lenny');
        this.playerPositionRedImg.visible = false;
        this.playerPositionYellowImg.visible = false;
        this.playerPositionGreenImg.visible = false;
        this.playerPositionBlueImg.visible = false;
        this.playerPositionWhiteImg.visible = false;
        positionImg.visible = true;
    },
            
    onPlayerMovingComplete: function() { 
        this.playerMoving = false; 
        console.log('LENNY ATTACK', this); 
        // Check each enemy to see if their bounding box is inside our attack area
        let lennyBounds = this.player.getBounds();
        let enemyBounds = undefined;
        let strikePoint = {x: lennyBounds.x + lennyBounds.width/2, y: lennyBounds.y};
        console.log('children.entries', this.enemies.children.entries);
        this.enemies.children.entries.forEach(function(enemy) {
            enemyBounds = enemy.getBounds(enemyBounds);
            if(strikePoint.x >= enemyBounds.x && strikePoint.y >= enemyBounds.y 
            && strikePoint.x <= enemyBounds.x+enemyBounds.width 
            && strikePoint.y <= enemyBounds.y+enemyBounds.height) {
                console.log('destroyed enemy', enemy);
                enemy.destroyEnemy();
            }
        }, this);
    },

    handleKeyboardInput: function(event) {
        if(this.inputToggle){
            if(event.data.repeat) return;
            switch(event.data.key) {
                case "a": 
                case "A": 
                    this.movePlayer(PLAYER_X_RED, this.playerPositionRedImg);
                    break;
                case "s": 
                case "S": 
                    this.movePlayer(PLAYER_X_YELLOW, this.playerPositionYellowImg);
                    break;
                case "d":
                case "D":
                    this.movePlayer(PLAYER_X_GREEN, this.playerPositionGreenImg);
                    break;
                case "f":
                case "F":
                    this.movePlayer(PLAYER_X_BLUE, this.playerPositionBlueImg);
                    break;
                case " ": 
                    this.movePlayer(PLAYER_X_WHITE, this.playerPositionWhiteImg);
                    break;
            }
        }
    },

    start: function() {
        console.log("start()", this);
    },
    
    update: function(time, delta) {
        this.enemies.update(time, delta);
    }
});

export {Minigame03};