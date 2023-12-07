package ch.ifocusit.game.battleship.domain.model.boards.home;

import static java.util.stream.Collectors.groupingBy;

import java.util.List;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnore;

import ch.ifocusit.game.battleship.domain.model.boards.Board;
import ch.ifocusit.game.battleship.domain.model.boards.attack.AttackBoard;
import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;

public class HomeBoard extends Board<HomeTile> {

    @JsonIgnore
    public List<Ship> getShips() {
        return tiles.stream()
                .filter(tile -> Objects.nonNull(tile.getShipId()))
                .collect(groupingBy(HomeTile::getShipId))
                .entrySet().stream()
                .map(this::mapToShip)
                .toList();
    }

    private Ship mapToShip(Entry<String, List<HomeTile>> entry) {
        return new Ship(entry.getKey(), entry.getValue().size(), entry.getValue());
    }

    private Optional<HomeTile> getTile(Coordinate coords) {
        return tiles.stream().filter(zone -> zone.getCoord().equals(coords)).findFirst();
    }

    public boolean contains(Coordinate coords) {
        return tiles.stream().filter(HomeTile::hasShip).anyMatch(z -> z.same(coords));
    }

    public void impacts(AttackBoard shots) {
        shots.forEach(shot -> {
            getTile(shot.getCoord()).ifPresent(tile -> tile.shot());
        });
    }

    @JsonIgnore
    public boolean allIsTouched() {
        return tiles.stream().filter((HomeTile::hasShip)).allMatch(HomeTile::isTouched);
    }

    public String getShipIdIfDestroyed(Coordinate coords) {
        return getShips().stream()
                .filter(ship -> ship.contains(coords) && ship.isDestroyed())
                .findFirst()
                .map(ship -> ship.id())
                .orElse(null);
    }
}
