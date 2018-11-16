/* global game, Phaser, playState, menuState, mainMenuState */

var playState = {

    preload: function() {
        // scale the game if it's on a device
        if (!game.device.desktop) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.stage.backgroundColor = '#8185d5';

        // preload pipes and banana
        game.load.image('bird', 'assets/images/banana.png');
        game.load.image('pipe', 'assets/images/pipe.png');

        // load the jump sound
        game.load.audio('jump', 'assets/audio/jump.m4a');
    },

    create: function() {
        // this is the physics function/options
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // create our pipes group
        this.pipes = game.add.group();

        // our timer
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        // add bird to the stage
        this.bird = game.add.sprite(100, 245, 'bird');

        // enable physics on our bird
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;

        // new anchor position
        this.bird.anchor.setTo(-0.2, 0.5);

        // create our jump key
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        game.input.onDown.add(this.jump, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {font: "30px Bluberry Regular", "#ffffff"});
        this.labelScore.setShadow(-2, 2, 'rgba(0, 0, 0, 1)' 0);

        // add the jump sound
        this.jumpSound = game.add.audio('jump');
        this.jumpSound.volume = 0.2;

    },

    update: function() {
      // restart the game if our player went off stage
      if (this.bird.y < 0 || this.bird.y > game.world.height) {
          this.restartGame();
      }

      // call the hitPipe method if our player and pipes overlap
      game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

      // rotate player to a certain point
      if (this.bird.angle < 20) {
          this.bird.anfle += 1;
      }
    },
    jump: function () {
      // if player dead, he/she can't jump
      if (this.bird.alive == false) {
          return;
      }
      this.bird.body.velocity.y = -350;

      // jump animation
      game.add.tween(this.bird).to({angle: -20}, 100).start();

      // Play sound
      //this.jumpSound.play();
    },
      hitPipe: function() {
        // if player has already hit a pipe, we have nothing to do
        if (this.bird.alive == false) {
            return;
        }
        // set alive property to false
        this.bird.alive = false;

        // prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // go through all pipes and stop their movement
        this.piper.forEach(function(p) {
          p.body.velocity.x = 0;
        }, this);
      },
        restartGame: function() {
          //displays the restart menu
          game.state.start('menu');
        },

        addPipe: function(x, y) {
            var pipe = game.add.sprite(x, y, 'pipe');
            this.pipes.add(pipe);
            game.physics.arcade.enable(pipe); // enable physics on pipe

            pipe.body.velocity.x = -200;
            pipe.checkWorldBounds = true;
            pipe.outOfBoundsKill = true;
        },

        addRowOfPipes: function() {
          var hole = Math.floor(Math.random()*5)+1;

          for (var i = 0; i <10; i++) {
            if (i != hole && i != hole+1) {
              this.addPipe(400, i*65);
            }
          }
          this.score += 1;
          this.labelScore.text = this.score;
        }
};
