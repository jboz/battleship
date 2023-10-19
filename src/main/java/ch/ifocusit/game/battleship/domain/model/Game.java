package ch.ifocusit.game.battleship.domain.model;

import ch.ifocusit.game.battleship.domain.model.boards.attack.AttackBoard;
import ch.ifocusit.game.battleship.domain.model.tile.Coordinate;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.Accessors;
import lombok.experimental.FieldDefaults;

@Getter
@Accessors(fluent = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Game {
    String code;
    Status status = Status.CREATION;
    Player player1;
    Player player2;

    public static Game create(String code, GameJoining creationRequest) {
        Game game = new Game();
        game.code = code;
        game.player1 = new Player(PlayerId.player1, creationRequest.player(), creationRequest.board(),
                new AttackBoard());

        return game;
    }

    public Game join(GameJoining joiningRequest) {
        if (player1 != null && player1.name().equals(joiningRequest.player())) {
            return this;
        }
        if (player2 != null && player2.name().equals(joiningRequest.player())) {
            return this;
        }
        player2 = new Player(PlayerId.player2, joiningRequest.player(), joiningRequest.board(), new AttackBoard());
        status = Status.IN_PROGRESS;
        return this;
    }

    private String playerName(Player player) {
        return player == null ? null : player.name();
    }

    public GameSummary summarize() {
        return new GameSummary(code, status, playerName(player1), playerName(player2));
    }

    public Player hit(PlayerId targetId, Coordinate hit) {
        final var target = PlayerId.player2.equals(targetId) ? player2 : player1;
        final var source = PlayerId.player1.equals(targetId) ? player2 : player1;

        source.hit(hit, target.homeBoard());
        target.updateBoard(source.attackBoard());

        refreshStatus();

        return source;
    }

    private void refreshStatus() {
        if (player1.allIsTouched() || player2.allIsTouched()) {
            status = Status.FINISHED;
        }
    }

    public boolean finished() {
        return Status.FINISHED.equals(status);
    }

    public PlayerId winner() {
        return player1.allIsTouched() ? PlayerId.player2 : PlayerId.player1;
    }
}
