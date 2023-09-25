package ch.ifocusit.game.battleship.domain.model;

import jakarta.validation.constraints.NotNull;

public record GameHit(@NotNull PlayerId target, @NotNull Coordinate coords) {
}
