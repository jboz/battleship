package ch.ifocusit.game.battleship.domain.model.boards.home;

import java.util.List;

import ch.ifocusit.game.battleship.domain.model.tile.Tile;

public record Ship(String id, int size, List<? extends Tile> tiles) {
}
