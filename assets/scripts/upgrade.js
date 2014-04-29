UpgradeScreen = function (game, player, x, y) {
    Phaser.Sprite.call(this, game.game, x, y, 'upgrade');
    this.addHealth = game.add.button(47, 8, 'UpgradeAddHealth', function () {
        if (player.coins > 9) {
            player.changeCoins(-10);
            player.maxHealth += 40;
            player.updateHealthBar();
            if (player.maxHealth > 300){
                this.addHealth.destroy();
            }
        }
    }, this, 2, 1, 0);
    this.addRegen = game.add.button(47, 15, 'UpgradeAddRegen', function () {
        if (player.coins > 9) {
            player.changeCoins(-10);
            if (player.regenCycle < 15){
                player.regenCycle=3;
                this.addRegen.destroy();
            }else{
                player.regenCycle-=15;
            }
        }
    }, this, 2, 1, 0);
    this.addDamage = game.add.button(47, 23, 'UpgradeAddDamage', function () {
        if (player.coins > 9) {
            player.changeCoins(-10);
            player.torpedoBonus.damage+=10;
            if (player.torpedoBonus.damage > 40){
                this.addDamage.destroy();
            }
        }
    }, this, 2, 1, 0);
    this.addSpeed = game.add.button(47, 31, 'UpgradeAddSpeed', function () {
        if (player.coins > 9) {
            player.changeCoins(-10);
            player.torpedoBonus.speed+=20;
            if (player.torpedoBonus.speed > 90){
                this.addSpeed.destroy();
            }
        }
    }, this, 2, 1, 0);
    this.addExplosion = game.add.button(47, 41, 'UpgradeAddExplosion', function () {
        if (player.coins > 9) {
            player.changeCoins(-10);
            player.torpedoBonus.explosion+=.5;
            if (player.torpedoBonus.explosion > 2){
                this.addExplosion.destroy();
            }
        }
    }, this, 2, 1, 0);
    this.buttonClose = game.add.button(66, 6, 'UpgradeClose', function () {
        this.kill();
    }, this, 2, 1, 0);
    this.addChild(this.addHealth);
    this.addChild(this.addRegen);
    this.addChild(this.addDamage);
    this.addChild(this.addSpeed);
    this.addChild(this.addExplosion);
    this.addChild(this.buttonClose);
    this.events.onRevived.add(function () {
        player.body.velocity.setTo(0,0);
        player.exists = false;
    }, this);
    this.events.onKilled.add(function () {
        player.exists = true;
    }, this);
    this.scale.x = 10;
    this.scale.y = 10;
    this._game = game;
    this.fixedToCamera = true;
    game.add.existing(this);
};
UpgradeScreen.prototype = Object.create(Phaser.Sprite.prototype);

UpgradeScreen.prototype.constructor = UpgradeScreen;