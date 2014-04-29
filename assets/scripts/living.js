Living = function (game, x, y, sprite, damage, health, maxHealth, showHealthbar) {
    Phaser.Sprite.call(this, game.game, x, y, sprite);
    game.physics.enable(this);
    this.health = health || 1;
    this.maxHealth = maxHealth || health || 1;
    this.damage = damage;
    this.enableHealthbar = showHealthbar || true;
    this.alive = true;
    if (showHealthbar) {
        this.healthBarEmpty = game.add.sprite(-this.width / 2, -4 * this.scale.y - this.height / 2, 'healthBar', 0);
        this.healthBar = game.add.sprite(-this.width / 2, -4 * this.scale.y - this.height / 2, 'healthBarFull');
        this.addChild(this.healthBar);
        this.addChild(this.healthBarEmpty);
        this.events.onKilled.add(function () {
            this.healthBar.kill();
            this.healthBarEmpty.kill();
        }, this);
    }
    this.events.onKilled.add(function () {
        this.alive = false;
    });
    this.anchor.setTo(.5, .5);
    this.body.bounce.setTo(0, 0);
    this.body.drag.x = 300;
    this.body.drag.y = 300;
    this._game = game;
    this.events.onDamage = new Phaser.Signal();
    game.add.existing(this);

};
Living.prototype = Object.create(Phaser.Sprite.prototype);
Living.prototype.revive = function () {
    // reset stats
    this.health = this.maxHealth;
    this.alive = true;
    Phaser.Sprite.prototype.revive.call(this);
}
Living.prototype.damagedBy = function (attacker) {
    this.health -= attacker.damage;

    if (this.health <= 0) {
        this.killByDamage(attacker);
        this.kill();
    } else {
        this.events.onDamage.dispatch();
        if (typeof(this.healthBar) !== "undefined") {
            this.healthBar.crop({x: 0, y: 0, width: (this.health / this.maxHealth) * 18 + 2, height: 3});
        }
    }
};

Living.prototype.killByDamage = function (attacker) {};
Living.prototype.update = function () {
    if (this.y < 500 && this.body.velocity.y < 0) {
        this.body.velocity.y = -this.body.velocity.y;
    }
};

Living.prototype.constructor = Living;

/* ##############################################
 * ################### Player ###################
 * ##############################################
 */

Player = function (game, x, y) {
    Living.call(this, game, x, y, "submarine", 5, 100);
    this.scale.x = 5;
    this.scale.y = 5;
    this.body.collideWorldBounds = true;
    this.body.bounce.x = .25;
    this.body.bounce.y = .25;
    this.body.drag.x = 120;
    this.body.drag.y = 120;
    this.body.maxVelocity.x = 175;
    this.body.maxVelocity.y = 150;
    this.body.setSize(this.body.width * .6, this.body.height * .6);
    this.healthBarEmpty = game.add.sprite(game.camera.x + 20, game.camera.y + 20, 'healthBarBigEmpty');
    this.healthBarEmpty.fixedToCamera = true;
    this.healthBar = game.add.sprite(game.camera.x + 20, game.camera.y + 20, 'healthBarBigFull');
    this.healthBarEmpty.scale.x = this.healthBarEmpty.scale.y = this.healthBar.scale.x = this.healthBar.scale.y = 1;
    this.healthBar.fixedToCamera = true;
    this.coinsDisplay = game.add.tileSprite(game.camera.x + 20, game.camera.y + 40, 0, 10, 'coin');
    this.coinsDisplay.width = 0;
    this.coinsDisplay.fixedToCamera=true;
    this.animations.add('default', [0, 1], 10, true);
    h = this.animations.add('hurt', [2, 3], 4, false);
    h.onStart.add(function () {
        this._game.sound.play('hurt', .5);
        this.canBeHurt = false;
    }, this);
    h.onComplete.add(function () {
        this.canBeHurt = true;
        this.animations.play('default');
    }, this);
    this.coins = 0;
    this.canBeHurt = true;
    this.animations.play('default');
    this.lastFired = 0;
    this.events.onKilled.add(function () {
        this._game.gameOver();
    }, this);
    this.updateHealthBar();
    this.regenCycle=100;
    this.currentRegenCycle = 0;
    this.torpedoBonus = {
        damage:0,
        speed:0,
        explosion:0
    };
};
Player.prototype = Object.create(Living.prototype);
Player.prototype.constructor = Living;
Player.prototype.update = function () {
    if (!this.alive) {
        return;
    }
    this.lastFired--;
    if (this.y < 400) {
        this.body.velocity.y = 60;
    }
    this.currentRegenCycle++;
    if (this.currentRegenCycle > this.regenCycle && this.health < this.maxHealth) {
        this.currentRegenCycle=0;
        this.health++;
        this.updateHealthBar();
    }
};
Player.prototype.move = function (dir) {
    if (dir == 0) {
        this.body.velocity.y -= 15;
    }
    if (dir == 1) {
        this.body.velocity.y += 15;
    }
    if (dir == 2) {
        if (this.scale.x > 0)
            this.scale.x *= -1;
        this.body.velocity.x -= 25;
    }
    if (dir == 3) {
        if (this.scale.x < 0)
            this.scale.x *= -1;
        this.body.velocity.x += 25;
    }
};
Player.prototype.fire = function () {
    if (this.lastFired <= 0) {
        this._game.sound.play('aTorpedoShoot', .5);
        var t = new Torpedo(this._game, this, 5+this.torpedoBonus.damage);
        this._game.projectiles.add(t);
        this.lastFired = 30-this.torpedoBonus.speed/4;
    }
};
Player.prototype.damagedBy = function (attacker) {
    if (!this.canBeHurt) {
        return;
    }
    this.animations.play('hurt');
    this.health -= attacker.damage;

    if (this.health <= 0) {
        this.kill();
        this.updateHealthBar();
    } else {
        this.updateHealthBar();
    }
};
Player.prototype.updateHealthBar = function () {
    var width = 2;
    if (this.health > 0) {
        if (this.health >= this.maxHealth) {
            width = 120;
        } else {
            width = (this.health / this.maxHealth) * 116 + 4
        }
    }
    this.healthBar.crop({
        x: 0,
        y: 0,
        width: width,
        height: 16
    });
};
Player.prototype.changeCoins = function (amount) {
    this._game.sound.play('coin');
    this.coins += amount;
    this.coinsDisplay.width = this.coins * 10;
};