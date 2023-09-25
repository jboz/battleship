package ch.ifocusit.game.battleship.domain.model.events;

import ch.ifocusit.game.battleship.domain.model.Player;

public record PlayerEvent(String code, Player player) implements Event {
    @Override
    public String channel() {
        return code + "-" + player.id();
    }
}
