package ch.ifocusit.game.battleship.domain.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import org.apache.commons.lang3.RandomStringUtils;

import ch.ifocusit.game.battleship.domain.model.Game;
import ch.ifocusit.game.battleship.domain.model.GameJoining;
import ch.ifocusit.game.battleship.domain.model.GameShot;
import ch.ifocusit.game.battleship.domain.model.GameSummary;
import ch.ifocusit.game.battleship.domain.model.Player;
import ch.ifocusit.game.battleship.domain.model.PlayerId;
import ch.ifocusit.game.battleship.domain.model.boards.attack.AttackBoard;
import ch.ifocusit.game.battleship.domain.model.events.FinishEvent;
import ch.ifocusit.game.battleship.domain.model.events.PlayerEvent;
import ch.ifocusit.game.battleship.domain.model.events.PlayerJoinedEvent;
import ch.ifocusit.game.battleship.domain.model.events.ShotEvent;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.ws.rs.NotFoundException;

@Singleton
public class GamesService {

    @Inject
    EventsService eventsService;

    List<Game> games = new ArrayList<>();

    public List<GameSummary> games() {
        return games.stream().map(Game::summarize).toList();
    }

    private String generateCode() {
        return RandomStringUtils.randomAlphanumeric(4).toUpperCase();
    }

    public GameSummary create(GameJoining request) {
        final var newGame = Game.create(generateCode(), request);
        games.add(newGame);
        return newGame.summarize();
    }

    public GameSummary get(String code) {
        return games.stream()
                .filter(g -> g.code().equals(code)).map(Game::summarize)
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Game '" + code + "' not found!"));
    }

    public Game findByCode(String code) {
        return games.stream()
                .filter(g -> g.code().equalsIgnoreCase(code))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Game '" + code + "' not found!"));
    }

    public GameSummary join(String code, GameJoining request) {
        final var game = findByCode(code);
        GameSummary summarized = game.join(request).summarize();
        if (summarized.player2() != null) {
            eventsService.publish(new PlayerJoinedEvent(code, summarized.player2()));
        }
        return summarized;
    }

    public void delete(String code) {
        games.removeIf(game -> game.code().equalsIgnoreCase(code));
    }

    public AttackBoard shot(String code, GameShot request) {
        final var game = findByCode(code);
        final var source = game.shot(request.target(), request.coords());

        eventsService.publish(new PlayerEvent(game.code(), game.player1()));
        eventsService.publish(new PlayerEvent(game.code(), game.player2()));

        boolean attackTouched = source.attackTouched(request.coords());

        game.nextPlayerId(attackTouched ? source.id() : source.id().reverse());

        eventsService
                .publish(new ShotEvent(game.code(), source.id(), request.coords(),
                        attackTouched, game.nextPlayerId()));

        if (game.finished()) {
            eventsService.publish(new FinishEvent(game.code(), game.playerName(game.winner())));
        }
        return source.attackBoard();
    }

    public Player playerByName(String code, String name) {
        final var game = findByCode(code);
        return Stream.of(game.player1(), game.player2())
                .filter(Objects::nonNull)
                .filter(p -> name.equalsIgnoreCase(p.name()))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Player '" + name + "' not found!"));

    }

    public void sendState(String code) {
        final var game = findByCode(code);
        if (game.player1() != null) {
            eventsService.publish(new PlayerEvent(game.code(), game.player1()));
        }
        if (game.player2() != null) {
            eventsService.publish(new PlayerEvent(game.code(), game.player2()));
        }
    }

    public void withdraw(String code, PlayerId player) {
        final var game = findByCode(code);
        game.withdraw(player);
        eventsService.publish(new FinishEvent(game.code(), game.playerName(game.winner())));
    }
}
