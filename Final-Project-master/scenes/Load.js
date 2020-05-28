class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // load player
        this.load.path = "assets/player/";
        this.load.image('player', 'player.png');
        // load level1 assets
        this.load.path = "assets/level1/";
        this.load.image('bg1', 'Level1-1.png');
        // load level2 assets
        this.load.path = "assets/level2/";
        this.load.image('bg2', 'Level2-1.png');
    }


    create() {
        // ...and pass to the next Scene
        this.scene.start("level1Scene");
    }
}