package ch.ifocusit.game.battleship.domain.model;

public enum PlayerId {
    player1, player2;

    public static PlayerId inverse(PlayerId playerId) {
        return player1.equals(playerId) ? player2 : player1;
    }

    public PlayerId reverse() {
        return this.equals(player1) ? player2 : player1;
    }
}
