import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene {
   /** @type {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} */
   boy
   /** @type {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} */
   heart
   /** @type {Phaser.Physics.Arcade.Group} */
   hearts
   /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
   cursor
   /** @type {Number} */
   score
   /** @type {Phaser.GameObjects.Text} */
   placar
   /** @type {Phaser.Sound.BaseSound} */
   eating
   /** @type {Phaser.Sound.BaseSound} */
   bgsound

   constructor() {
      super('game')
      this.score = 0
   }

   preload() {
      this.load.image('bground', 'assets/background.png',)
      this.load.spritesheet('boy', 'assets/boy.png', { frameWidth: 66, frameHeight: 100 })
      this.load.spritesheet('heart', 'assets/heart.png', { frameWidth: 93, frameHeight: 86 })
      this.load.audio('eating', 'assets/pacman_eatfruit.mp3')
      this.load.audio('bgsound', 'assets/mixkit-dance-with-me-3.mp3')
   }

   create() {
      this.eating = this.sound.add('eating')
      this.bgsound = this.sound.add('bgsound').play({ loop: true, volume: 0.1, mute: true })

      // this.cameras.main.setBackgroundColor(0x00ff00)
      this.cameras.main.setBounds(-528, -160, 1536, 960)
      this.physics.world.setBounds(-528, -160, 1536, 960)
      this.cameras.main.setZoom(0.7)

      this.add.image(240, 320, 'bground').setScale(0.8, 0.8)

      this.boy = this.physics.add.sprite(240, 320, 'boy').setSize(60, 76).setOffset(3, 17).setCollideWorldBounds(true)
      this.boyAnimate()
      this.cameras.main.startFollow(this.boy);

      this.hearts = this.physics.add.group()
      for (let i = 0; i < 10; i++) {
         this.heart = this.hearts.create(Phaser.Math.Between(50, 430), Phaser.Math.Between(50, 600), 'heart')
            .setScale(0.5)
            .setVelocityX(Phaser.Math.Between(-2, 2) * 100)
            .setVelocityY(Phaser.Math.Between(-2, 2) * 100)
            // .setImmovable(true)
            .setCollideWorldBounds(true).setBounce(1)
         this.heartAnimate()
         this.heart.play('pulse')
      }

      this.physics.add.collider(this.boy, this.hearts, this.boyHeartCollider, null, this)

      this.placar = this.add.text(240, 10, 'Placar: 0').setOrigin(0.5, 0).setScrollFactor(0)

      this.cursor = this.input.keyboard.createCursorKeys()
   }

   update() {
      this.boy.setVelocity(0)
      if (this.cursor.left.isDown) {
         this.boy.setVelocityX(-200)
         if (this.boy.anims.getName() != 'left') this.boy.play('left')
      } else if (this.cursor.right.isDown) {
         this.boy.setVelocityX(200)
         if (this.boy.anims.getName() != 'right') this.boy.play('right')
      } else if (this.cursor.up.isDown) {
         this.boy.setVelocityY(-200)
         if (this.boy.anims.getName() != 'up') this.boy.play('up')
      } else if (this.cursor.down.isDown) {
         this.boy.setVelocityY(200)
         if (this.boy.anims.getName() != 'down') this.boy.play('down')
      } else {
         this.boy.play('stop')
      }
   }

   /**
    * 
    * @param {Phaser.GameObjects.Sprite} boy 
    * @param {Phaser.GameObjects.Sprite} heart 
    */
   boyHeartCollider(boy, heart) {
      heart.setX(Phaser.Math.Between(50, 430))
         .setY(Phaser.Math.Between(50, 600))
         .setVelocityX(Phaser.Math.Between(-2, 2) * 100)
         .setVelocityY(Phaser.Math.Between(-2, 2) * 100)

      this.score++
      this.placar.text = `Placar: ${this.score}`
      this.eating.play()
   }

   boyAnimate() {
      this.boy.anims.create({
         key: 'left',
         repeat: -1,
         frameRate: 15,
         frames: this.anims.generateFrameNames('boy', { start: 8, end: 11 })
      })
      this.boy.anims.create({
         key: 'right',
         repeat: -1,
         frameRate: 15,
         frames: this.anims.generateFrameNames('boy', { start: 12, end: 15 })
      })
      this.boy.anims.create({
         key: 'up',
         repeat: -1,
         frameRate: 15,
         frames: this.anims.generateFrameNames('boy', { start: 4, end: 7 })
      })
      this.boy.anims.create({
         key: 'down',
         repeat: -1,
         frameRate: 15,
         frames: this.anims.generateFrameNames('boy', { start: 0, end: 3 })
      })
      this.boy.anims.create({
         key: 'stop',
         repeat: -1,
         frameRate: 15,
         frames: this.anims.generateFrameNames('boy', { start: 0, end: 0 })
      })
   }

   heartAnimate() {
      this.heart.anims.create({
         key: 'pulse',
         repeat: -1,
         frameRate: 3,
         frames: this.anims.generateFrameNames('heart', { start: 0, end: 1 })
      })
   }
}