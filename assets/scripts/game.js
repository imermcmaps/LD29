window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: function () {
        this.load.image("loadingBarEmpty", 'assets/images/loadingBarEmpty.png');
        this.load.image("loadingBarFull", 'assets/images/loadingBarFull.png');
        this.load.onLoadComplete.addOnce(function () {
            game.state.start('preload');
        })
    }}, false, false);
    game.state.add('preload', StatePreloader);
    game.state.add('menu', StateMenu);
    game.state.add('game', StateGame);
};
var StateGame = function (game) {

};
StateGame.prototype = {
    create: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#051c36';
        this.world.setBounds(0, 0, 800 * 10 /* loop background 10 times*/, 3000);
        this.physics.setBoundsToWorld();
        this.background = this.add.tileSprite(0, 0, this.world.bounds.width, 3000, 'backgroundScaled');
        this.backgroundColor = '#051c36';

        this.upgradeShip = this.add.sprite(780, 376, 'UpgradeShip');
        this.physics.enable(this.upgradeShip);
        this.upgradeShip.body.immovable = true;
        this.upgradeShip.anchor.setTo(0.5857142857142857, 0.5142857142857143); // 41, 18
        this.upgradeShip.body.setSize(48, 28);
        this.upgradeShip.scale.x = this.upgradeShip.scale.y = 5;

        this.upgradeShipPickup = this.add.sprite(595, 376 + 60, 'UpgradeShipPickup');
        this.upgradeShipPickup.scale.x = this.upgradeShipPickup.scale.y = 5;
        this.physics.enable(this.upgradeShipPickup);
        this.upgradeShipPickup.body.immovable = true;
        this.upgradeShipPickup.anchor.setTo(0.5, 0.5);
        this.upgradeShipPickup.body.setSize(10, 10);

        this.player = new Player(this, 10, 500);
        this.camera.follow(this.player);
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.boss = new Jellyfish(this, 1543, 1562, {gold: 100}, 20);
        this.boss.scale.x = this.boss.scale.y = 20;
        this.wander = false;
        this.boss.persistant = true;
        this.enemies.add(this.boss);
        this.boss.events.onDamage.add(function () {
            n = Math.random() * 10;
            for (i = 0; i < n; i++) {
                var e = new Jellyfish(this, this.boss.x + (Math.random() - .5) * 100, this.boss.y + (Math.random() - .5) * 100, {}, .5);
                this.enemies.add(e);
            }
        }, this);
        this.boss.events.onKilled.add(function () {
            this.win.revive()
        }, this)
        this.loot = this.add.group();
        this.loot.enableBody = true;
        this.loot.physicsBodyType = Phaser.Physics.ARCADE;

        this.projectiles = this.add.group();
        this.projectiles.enableBody = true;
        this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;

        this.effects = this.add.group(); // for ordering
        this.effects.enableBody = true;
        this.effects.physicsBodyType = Phaser.Physics.ARCADE;

        this.light = this.add.tileSprite(0, 0, this.world.bounds.width, 3000, 'light');
        this.light.blendMode = PIXI.blendModes.MULTIPLY;

        this.gameOverTitle = this.add.sprite(112, 30, 'gameOver')
        this.gameOverTitle.fixedToCamera = true;
        this.gameOverTitle.scale.x = this.gameOverTitle.scale.y = 9;
        this.gameOverTitle.kill();
        this.upgradeScreen = new UpgradeScreen(this, this.player, 0, 0);
        this.upgradeScreen.fixedToCamera = true;
        this.upgradeScreen.kill();
        this.win = this.add.sprite(0, 0, 'win');
        this.win.fixedToCamera = true;
        this.win.scale.x = this.win.scale.y = 10;
        this.win.kill();
        this.spawnEnemy();
        // INPUT
        this.upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.fireKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.time.events.loop(Phaser.Timer.SECOND, this.spawnEnemy, this);


    },
    render: function () {
        //this.game.debug.body(this.upgradeShipPickup);
        //this.game.debug.body(this.boss);
        //this.projectiles.forEach(function(e){this.game.debug.body(e);}, this);
        //this.enemies.forEach(function(e){this.game.debug.body(e);}, this);
    },
    update: function () {
        if (this.player.alive) {
            // controls
            // TODO: add alternative/touch compatible controls - possibly a setting for that?
            if (this.upKey.isDown) {
                this.player.move(0);
            }
            if (this.downKey.isDown) {
                this.player.move(1);
            }
            if (this.leftKey.isDown) {
                this.player.move(2);
            }
            if (this.rightKey.isDown) {
                this.player.move(3);
            }
            if (this.fireKey.isDown) {
                this.player.fire();
            }
        }

        if (this.enemies.length > 0) {
            if (this.projectiles.length > 0) {
                this.physics.arcade.collide(this.enemies, this.projectiles, function (enemy, projectile) {
                    if (projectile.owner == enemy) {
                        return;
                    }
                    enemy.damagedBy(projectile);
                    projectile.kill();
                }, null, this);
            }
            if (this.player.exists) {
                this.physics.arcade.collide(this.player, this.enemies, function (player, enemy) {
                    player.damagedBy(enemy);
                }, null, this);
                this.physics.arcade.collide(this.player, this.upgradeShipPickup, function () {
                    this.upgradeScreen.revive();
                }, null, this);
            }
        }
        if (this.loot.length > 0) {
            this.physics.arcade.collide(this.player, this.loot, function (player, loot) {
                player.changeCoins(1);
                loot.kill();
            }, null, this);
        }

    },
    enemyRegion: [

        {
            enemy: Jellyfish,
            difficulty: 1,
            args: {color: 0xFFB2F4, gold: 1},
            top: 475,
            bottom: 475 + 932,
            left: 0,
            right: 1232
        },
        {
            enemy: Jellyfish,
            difficulty: 3,
            args: {color: 0xB2FFFF, gold: 3, speed: 2},
            top: 475,
            bottom: 475 + 932,
            left: 1200,
            right: 2000
        },
        {
            enemy: Jellyfish,
            difficulty: 8,
            args: {color: 0xFFC6B2, gold: 5, speed: 5},
            top: 475,
            bottom: 475 + 932,
            left: 1950,
            right: 3000
        },
        {
            enemy: Pufferfish,
            difficulty: 1,
            args: {color: 0xFFB2F4, gold: 1},
            top: 1107,
            bottom: 1107 + 600,
            left: 0,
            right: 1232
        },
        {
            enemy: Pufferfish,
            difficulty: 3,
            args: {color: 0xB2FFFF, gold: 3, speed: 1.5},
            top: 1107,
            bottom: 1107 + 600,
            left: 1200,
            right: 2000
        },
        {
            enemy: Pufferfish,
            difficulty: 8,
            args: {gold: 5, speed: 2},
            top: 1107,
            bottom: 1107 + 600,
            left: 1950,
            right: 3000
        },

    ],
    spawnEnemy: function () {
        if (!this.player.exists || Math.random() > .2) {
            return;
        }
        //var e = new Jellyfish(this, 500, 600,{color: 0xFFFFFF} , 1);
        var possible = [];
        for (var i = 0; i < this.enemyRegion.length; i++) {
            var er = this.enemyRegion[i];
            if (this.player.x >= er.left && this.player.x <= er.right && this.player.y >= er.top && this.player.y <= er.bottom) {
                possible.push(er);
            }
        }
        if (!possible.length) {
            return;
        }
        var et = possible[Math.floor(Math.random() * possible.length)];
        var sX = Math.ceil(Math.random() - .5);
        var sY = Math.ceil(Math.random() - .5);
        this.enemies.add(new et.enemy(this, this.player.x + sX * (100 + Math.random() * 300), this.player.y + sY * (100 + Math.random() * 300), et.args, et.difficulty));
    },
    gameOver: function () {
        this.gameOverTitle.revive();
        this.gameOverTitle.inputEnabled = true;
        this.gameOverTitle.input.useHandCursor = true;
        this.input.onTap.addOnce(function () {
            this.game.state.start('menu');
        }, this);
    }
};