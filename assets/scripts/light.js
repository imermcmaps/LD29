Light = function (game, x, y, strength) {
    Phaser.Sprite.call(this, game.game, x, y, 'lightRound');
    //this.blendMode = PIXI.blendModes.;
    this.alpha = .5;
    this.scale.x = strength || 1;
    this.scale.y = strength || 1;
    this._game = game;
    game.add.existing(this);
};
Light.prototype = Object.create(Phaser.Sprite.prototype);

Light.prototype.constructor = Light;