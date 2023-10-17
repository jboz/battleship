package ch.ifocusit.game.battleship.domain.model.boards.home;

import static java.util.stream.Collectors.groupingBy;

import java.util.List;
import java.util.Map.Entry;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnore;

import ch.ifocusit.game.battleship.domain.model.boards.Board;
import ch.ifocusit.game.battleship.domain.model.boards.attack.AttackBoard;
import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;

public class HomeBoard extends Board<HomeTile> {

    public List<Ship> getShips() {
        return tiles.stream()
                .collect(groupingBy(HomeTile::getShipId))
                .entrySet().stream()
                .map(this::mapToShip)
                .toList();
    }

    private Ship mapToShip(Entry<String, List<HomeTile>> entry) {
        return new Ship(entry.getKey(), entry.getValue().size(), entry.getValue());
    }

    private Optional<HomeTile> getTile(Coordinate coords) {
        return tiles.stream().filter(zone -> zone.getCoords().equals(coords)).findFirst();
    }

    public boolean contains(Coordinate coords) {
        return tiles.stream().filter(HomeTile::hasShip).anyMatch(z -> z.same(coords));
    }

    public void impacts(AttackBoard hits) {
        hits.forEach(hit -> {
            getTile(hit.getCoords()).ifPresent(tile -> tile.hit());
        });
    }

    @JsonIgnore
    public boolean allIsTouched() {
        return tiles.stream().allMatch(HomeTile::isTouched);
    }
}
