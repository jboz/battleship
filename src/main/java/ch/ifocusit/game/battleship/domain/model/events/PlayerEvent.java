package ch.ifocusit.game.battleship.domain.model.events;

import ch.ifocusit.game.battleship.domain.model.Player;

public record PlayerEvent(String gameCode, Player player) implements Event {
    @Override
    public String channel() {
        return gameCode + "-" + player.id();
    }
}
