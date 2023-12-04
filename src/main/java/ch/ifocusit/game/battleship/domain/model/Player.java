package ch.ifocusit.game.battleship.domain.model;

import ch.ifocusit.game.battleship.domain.model.boards.attack.AttackBoard;
import ch.ifocusit.game.battleship.domain.model.boards.attack.AttackTile;
import ch.ifocusit.game.battleship.domain.model.boards.home.HomeBoard;
import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;
import jakarta.annotation.Nonnull;

public record Player(@Nonnull PlayerId id, @Nonnull String name, @Nonnull HomeBoard homeBoard,
        @Nonnull AttackBoard attackBoard) {

    public void shot(Coordinate coords, HomeBoard targetBoard) {
        if (!attackBoard.contains(coords)) {
            attackBoard.add(new AttackTile(coords));
        }
        attackBoard.updates(shot -> shot.setTouched(targetBoard.contains(shot.getCoord())));
    }

    public void detectDestoyed(HomeBoard targetBoard) {
        attackBoard.updates(shot -> shot.setDestroyedShipdId(targetBoard.getShipIdIfDestroyed(shot.getCoord())));
    }

    public void updateBoard(AttackBoard shots) {
        homeBoard.impacts(shots);
    }

    public boolean allIsTouched() {
        return homeBoard.allIsTouched();
    }

    public boolean attackTouched(Coordinate coords) {
        return attackBoard.get(coords).map(AttackTile::isTouched).orElse(false);
    }

}
