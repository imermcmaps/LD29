var StatePreloader = function (game) {
    this.loadingText = null;
    this.loadingBarEmpty = null;
    this.loadingBarFull = null;
    this.oGroup = null;
}
StatePreloader.prototype = {
    preload: function () {

        this.oGroup = this.add.group(); // for ordering
        this.loadingText = this.add.text(this.world.centerX - 110, this.world.centerY - 25, "Loading... 0%", {font: '32px Arial', fill: '#FFFFFF', align: 'center', shadowOffsetX: 2, shadowOffsetY: 2, shadowColor: '#666666', shadowBlur: 3})
        this.loadingBarEmpty = this.oGroup.create(this.world.centerX - 240, this.world.centerY + 25, "loadingBarEmpty");
        this.loadingBarFull = this.oGroup.create(this.world.centerX - 240, this.world.centerY + 25, "loadingBarFull");
        this.load.setPreloadSprite(this.loadingBarFull);
        this.load.onFileComplete.add(function (progress) {
            this.loadingText.setText("Loading... " + Math.round(this.load.progressFloat) + "%");

        }, this);

        // MENU ASSETS
        this.load.image("backgroundMenu", 'assets/images/backgroundMenu.png');
        this.load.spritesheet("startGame", 'assets/images/startGame.png', 28, 5);
        // GAME ASSETS
        this.load.image("backgroundScaled", 'assets/images/backgroundScaled.png');
        this.load.image("light", 'assets/images/light.png');
        this.load.spritesheet("submarine", 'assets/images/submarine.png', 17, 11);
        this.load.spritesheet("torpedo", 'assets/images/torpedo.png', 20, 4);
        this.load.spritesheet("explosion", 'assets/images/explosion.png', 10, 10);
        this.load.spritesheet("jellyfish", 'assets/images/jellyfish.png', 20, 26);
        this.load.spritesheet("pufferfish", 'assets/images/pufferfish.png', 26, 17);
        this.load.spritesheet("healthBar", 'assets/images/healthBar.png', 20, 3);
        this.load.image("healthBarBigFull", 'assets/images/healthBarBigFull.png');
        this.load.image("healthBarBigEmpty", 'assets/images/healthBarBigEmpty.png');
        this.load.image("healthBarFull", 'assets/images/healthBarFull.png');
        this.load.image("cookie", 'assets/images/cookie.png');
        this.load.image("lightRound", 'assets/images/lightRound.png');
        this.load.image("gameOver", 'assets/images/gameover.png');
        this.load.image("win", 'assets/images/win.png');
        this.load.image("coin", 'assets/images/coin.png');
        // upgrade gui
        this.load.image('upgrade', 'assets/images/upgrade.png');
        this.load.spritesheet("UpgradeAddHealth", 'assets/images/UpgradeAddHealth.png', 15, 7);
        this.load.spritesheet("UpgradeAddRegen", 'assets/images/UpgradeAddRegen.png', 19, 7);
        this.load.spritesheet("UpgradeAddDamage", 'assets/images/UpgradeAddDamage.png', 18, 7);
        this.load.spritesheet("UpgradeAddSpeed", 'assets/images/UpgradeAddSpeed.png', 18, 9);
        this.load.spritesheet("UpgradeAddExplosion", 'assets/images/UpgradeAddExplosion.png', 17, 7);
        this.load.spritesheet("UpgradeClose", 'assets/images/UpgradeClose.png', 7, 7);
        this.load.image("UpgradeShip", 'assets/images/UpgradeShip.png');
        this.load.image("UpgradeShipPickup", 'assets/images/UpgradeShipPickup.png');
        // GAME SOUNDS YAAAY
        this.load.audio('aExplosion','assets/sounds/explosion.ogg', true);
        this.load.audio('aTorpedoShoot','assets/sounds/torpedoshoot.ogg', true);
        this.load.audio('hurt','assets/sounds/hurt.ogg', true);
        this.load.audio('coin','assets/sounds/coin.ogg', true);
        this.load.onLoadComplete.addOnce(function () {
            this.state.start('menu');
        }, this);
    },

    create: function () {
    },
    update: function () {

    }

};