package ch.ifocusit.game.battleship.domain.model;

import ch.ifocusit.game.battleship.domain.model.boards.home.HomeBoard;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GameJoining(@NotBlank String player, @NotNull HomeBoard board) {
}
