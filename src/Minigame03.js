/* global Phaser */
import 'phaser';
import {Util} from './util/Util.js';
import {BugEnemy} from './obj/BugEnemy.js';
import {InputBar} from './obj/InputBar.js';
import {MinigameTimer} from './obj/MinigameTimer.js';

const BG_LAYER = -100;
const SHOOTING_STAR_LAYER = -1;
const PLAYFIELD_LAYER = 0;
const BORDER_LAYER = 5;
const PLAYER_POSITION_LAYER = 25;
const ENEMY_LAYER = 30;
const BUTTON_BAR_LAYER = 35;
const PLAYER_LAYER = 500;

const PLAYER_Y = 277;
const PLAYER_X_RED = 119;
const PLAYER_X_YELLOW = 191;
const PLAYER_X_WHITE = 226;
const PLAYER_X_GREEN = 263;
const PLAYER_X_BLUE = 336;

const ENEMY_LADYBUG = { anim: 'enemyLadybug', xOfs: -7, size: 'normal'};
const ENEMY_ROBOT = { anim: 'enemyRobot', xOfs: -8, size: 'normal', pixelsPerMove: {slow: 350/15, medium: 350/10, fast: 350/5}, delayBetweenMoves: 500, restartAnim: true, moveDuration: 100,
    transform: {chance: 0.08, transformAnim: 'enemyRobotTransform', anim: 'enemyRobotBoost', transformDelay: 2000, delayBetweenMoves: 0, restartAnim: false, speedMultiplier: 3}};
const ENEMY_WORM = { anim: 'enemyWorm', xOfs: -5, size: 'normal'};
const ENEMY_JUMPER = { anim: 'enemyJumper', xOfs: -6, size: 'normal', pixelsPerMove: {slow: 350/9, medium: 350/6, fast: 350/3}, delayBetweenMoves: 150, restartAnim: true, moveDuration: 500 };
const ENEMY_MAN_1 = { anim: 'enemyMuscleMan_1', xOfs: -12, size: 'normal', pixelsPerMove: {slow: 175/14, medium: 350/10, fast: 350/6} };
const ENEMY_MAN_2 = { anim: 'enemyMuscleMan_2', xOfs: -12, size: 'normal', pixelsPerMove: {slow: 175/14, medium: 350/10, fast: 350/6} };

const ENEMY_SPAWN_DELAY = 1200;
const MIN_ENEMY_SPAWN_DELAY = 200;
const RESPAWN_PENALTY_PER_MISS = 10;
const RESPAWN_PENALTY_PER_KILL = 0;

const SHOOTING_STAR_CHANCE = 0.1;

const ENEMY_DEATH_EFFECTS = ['whack', 'm3_ding1', 'm3_ding2', 'm3_ding3', 'm3_ding4', 'm3_ding5'];
const ENEMY_DEATH_EFFECTS_DELAY = 100;

const ENEMY_LIST = [
                ENEMY_ROBOT,
                ENEMY_LADYBUG,
                ENEMY_WORM,
                ENEMY_JUMPER,
                ENEMY_LADYBUG,
                ENEMY_WORM,
                ENEMY_JUMPER,
                ENEMY_LADYBUG,
                ENEMY_WORM,
                ENEMY_JUMPER,
                ENEMY_LADYBUG,
                ENEMY_WORM,
                ENEMY_JUMPER,
                ENEMY_LADYBUG,
                ENEMY_WORM,
                ENEMY_JUMPER,
                ENEMY_MAN_1,
                ENEMY_MAN_2
            ];

