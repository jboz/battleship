package ch.ifocusit.game.battleship.domain.model.events;

import ch.ifocusit.game.battleship.domain.model.Hits;
import ch.ifocusit.game.battleship.domain.model.PlayerId;

public record HitEvent(String code, PlayerId player, Hits hits) implements Event {
    @Override
    public String channel() {
        return code;
    }
}
