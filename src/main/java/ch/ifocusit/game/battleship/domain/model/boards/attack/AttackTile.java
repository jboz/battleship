package ch.ifocusit.game.battleship.domain.model.boards.attack;

import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;
import ch.ifocusit.game.battleship.domain.model.tile.Tile;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttackTile extends Tile {
    @Getter
    @Setter
    @Accessors(chain = true, fluent = true)
    boolean touched;

    public AttackTile(Coordinate coords) {
        super(coords);
    }

    public boolean same(Coordinate other) {
        return coords.equals(other);
    }
}
