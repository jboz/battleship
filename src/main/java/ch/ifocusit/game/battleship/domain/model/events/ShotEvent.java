package ch.ifocusit.game.battleship.domain.model.events;

import ch.ifocusit.game.battleship.domain.model.PlayerId;
import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;

public record ShotEvent(String gameCode, PlayerId source, Coordinate shot, boolean touched, PlayerId nextPlayer)
        implements Event {
    @Override
    public String channel() {
        return gameCode;
    }
}
