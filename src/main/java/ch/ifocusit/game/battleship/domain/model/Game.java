package ch.ifocusit.game.battleship.domain.model;

public class Game {
    private String code;
    private Status status = Status.CREATION;
    private Player player1;
    private Player player2;

    public static Game create(String code, GameJoining creationRequest) {
        Game game = new Game();
        game.code = code;
        game.player1 = new Player(PlayerId.player1, creationRequest.player(), creationRequest.board(), new Hits());

        return game;
    }

    public Game join(GameJoining joiningRequest) {
        player2 = new Player(PlayerId.player2, joiningRequest.player(), joiningRequest.board(), new Hits());
        status = Status.IN_PROGRESS;
        return this;
    }

    public String code() {
        return code;
    }

    public Player player1() {
        return player1;
    }

    public Player player2() {
        return player2;
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

        source.hit(hit, target.board());
        target.updateBoard(source.hits());

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
        return player1().allIsTouched() ? PlayerId.player2 : PlayerId.player1;
    }

    public String getCode() {
        return code;
    }

    public Player getPlayer1() {
        return player1;
    }

    public Player getPlayer2() {
        return player2;
    }

    public Status getStatus() {
        return status;
    }
}
