class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        //load audio
        // this.load.audio('sfx_select', './assets/blip_select12.wav');
        // this.load.audio('sfx_explosion', './assets/explosion38.wav');

        //load image
        this.load.image('background', './assets/level1/sample.png');

    }

    create() {
        //menu display
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#00000000',
            color: '#000d09',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        let titleConfig = {
            fontFamily: 'fantasy',
            fontSize: '30px',
            backgroundColor: '#00000000',
            color: '#000d09',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        let guideConfig = {
            fontFamily: 'Courier',
            fontSize: '25px',
            backgroundColor: '#00000000',
            color: '#000d09',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;
        let textSpacer = 64;


        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'background').
            setOrigin(0, 0);

        this.add.text(centerX, centerY - 160, 'Color-Less-Ful', titleConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - 60, 'Press ← → to move and "↑" to jump', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - 50 + textSpacer, 'Collect Color Squares And Go To The Door', guideConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 10 + textSpacer, 'Press → to start the game', menuConfig).setOrigin(0.5);

        // define keys
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // this.sound.play('sfx_select');
            this.scene.start('loadScene');
        }
    }
}