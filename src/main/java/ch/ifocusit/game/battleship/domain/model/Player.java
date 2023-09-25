package ch.ifocusit.game.battleship.domain.model;

import jakarta.annotation.Nonnull;

public record Player(@Nonnull PlayerId id, @Nonnull String name, @Nonnull Board board, @Nonnull Hits hits) {

    public void hit(Coordinate coords, Board otherBoard) {
        if (!hits.contains(coords)) {
            hits.add(new Zone(coords));
        }
        hits.updates(hit -> hit.markTouched(otherBoard.contains(hit.getCoords())));
    }

    public void updateBoard(Hits hits) {
        board.impacts(hits);
    }

    public boolean allIsTouched() {
        return board.allIsTouched();
    }

}
