package ch.ifocusit.game.battleship.domain.model.events;

import ch.ifocusit.game.battleship.domain.model.PlayerId;

public record FinishEvent(String code, PlayerId winner) implements Event {
    @Override
    public String channel() {
        return code;
    }
}

