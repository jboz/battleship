package ch.ifocusit.game.battleship.domain.model.boards;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

import ch.ifocusit.game.battleship.domain.model.tile.Tile;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PROTECTED)
public abstract class Board<T extends Tile> {
    @Getter
    List<T> tiles = new ArrayList<>();

    public void forEach(Consumer<T> consumer) {
        tiles.forEach(consumer);
    }
}
