package ch.ifocusit.game.battleship.domain.model.boards.attack;

import java.util.function.Function;
import java.util.stream.Collectors;

import ch.ifocusit.game.battleship.domain.model.boards.Board;
import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;

public class AttackBoard extends Board<AttackTile> {

    public boolean contains(Coordinate coords) {
        return tiles.stream().anyMatch(z -> z.same(coords));
    }

    public void updates(Function<AttackTile, AttackTile> mapFunction) {
        tiles = tiles.stream().map(mapFunction).collect(Collectors.toList());
    }

    public void add(AttackTile shot) {
        tiles.add(shot);
    }
}
