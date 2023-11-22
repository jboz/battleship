package ch.ifocusit.game.battleship.domain.model.boards.home;

import com.fasterxml.jackson.annotation.JsonCreator;

import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;
import ch.ifocusit.game.battleship.domain.model.tile.Tile;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class HomeTile extends Tile {

    @Getter
    @Nullable
    final String shipId;

    @JsonCreator
    public HomeTile(@NotNull Coordinate coord, String shipId) {
        super(coord);
        this.shipId = shipId;
    }

    public boolean hasShip() {
        return shipId != null;
    }

    public boolean isTouched() {
        return hitted && hasShip();
    }

    public HomeTile shot() {
        this.hitted = true;
        return this;
    }
}
