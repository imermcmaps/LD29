/* #############################################
 * ################### Enemy ###################
 * #############################################
 */

Enemy = function (game, x, y, sprite, damage, health, maxHealth, showHealthbar) {
    Living.call(this, game, x, y, sprite, damage, health, maxHealth, showHealthbar);
    this.speed = 50;
    this.maxSpeed = new Phaser.Point(100, 100);
    this.gold = 1;
    this.changePointTime = 0;
    this.goto = {x: this.x, y: this.y};
    this.persistant = false;
    this.wander=true;
    game.add.existing(this);
};

Enemy.prototype = Object.create(Living.prototype);

Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    Living.prototype.update.call(this);
    if (!this.alive) {
        return;
    }
    if (this._game.player.exists && this.game.physics.arcade.distanceBetween(this, this._game.player) < 400) {
        this.game.physics.arcade.accelerateToObject(this, this._game.player, this.speed, this.maxSpeed.x, this.maxSpeed.y);
    } else if (this.wander){
        this.changePointTime--;
        if (this.changePointTime < 0) {
            this.changePointTime = 200;
            this.goto = { x: this.x + (Math.random() - .5) + 400, y: this.y + (Math.random() - .5) + 400};
        }
        this.game.physics.arcade.accelerateToXY(this, this.goto.x, this.goto.y, this.speed, this.maxSpeed.x, this.maxSpeed.y);
    }
    if (!this.persistant){
        this.considerRecycling();
    }
};

Enemy.prototype.considerRecycling = function () {
    if ((this.x < this._game.camera.x || this.x > this._game.camera.x + this._game.camera.width || this.y < this._game.camera.y || this.y > this._game.camera.y + this._game.camera.height) && this.game.physics.arcade.distanceBetween(this, this._game.player) > 800) {
        this.destroy();
    }
};
Enemy.prototype.killByDamage = function (attacker) {
    for (i = 0; i < this.gold; i++) {
        var recycle = this._game.loot.getFirstDead();
        if (!recycle) {
            this._game.loot.create(this.x, this.y, 'coin');

        } else {
            recycle.reset(this.x + (Math.random() - .5) * 10, this.y + (Math.random() - .5) * 10);
        }

    }
};

Jellyfish = function (game, x, y, args, difficulty) {
    Enemy.call(this, game, x, y, 'jellyfish', 5 * difficulty, 12 * difficulty, null, true);
    this.speed = 10 * (args.speed || 1);
    this.tint = args.color || 0xFFFFFF;
    this.gold = args.gold || 1;
    this.maxSpeed = new Phaser.Point(25 * (args.speed || 1), 25 * (args.speed || 1));
    this.animations.add('default', [0, 1, 2, 3], 6, true);
    this.animations.play('default');
    this.scale.x = this.scale.y = 2 + (Math.random() - .5);
    this.body.velocity.x = -20;
    this.body.velocity.y = (Math.random() - .5) * 40;
    game.add.existing(this);
};

Jellyfish.prototype = Object.create(Enemy.prototype);

Jellyfish.prototype.constructor = Jellyfish;

Pufferfish = function (game, x, y, args, difficulty) {
    Enemy.call(this, game, x, y, 'pufferfish', 7 * difficulty, 20 * difficulty, null, true);
    this.speed = 50 * (args.speed || 1);
    this.gold = args.gold || 1;
    this.maxSpeed = new Phaser.Point(150 * (args.speed || 1), 150 * (args.speed || 1));
    this.animations.add('default', [0, 1, 2], 4, true);
    this.animations.play('default');
    this.scale.x = this.scale.y = 2 + (Math.random() - .5);
    this.body.velocity.x = -20;
    this.body.velocity.y = (Math.random() - .5) * 40;
    game.add.existing(this);
};

Pufferfish.prototype = Object.create(Enemy.prototype);

Pufferfish.prototype.constructor = Pufferfish;
Pufferfish.prototype.update = function () {
    Enemy.prototype.update.call(this);
    this.angle = Math.atan2(this.body.velocity.y, this.body.velocity.x) * 180 / Math.PI;
    if (Math.abs(this.angle) > 90) {
        if (this.scale.x > 0) {
            this.scale.x *= -1;
        }
        if (this.angle < 0) {
            this.angle += 180;
        } else if (this.angle > 0) {
            this.angle -= 180;
        }

    } else if (this.scale.x < 0) {
        this.scale.x *= -1;
    }
}