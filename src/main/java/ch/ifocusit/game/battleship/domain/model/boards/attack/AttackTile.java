package ch.ifocusit.game.battleship.domain.model.boards.attack;

import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;
import ch.ifocusit.game.battleship.domain.model.tile.Tile;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttackTile extends Tile {
    @Getter
    @Setter
    @Accessors(chain = true)
    boolean touched;

    public AttackTile(@NotNull Coordinate coord) {
        super(coord);
        hitted = true;
    }

    public boolean same(Coordinate other) {
        return coord.equals(other);
    }
}
