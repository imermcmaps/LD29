Projectile = function (game, x, y, sprite, damage) {
    Phaser.Sprite.call(this, game.game, x, y, sprite);
    game.physics.enable(this);
    this.damage = damage || 1;
    this._game = game;
    this.body.bounce.setTo(0, 0);
    this.anchor.setTo(.5, .5);
    game.add.existing(this);
};
Projectile.prototype = Object.create(Phaser.Sprite.prototype);

Projectile.prototype.constructor = Projectile;
Projectile.prototype.update = function () {
    if (this.y < 400) {
        this.body.velocity.y += 2;
        this.angle = Math.atan2(this.body.velocity.y, this.body.velocity.x) * 180 / Math.PI;
    }
};
Torpedo = function (game, e, damage) {
    Projectile.call(this, game, e.x, e.y + e.height * .5 - 5, 'torpedo', damage);
    this.owner = e;
    this.animations.add('loop', [0, 1, 2], 6, true);
    this.animations.play('loop');
    this.scale.x = 2.5;
    this.scale.y = 2.5;
    this.events.onOutOfBounds.add(function () {
        this.destroy();
    }, this);
    var self = this;
    this.explode = function () {
        this._game.sound.play('aExplosion', .5);
        var explosion = self._game.effects.create(self.x, self.y, 'explosion');
        self._game.physics.enable(explosion);
        if (self.body.velocity.x < 0 + self.width) {
            explosion.x -= self.width;
        } else {
            explosion.x += self.width;
        }
        explosion.scale.x = 5 + e.torpedoBonus.explosion;
        explosion.scale.y = 5 + e.torpedoBonus.explosion;
        explosion.y -= explosion.height / 2;
        explosion.damage = self.damage / 4;
        explosion.animations.add('boom', [0, 1, 2, 3, 4], 8);
        explosion.animations.play('boom', null, false, true);
        // TODO: figure out how to remove this hack
        setTimeout(function () {
            self._game.physics.arcade.overlap(explosion, self._game.enemies, function (exp, enemy) {
                enemy.damagedBy(explosion);
            })
        }, 50);
    };
    this.body.velocity.x = 300 + e.torpedoBonus.speed;
    if (e.scale.x < 0) {
        this.body.velocity.x *= -1;
    }
    this.body.velocity.y = e.body.velocity.y * .5;
    this.body.allowRotation = false;
    this.angle = Math.atan2(this.body.velocity.y, this.body.velocity.x) * 180 / Math.PI;
    this.events.onKilled.add(function () {
        this.explode();
        // force cleanup by setting out of bounds
        this.x = 1000000;
        this.y = 1000000;
    }, this);
};
Torpedo.prototype = Object.create(Projectile.prototype);
Torpedo.prototype.constructor = Torpedo;