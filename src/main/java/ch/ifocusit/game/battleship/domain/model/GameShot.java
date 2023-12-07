package ch.ifocusit.game.battleship.domain.model;

import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;
import jakarta.validation.constraints.NotNull;

public record GameShot(@NotNull PlayerId target, @NotNull Coordinate coords) {
}