const SIZE_OPTIONS = ['normal', 'small', 'small', 'small', 'tiny'];
const SPEED_OPTIONS = [ 'slow', 'slow', 'medium', 'medium', 'medium', 'fast'];

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
        this.load.atlas('interface', 'assets/INTERFACE/INTERFACE.png', 'assets/INTERFACE/INTERFACE.json');
    },
    
    preloadSounds: function() {
        Util.loadSound('03_bgm', 'assets/SOUND FX/MUSIC/EVENT03.mp3',true,0.4);
        Util.loadSound('whack',  'assets/SOUND FX/whack.mp3',false,2);
        Util.loadSound('weak_whack',  'assets/SOUND FX/whack.mp3',false,0.7);
        Util.loadSound('m3_ding0',  'assets/SOUND FX/ding00.mp3',false,2);
        Util.loadSound('m3_ding1',  'assets/SOUND FX/ding01.mp3',false,2);
        Util.loadSound('m3_ding2',  'assets/SOUND FX/ding02.mp3',false,2);
        Util.loadSound('m3_ding3',  'assets/SOUND FX/ding03.mp3',false,2);
        Util.loadSound('m3_ding4',  'assets/SOUND FX/ding04.mp3',false,2);
        Util.loadSound('m3_ding5',  'assets/SOUND FX/ding05.mp3',false,2);
    },
    
    buildFlashAnims(key) {
        console.log('creating animation with key: '+key+' and prefix: '+'WARNING FLASHES/'+key.toUpperCase());
        this.anims.create({ key: key, frames: this.anims.generateFrameNames('minigame03', {prefix: 'WARNING FLASHES/'+key.toUpperCase(), suffix: '.png', start: 0, end: 1, zeroPad: 2}), frameRate: 20, repeat: 0, hideOnComplete: true});
        this.anims.create({ key: key+'Center', frames: this.anims.generateFrameNames('minigame03', {prefix: 'WARNING FLASHES/'+key.toUpperCase()+'-CENTER', suffix: '.png', start: 0, end: 1, zeroPad: 2}), frameRate: 20, repeat: 0, hideOnComplete: true});
    },
    
    create: function ()
    {
        let _this = this;
        Util.playSound('03_bgm');
        this.anims.create({ key: 'fourButtonBarSwitch', frames: this.anims.generateFrameNames('interface', {prefix: 'BUTTON_BAR_TRANSFORM/', suffix: '.png', start: 0, end: 11, zeroPad: 2 }), frameRate: 15, hideOnComplete: true});
        this.anims.create({ key: 'bg', frames: this.anims.generateFrameNames('minigame03', { prefix: 'BG/', suffix: ".png", start: 0, end: 11, zeroPad: 2 }), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'shootingStar', frames: this.anims.generateFrameNames('minigame03', {prefix: 'SHOOTING STAR/', suffix: '.png', start: 0, end: 5, zeroPad: 2}), frameRate: 15, hideOnComplete: true});
        this.anims.create({ key: 'enemyLadybug', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_LADYBUG/', suffix: '.png', start: 0, end: 5, zeroPad: 2}), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'enemyRobot', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_ROBOT/', suffix: '.png', start: 0, end: 5, zeroPad: 2}), frameRate: 10, repeat: 1});
        this.anims.create({ key: 'enemyRobotTransform', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_ROBOT/WHEEL', suffix: '.png', start: 0, end: 4, zeroPad: 2}), frameRate: 2, repeat: 0});
        this.anims.create({ key: 'enemyRobotBoost', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_ROBOT/WHEEL', suffix: '.png', start: 5, end: 6, zeroPad: 2}), frameRate: 10, repeat: -1});
        this.anims.create({ key: 'enemyWorm', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_WORM/', suffix: '.png', start: 0, end: 2, zeroPad: 2}), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'enemyMuscleMan_1', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_MAN/BLACK_', suffix: '.png', start: 0, end: 5, zeroPad: 2}), frameRate: 15, repeat: -1});
        this.anims.create({ key: 'enemyMuscleMan_2', frames: this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_MAN/WHITE_', suffix: '.png', start: 0, end: 5, zeroPad: 2}), frameRate: 15, repeat: -1});
        let jumperFrames = this.anims.generateFrameNames('minigame03', {prefix: 'ENEMY_JUMPER/', suffix: '.png', start: 2, end: 4, zeroPad: 2});
        jumperFrames = this.anims.generateFrameNames('minigame03', {framesArray: jumperFrames, prefix: 'ENEMY_JUMPER/', suffix: '.png', start: 0, end: 2, zeroPad: 2});
        this.anims.create({ key: 'enemyJumper', frames: jumperFrames, frameRate: 6, repeat: 0});
        
        this.anims.create({ key: 'swat', frames: this.anims.generateFrameNames('minigame03', {prefix: 'SWAT/', start: 0, end: 3, suffix: '.png', zeroPad: 2 }), frameRate: 15, hideOnComplete: true, callback: this.finishAttack, callbackScope: _this});        
        this.anims.create({ key: 'explode', frames: this.anims.generateFrameNames('minigame03', {prefix: 'EXPLODE/', start: 0, end: 4, suffix: '.png', zeroPad: 2}), frameRate: 10, hideOnComplete: true});


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
        this.playerPositionBlueImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/BLUE.png'), 0, 0, PLAYER_POSITION_LAYER);
        this.playerPositionRedImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/RED.png'), 0, 0, PLAYER_POSITION_LAYER);
        this.playerPositionWhiteImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/WHITE.png'), 0, 0, PLAYER_POSITION_LAYER);
        this.playerPositionYellowImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/YELLOW.png'), 0, 0, PLAYER_POSITION_LAYER);
        this.playerPositionGreenImg = Util.spritePosition(this.add.image(0, 0, 'minigame03', 'PLAYER_POSITION/GREEN.png'), 0, 0, PLAYER_POSITION_LAYER);
        
        this.player = this.add.sprite(0, 0, 'lenny');
        Util.spritePosition(this.player, PLAYER_X_BLUE, PLAYER_Y, PLAYER_LAYER);
        this.player.play('lenny');
        this.swat = this.add.sprite(500, 500, 'swat');
        Util.spritePosition(this.swat, 500, 500, PLAYER_LAYER);
        
        this.shootingStar = this.add.sprite(0, 0, 'shootingStar');
        Util.spritePosition(this.shootingStar, 500, 500, SHOOTING_STAR_LAYER);
        
        // Setup input
        if(!this.inputInitialized) {
            console.log('Initializing input');
            this.regularKeyListener = function (event) {
                _this.handleKeyboardInput(event);
            };
            
            this.inputInitialized = true;
        }
        this.input.enabled = true;
        
        this.inputToggle = true;

        this.movePlayer(PLAYER_X_WHITE, this.playerPositionWhiteImg);
        this.enemies = this.add.group();
        this.enemySpawnDelay = ENEMY_SPAWN_DELAY;
        this.spawnTimer = 0;
        
        this.shootingStarEvent = this.time.addEvent({ delay: 1000, callback: this.spawnShootingStar, callbackScope: this, repeat: -1 });

        
        // Button bar
        this.buttonBar = new InputBar(this, {
            buttonCount: 4,
            inputCallback: this.handleKeyboardInput,
            layer: BUTTON_BAR_LAYER
        });
        
        this.buttonBarTransitionAnimation = this.add.sprite(48, 48, 'fourButtonBarSwitch');
        this.buttonBarTransitionAnimation.setScale(3);
        this.buttonBarTransitionAnimation.z = BUTTON_BAR_LAYER + 10;
        this.buttonBarTransitionAnimation.play('fourButtonBarSwitch');
        
        // Timer
        this.timer = new MinigameTimer(this, {
            time: 30000,
            callback: this.finishMinigame
        });
    },
    
    spawnEnemy: function() {
        var xPos = Util.randomEntry([
                    PLAYER_X_BLUE, PLAYER_X_GREEN, PLAYER_X_RED, PLAYER_X_YELLOW
                ]);
        xPos += 5;
        var speed = Util.randomEntry(SPEED_OPTIONS);
        var warningFlashSuffix = xPos == PLAYER_X_WHITE ? 'Center' : '';
        var enemy = Util.randomEntry(ENEMY_LIST);
        var size = enemy.size || Util.randomEntry(SIZE_OPTIONS);
        var newEnemy = new BugEnemy(this, {
            x: xPos,
            xOfs: enemy.xOfs,
            y: -10, 
            z: ENEMY_LAYER,
            speed: speed,
            size: size,
            warningFlashSuffix: warningFlashSuffix,
            anim: enemy.anim,
            pixelsPerMove: enemy.pixelsPerMove ? enemy.pixelsPerMove[speed] : undefined,
            restartAnim: enemy.restartAnim,
            delayBetweenMoves: enemy.delayBetweenMoves,
            player: this.player,
            transform: enemy.transform
        });
        this.enemies.add(newEnemy);
    },
    
    spawnShootingStar: function() {
        if(Math.random() >= SHOOTING_STAR_CHANCE) return;
        this.shootingStar.x = Math.random() * 30 + 10;
        this.shootingStar.y = Math.random() * (this.game.config.height / 2) - 10;
        if(Math.random() > 0.5) this.shootingStar.x += this.game.config.width - 120;
        this.shootingStar.flipX = (Math.random() >= 0.5);
        this.shootingStar.visible = true;
        this.shootingStar.play('shootingStar');
    },
    
    lennyAttack: function() {
        this.swat.x = this.player.x;
        this.swat.y = this.player.y - 74;
        this.swat.visible = true;
        this.swat.play('swat');
        let lennyBounds = this.swat.getBounds();
        let enemyBounds = undefined;
        let enemiesKilled = 0;
        this.enemies.children.entries.slice(0).reverse().forEach(function(enemy) {
            enemyBounds = enemy.getBounds(enemyBounds);
            if(enemyBounds.y + enemyBounds.height < lennyBounds.y) return;
            if(enemyBounds.x > lennyBounds.x + lennyBounds.width) return;
            if(enemyBounds.x + enemyBounds.width < lennyBounds.x) return;
            // Don't check the lower bound - we can kill anything below the swatter, Jeremy says
//            if(enemyBounds.y > lennyBounds.y + lennyBounds.height) return;
            enemiesKilled++;
            enemy.killedEnemy();
        }, this);
        if(enemiesKilled == 0) {
            this.enemySpawnDelay -= RESPAWN_PENALTY_PER_MISS;
            Util.getSound('weak_whack').rate(Math.random()*0.5-0.25+1);
            let data = Util.playSound('weak_whack');
            console.log(data);
        } else {
            this.addScore(enemiesKilled*enemiesKilled);
            this.enemySpawnDelay -= RESPAWN_PENALTY_PER_KILL;
            let duration = 100 + enemiesKilled * 50;
            let intensity = 0.008 * enemiesKilled - 0.004;
            this.cameras.main.shake(duration, intensity);
            this.playEnemyDeathSounds(enemiesKilled);
        }
        if(this.enemySpawnDelay < MIN_ENEMY_SPAWN_DELAY) this.enemySpawnDelay = MIN_ENEMY_SPAWN_DELAY;
    },
    
    addScore: function(amt) {
        console.log("Adding "+amt+" points");
        Util.incrementRegistry(this.registry, 'itemScore', amt);
        //Util.incrementRegistry(this.registry, 'minigameScoreTotal', amt);
    },
    
    playEnemyDeathSounds: function(enemiesKilled) {
        for(let i=0;i<enemiesKilled && i<ENEMY_DEATH_EFFECTS.length;i++) {
            let sound = ENEMY_DEATH_EFFECTS[i];
            this.time.addEvent({ delay: i*ENEMY_DEATH_EFFECTS_DELAY, callback: function() { 
                if(i==0) Util.getSound(sound).rate(Math.random()*0.5-0.25+1);
                Util.playSound(sound);
            }, callbackScope: this, repeat: 0 });
        }
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
        // Check each enemy to see if their bounding box is inside our attack area
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
                    this.lennyAttack();
                    break;
            }
        }
    },

    start: function() {
        console.log("start()", this);
    },
    
    finishMinigame: function() {
        Util.stopSound('03_bgm');
        this.scene.stop();
        this.scene.resume('MainScene');
    },

    update: function(time, delta) {
        this.timer.update(time, delta);
        this.enemies.update(time, delta);
        this.spawnTimer += delta;
        while(this.spawnTimer >= this.enemySpawnDelay) {
            this.spawnTimer -= this.enemySpawnDelay;
            this.spawnEnemy();
        }
    }
});

export {Minigame03};