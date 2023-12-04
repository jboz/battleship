package ch.ifocusit.game.battleship.domain.model.events;

import ch.ifocusit.game.battleship.domain.model.PlayerId;

public record PlayerJoinedEvent(String gameCode, String joinedPlayerName) implements Event {
    @Override
    public String channel() {
        return gameCode + "-" + PlayerId.player1;
    }
}
