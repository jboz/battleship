package ch.ifocusit.game.battleship.domain.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GameJoining(@NotBlank String player, @NotNull Board board) {
}
