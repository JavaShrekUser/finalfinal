class Level1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }

    preload(){
        this.load.image('black', './assets/level1/black.png');      //preload assets
        this.load.image('bg3', './assets/level1/Level1-2.png');
        this.load.image('door','./assets/door.png');
        this.load.audio('choco','./assets/sound/BGM.mp3');
        this.load.audio('walk', './assets/sound/Walk.mp3');
        this.load.audio('jump', './assets/sound/Jump.mp3');
        this.load.audio('levelup', './assets/sound/LevelUp.mp3');
        this.load.audio('bounce', './assets/sound/Bounce.mp3');
        this.load.audio('door', './assets/sound/DoorOpen.mp3');
        this.load.image("1bit_tiles", "./assets/MainTiledSet.png");
        this.load.image('Trap', './assets/Trap.png');
        this.load.tilemapTiledJSON('platform_map', './assets/level1/Level1Map.json');
        

    }

    create() {

        this.bgm = this.sound.add('choco',{     //add background music
            mute : false,
            volume : 0.5,
            rate : 3,
            loop : true
        });

        this.sound.play('choco');

        // add a tilemap
        const map = this.add.tilemap("platform_map");

        // add a tileset to the map
        const tileset = map.addTilesetImage("MainTiledSet", "1bit_tiles");


        // create tilemap layers
        const platforms = map.createStaticLayer("Platforms", tileset, 0, 0);
        // const trapLayer = map.createStaticLayer("Trap", tileset, 0, 0);

        platforms.setCollisionByProperty({ collides: true });

        // variables and settings
        this.ACCELERATION = 500;
        this.MAX_X_VEL = 600;   // pixels/second
        this.MAX_Y_VEL = 3000;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -1000;
        this.physics.world.gravity.y = 3500;

        // set bg
        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg1').setOrigin(0, 0);

        // print Scene name
        this.add.text(game.config.width / 2, 30, 'level1', { font: '14px Futura', fill: '#32CD32' }).setOrigin(0.5);

        // set up robot
        this.robot = this.physics.add.sprite(150, 350, 'player').setScale(1.2).setOrigin(0);
        // this.robot.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.robot.setCollideWorldBounds(true);
        this.robot.setDepth(99999);

        // add physics collider
        this.physics.add.collider(this.robot, platforms);

        //color squares
        this.color = new Color(this, 370, 410, 'black').setOrigin(0, 0);
        this.color.setDepth(99999);

        //door
        this.door = new Door(this, 580, 0, 'door').setOrigin(0, 0);
        this.door.setDepth(99999);
        this.door.alpha = 0;
        

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        const spikeObjects = map.getObjectLayer('Trap')['objects'];

        spikeObjects.forEach(spikeObject => {
            // Add new spikes to our sprite group
            const spike = this.spikes.create(spikeObject.x + 18, spikeObject.y, 'Trap').setOrigin(1, 1);

            this.physics.add.collider(this.robot, this.spikes, robotHit, null, this);

        });

        //cheater for debugging
        this.input.keyboard.on('keydown', (event) => {
            switch (event.key) {
                case '1':
                    this.scene.start("level1Scene");
                    break;
                case '2':
                    this.scene.start("level2Scene");
                    break;
                default:
                    break;
            }
        });

        this.canJump = true;
    }

    update() {

        // check collisions
        if (this.checkCollision(this.robot, this.color)) {
            this.colorExplode(this.color);
            this.door.alpha = 1;
            // this.robotExplode(this.robot.x,this.robot.y);
        }

        if (this.checkCollision(this.robot, this.door)) {
            this.doorExplode(this.door);
            // this.robotExplode(this.robot.x,this.robot.y);
        }

        // check keyboard input
        if (cursors.left.isDown) {
            if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
                this.robot.body.setVelocityX(0);
                // play walking sound
                if (this.robot.body.onFloor()) {
                    this.sound.play('walk');
                }
            }
            this.robot.body.setAccelerationX(-this.ACCELERATION);
            this.robot.setFlip(true, false);
            // play(key [, ignoreIfPlaying] [, startFrame])
            //this.robot.anims.play('walk', true);
        } else if (cursors.right.isDown) {
            if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
                this.robot.body.setVelocityX(0);
                // play walking sound
                if (this.robot.body.onFloor()) {
                    this.sound.play('walk');
                }
            }
            this.robot.resetFlip();
            this.robot.body.setAccelerationX(this.ACCELERATION);
            //this.robot.anims.play('walk', true);
        } else {
            // set acceleration to 0 so DRAG will take over
            this.robot.body.setAccelerationX(0);
            this.robot.body.setDragX(this.DRAG);
            //this.robot.anims.play('idle');
        }

        // jump & bounce

        if (this.robot.body.onFloor() && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.robot.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play('jump');
        }

        this.physics.world.wrap(this.robot, this.robot.width / 2);
    }

    checkCollision(robot, obstacle) {
        // simple AABB checking
        if (robot.x < obstacle.x + obstacle.width &&
            robot.x + robot.width > obstacle.x &&
            robot.y < obstacle.y + obstacle.height &&
            robot.height + robot.y > obstacle.y) {
            return true;
        } else {
            return false;
        }
    }

    //Destoring the door when collides
    colorExplode(obstacle) {
        //temporarily hide obstacle
        obstacle.alpha = 0;
        this.color.y = 450
        this.sound.play('levelup');
        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg3').setOrigin(0, 0);
        this.door.y = 356;

    }

    doorExplode(obstacle) {    // change level 
        obstacle.alpha = 0;
        this.sound.play('door');
        this.scene.start('level2Scene');

    }
}
function robotHit(robot, spike) {
    // Set velocity back to 0
    this.robot.setVelocity(0, 0);
    // Put the player back in its original position
    this.robot.setX(260);
    this.robot.setY(300);
    // Set the visibility to 0 i.e. hide the player
    this.robot.setAlpha(0);
    // Add a tween that 'blinks' until the player is gradually visible
    let tw = this.tweens.add({
        targets: this.robot,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
    });
}