package ch.ifocusit.game.battleship.domain.model.events;

import ch.ifocusit.game.battleship.domain.model.PlayerId;
import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;

public record ShotEvent(String gameCode, PlayerId player, Coordinate shot) implements Event {
    @Override
    public String channel() {
        return gameCode + "-" + player;
    }
}
