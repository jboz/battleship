package ch.ifocusit.game.battleship.domain.model;

import jakarta.validation.constraints.NotNull;

public class Zone {
    @NotNull
    Coordinate coords;
    boolean touched;

    public Zone(@NotNull Coordinate coords) {
        this.coords = coords;
    }

    public Zone(@NotNull Coordinate coords, boolean touched) {
        this.coords = coords;
        this.touched = touched;
    }

    public Coordinate getCoords() {
        return coords;
    }

    public boolean isTouched() {
        return touched;
    }

    public boolean same(Coordinate other) {
        return coords.equals(other);
    }

    public Zone markTouched(boolean touched) {
        this.touched = touched;
        return this;
    }
}
