package ch.ifocusit.game.battleship.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

public class Hits {
    private List<Zone> zones = new ArrayList<>();

    public boolean contains(Coordinate coords) {
        return zones.stream().anyMatch(z -> z.same(coords));
    }

    public void updates(Function<Zone, Zone> mapFunction) {
        zones = zones.stream().map(mapFunction).collect(Collectors.toList());
    }

    public void add(Zone hit) {
        zones.add(hit);
    }

    public List<Zone> getZones() {
        return zones;
    }

    public void forEach(Consumer<Zone> consumer) {
        zones.forEach(consumer);
    }
}
