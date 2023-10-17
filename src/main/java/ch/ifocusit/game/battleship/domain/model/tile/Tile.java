package ch.ifocusit.game.battleship.domain.model.tile;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PROTECTED)
public class Tile {
    @NotNull
    final Coordinate coords;
    boolean hitted;

    public boolean same(Coordinate other) {
        return coords.equals(other);
    }
}
