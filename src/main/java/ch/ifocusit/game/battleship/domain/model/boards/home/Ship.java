package ch.ifocusit.game.battleship.domain.model.boards.home;

import java.util.List;

import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;
import ch.ifocusit.game.battleship.domain.model.tile.Tile;

public record Ship(String id, int size, List<? extends Tile> tiles) {

    public boolean contains(Coordinate coords) {
        return tiles.stream().anyMatch(tile -> tile.getCoord().equals(coords));
    }

    public boolean isDestroyed() {
        return tiles.stream().allMatch(tile -> tile.isHitted());
    }
}
