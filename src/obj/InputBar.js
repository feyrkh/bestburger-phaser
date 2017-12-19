/*global Phaser*/
import 'phaser';
import {Util} from '../util/Util.js';

var InputBar = new Phaser.Class({
   Extends: Phaser.GameObjects.Group,
   
   initialize: function InputBar(scene, opts) {
        let _this = this;
        opts = opts || {};
        opts.layer = opts.layer || 0;
        opts.buttonCount = opts.buttonCount || 5;
        opts.inputCallback = opts.inputCallback || function() { console.error('no input callback set'); };
       
        scene.load.atlas('main','assets/MAIN/MAIN.png','assets/MAIN/MAIN.json');

        Phaser.GameObjects.Group.call(this, scene, []);
        this.scene = scene;
        this.opts = opts;
        this.add = this.scene.add; // delegate new items to the scene
        this.input = this.scene.input;
        this.handleKeyboardInput = opts.inputCallback.bind(scene);
       
        switch(opts.buttonCount) {
            case 5: this.buildFiveButtonBar(); break;
            case 4: this.buildFourButtonBar(); break;
            default: throw 'Unexpected button count: '+opts.buttonCount;
        }
        
   },
   
   buildFiveButtonBar: function buildFiveButtonBar() {
        let _this = this;
        
        this.buttonBar = this.scene.add.sprite(0, 0, 'main','MAIN_BUTTONS/BUTTONS_BAR.png')
        .setOrigin(0,0)
        .setScale(3);
        this.buttonBar.z = this.opts.layer;
        
        this.RED_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/RED.png').setInteractive();
        this.RED_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'a'}});
        };
        Util.spritePosition(this.RED_BUTTON,114,343,this.opts.layer+1);
        this.YELLOW_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/YELLOW.png').setInteractive();
        this.YELLOW_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'s'}});
        };
        Util.spritePosition(this.YELLOW_BUTTON,171,343,this.opts.layer+1);
        this.BLUE_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/BLUE.png').setInteractive();
        this.BLUE_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'f'}});
        };
        Util.spritePosition(this.BLUE_BUTTON,345,343,this.opts.layer+1);
        this.GREEN_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/GREEN.png').setInteractive();
        this.GREEN_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'d'}});
        };
        Util.spritePosition(this.GREEN_BUTTON,288,343,this.opts.layer+1);
        this.WHITE_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/SPECIAL.png').setInteractive();
        this.WHITE_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':' '}});
        };
        Util.spritePosition(this.WHITE_BUTTON,228,343,this.opts.layer+1);
        
        
        this.input.events.on('KEY_DOWN_A', function (event) {
            _this.handleKeyboardInput(event);
            _this.RED_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS.png');
        });
        this.input.events.on('KEY_DOWN_S', function (event) {
            _this.handleKeyboardInput(event);
            _this.YELLOW_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS.png');
        });
        this.input.events.on('KEY_DOWN_D', function (event) {
            _this.handleKeyboardInput(event);
            _this.GREEN_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS.png');
        });
        this.input.events.on('KEY_DOWN_F', function (event) {
            _this.handleKeyboardInput(event);
            _this.BLUE_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS.png');
        });
        this.input.events.on('KEY_DOWN_SPACE', function (event) {
            _this.handleKeyboardInput(event);
            _this.WHITE_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS.png');
        });
            
        this.input.events.on('KEY_UP_A', function (event) {
            console.log('a button released');
            _this.RED_BUTTON.setTexture('main','MAIN_BUTTONS/RED.png');
        });
        this.input.events.on('KEY_UP_S', function (event) {
            _this.YELLOW_BUTTON.setTexture('main','MAIN_BUTTONS/YELLOW.png');
        });
        this.input.events.on('KEY_UP_D', function (event) {
            _this.GREEN_BUTTON.setTexture('main','MAIN_BUTTONS/GREEN.png');
        });
        this.input.events.on('KEY_UP_F', function (event) {
             _this.BLUE_BUTTON.setTexture('main','MAIN_BUTTONS/BLUE.png');
        });
        this.input.events.on('KEY_UP_SPACE', function (event) {
             _this.WHITE_BUTTON.setTexture('main','MAIN_BUTTONS/SPECIAL.png');
        });
   },
   
   buildFourButtonBar: function buildFourButtonBar() {
        let _this = this;
        
        this.buttonBar = this.scene.add.sprite(0, 0, 'main','MAIN_BUTTONS/BUTTONS_BAR.png')
        .setOrigin(0,0)
        .setScale(3);
        this.buttonBar.z = this.opts.layer;
        
        this.RED_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/RED2.png').setInteractive();
        this.RED_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'a'}});
        };
        Util.spritePosition(this.RED_BUTTON,114,342,this.opts.layer+1);
        this.YELLOW_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/YELLOW2.png').setInteractive();
        this.YELLOW_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'s'}});
        };
        Util.spritePosition(this.YELLOW_BUTTON,114+24*3, 342,this.opts.layer+1);
        this.GREEN_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/GREEN2.png').setInteractive();
        this.GREEN_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'d'}});
        };
        Util.spritePosition(this.GREEN_BUTTON,114+24*3*2, 342,this.opts.layer+1);
        this.BLUE_BUTTON = this.add.sprite(0, 0, 'main','MAIN_BUTTONS/BLUE2.png').setInteractive();
        this.BLUE_BUTTON.input.onDown = function (gameObject, pointer, x, y) {
            _this.handleKeyboardInput({'data':{'key':'f'}});
        };
        Util.spritePosition(this.BLUE_BUTTON,114+24*3*3, 342,this.opts.layer+1);
        
        this.input.events.on('KEY_DOWN_A', function (event) {
            _this.handleKeyboardInput(event);
            _this.RED_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS2.png');
        });
        this.input.events.on('KEY_DOWN_S', function (event) {
            _this.handleKeyboardInput(event);
            _this.YELLOW_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS2.png');
        });
        this.input.events.on('KEY_DOWN_D', function (event) {
            _this.handleKeyboardInput(event);
            _this.GREEN_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS2.png');
        });
        this.input.events.on('KEY_DOWN_F', function (event) {
            _this.handleKeyboardInput(event);
            _this.BLUE_BUTTON.setTexture('main','MAIN_BUTTONS/BUTTON_PRESS2.png');
        });
        this.input.events.on('KEY_DOWN_SPACE', function (event) {
            _this.handleKeyboardInput(event);
        });
            
        this.input.events.on('KEY_UP_A', function (event) {
            _this.RED_BUTTON.setTexture('main','MAIN_BUTTONS/RED2.png');
        });
        this.input.events.on('KEY_UP_S', function (event) {
            _this.YELLOW_BUTTON.setTexture('main','MAIN_BUTTONS/YELLOW2.png');
        });
        this.input.events.on('KEY_UP_D', function (event) {
            _this.GREEN_BUTTON.setTexture('main','MAIN_BUTTONS/GREEN2.png');
        });
        this.input.events.on('KEY_UP_F', function (event) {
             _this.BLUE_BUTTON.setTexture('main','MAIN_BUTTONS/BLUE2.png');
        });
   }
});

export {InputBar};