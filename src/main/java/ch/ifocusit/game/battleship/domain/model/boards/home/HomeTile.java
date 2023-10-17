package ch.ifocusit.game.battleship.domain.model.boards.home;

import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;
import ch.ifocusit.game.battleship.domain.model.tile.Tile;
import jakarta.annotation.Nullable;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class HomeTile extends Tile {

    @Getter
    @Nullable
    String shipId;

    public HomeTile(Coordinate coords) {
        super(coords);
    }

    public boolean hasShip() {
        return shipId != null;
    }

    public boolean isTouched() {
        return hitted && hasShip();
    }

    public boolean same(Coordinate other) {
        return coords.equals(other);
    }

    public HomeTile hit() {
        this.hitted = true;
        return this;
    }
}
