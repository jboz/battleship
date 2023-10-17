package ch.ifocusit.game.battleship.domain.model;

import ch.ifocusit.game.battleship.domain.model.boards.attack.AttackBoard;
import ch.ifocusit.game.battleship.domain.model.boards.attack.AttackTile;
import ch.ifocusit.game.battleship.domain.model.boards.home.HomeBoard;
import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;
import jakarta.annotation.Nonnull;

public record Player(@Nonnull PlayerId id, @Nonnull String name, @Nonnull HomeBoard homeBoard,
        @Nonnull AttackBoard attackBoard) {

    public void hit(Coordinate coords, HomeBoard otherBoard) {
        if (!attackBoard.contains(coords)) {
            attackBoard.add(new AttackTile(coords));
        }
        attackBoard.updates(hit -> hit.touched(otherBoard.contains(hit.getCoords())));
    }

    public void updateBoard(AttackBoard hits) {
        homeBoard.impacts(hits);
    }

    public boolean allIsTouched() {
        return homeBoard.allIsTouched();
    }

}
