package ch.ifocusit.game.battleship.domain.model.events;

public record FinishEvent(String gameCode, String winner) implements Event {
    @Override
    public String channel() {
        return gameCode;
    }
}
