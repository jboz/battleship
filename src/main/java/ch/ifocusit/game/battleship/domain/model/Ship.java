package ch.ifocusit.game.battleship.domain.model;

import java.util.List;

public record Ship(
        String name,
        int size,
        String color,
        boolean placed,
        List<Zone> zones) {
}
