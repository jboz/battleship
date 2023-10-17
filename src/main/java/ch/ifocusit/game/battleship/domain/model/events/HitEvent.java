package ch.ifocusit.game.battleship.domain.model.events;

import ch.ifocusit.game.battleship.domain.model.PlayerId;
import ch.ifocusit.game.battleship.domain.model.boards.attack.AttackBoard;

public record HitEvent(String code, PlayerId player, AttackBoard hits) implements Event {
    @Override
    public String channel() {
        return code;
    }
}
