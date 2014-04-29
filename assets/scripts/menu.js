var StateMenu = function (game) {
}
StateMenu.prototype = {
    create: function () {
        var self = this;
        this.background = this.add.sprite(0, 0, 'backgroundMenu');
        this.background.scale.x = 10;
        this.background.scale.y = 10;
        this.backgroundColor = '#051c36';
        this.startGame = this.add.button(25, 250, 'startGame', function () {
            self.state.start('game');
        }, 2, 1, 0);
        this.startGame.scale.x = 5;
        this.startGame.scale.y = 5;
        // skip the menu for now
        self.state.start('game', true);
    },
    update: function () {

    }

};