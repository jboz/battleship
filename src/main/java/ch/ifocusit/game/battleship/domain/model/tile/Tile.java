package ch.ifocusit.game.battleship.domain.model.tile;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.Accessors;
import lombok.experimental.FieldDefaults;

@Getter
@RequiredArgsConstructor
@Accessors(chain = true)
@FieldDefaults(level = AccessLevel.PROTECTED)
public class Tile {
    @NotNull
    final Coordinate coord;

    boolean hitted;

    public boolean same(Coordinate other) {
        return coord.equals(other);
    }
}
