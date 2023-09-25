package ch.ifocusit.game.battleship.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Board {
    private List<Ship> ships = new ArrayList<>();

    public List<Ship> getShips() {
        return ships;
    }

    private List<Zone> getZones() {
        return ships.stream()
                .map(Ship::zones)
                .flatMap(List::stream)
                .toList();
    }

    private Optional<Zone> getZone(Coordinate coords) {
        return getZones().stream().filter(zone -> zone.coords.equals(coords)).findFirst();
    }

    public boolean contains(Coordinate coords) {
        return getZones().stream().anyMatch(z -> z.same(coords));
    }

    public void impacts(Hits hits) {
        hits.forEach(hit -> {
            getZone(hit.coords).ifPresent(zone -> zone.markTouched(true));
        });
    }

    @JsonIgnore
    public boolean allIsTouched() {
        return getZones().stream().allMatch(Zone::isTouched);
    }
}
