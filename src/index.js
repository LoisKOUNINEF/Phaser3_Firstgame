import Phaser from 'phaser';
import sky from './assets/sky.png';
import platform from './assets/platform.png';
import star from './assets/star.png';
import bomb from './assets/bomb.png';
import dude from './assets/dude.png';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload () {
        this.load.image('sky', sky);
        this.load.image('platform', platform)
        this.load.image('star', star);
        this.load.image('bomb', bomb);

        this.load.spritesheet('dude', dude, {
            frameWidth: 32,
            frameHeight: 48,
        });
    }
      
    create () {
        this.add.image(400, 300, 'sky');

        const platforms = this.physics.add.staticGroup();

        // platforms & collision
        platforms.create(400, 560, 'platform').setScale(2).refreshBody();

        platforms.create(600, 400, 'platform')
        platforms.create(50, 250, 'platform')
        platforms.create(750, 220, 'platform')

        this.player = this.physics.add.sprite(100, 400, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, platforms);

        // animations
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame:4 }],
            frameRate: 20,
        });
        this.anims.create({
            key:"right",
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key:"left",
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        // stars
        const stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });
        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(this.player, stars, collectStars, null, this);

        function collectStars(player, star) {
            star.disableBody(true, true);
        }

        // bombs
        const bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(this.player, bombs, bombTouched, null, this);

        function bombTouched(player, bomb) {
            this.physics.pause();
            this.player.setTint(0xff000);
            this.player.anims.play("turn");
        }

    }

    update() {
        const cursors = this.input.keyboard.createCursorKeys();
        if(cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if(cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-420);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 450 },
            debug: false,
        },
    },
    scene: MyGame,
};

const game = new Phaser.Game(config);
