package ch.ifocusit.game.battleship.domain.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import ch.ifocusit.game.battleship.domain.model.Game;
import ch.ifocusit.game.battleship.domain.model.GameHit;
import ch.ifocusit.game.battleship.domain.model.GameJoining;
import ch.ifocusit.game.battleship.domain.model.GameSummary;
import ch.ifocusit.game.battleship.domain.model.Hits;
import ch.ifocusit.game.battleship.domain.model.Player;
import ch.ifocusit.game.battleship.domain.model.events.FinishEvent;
import ch.ifocusit.game.battleship.domain.model.events.HitEvent;
import ch.ifocusit.game.battleship.domain.model.events.PlayerEvent;
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
        return "game" + (games.size() + 1);
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
                .filter(g -> g.code().equals(code))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Game '" + code + "' not found!"));
    }

    public GameSummary join(String code, GameJoining request) {
        final var game = findByCode(code);
        return game.join(request).summarize();
    }

    public void delete(String code) {
        games.removeIf(game -> game.code().equals(code));
    }

    public Hits hit(String code, GameHit request) {
        final var game = findByCode(code);
        final var source = game.hit(request.target(), request.coords());

        eventsService.publish(new PlayerEvent(game.code(), game.player1()));
        eventsService.publish(new PlayerEvent(game.code(), game.player2()));
        eventsService.publish(new HitEvent(game.code(), source.id(), source.hits()));

        if (game.finished()) {
            eventsService.publish(new FinishEvent(game.code(), game.winner()));
        }
        return source.hits();
    }

    public Player playerByName(String code, String name) {
        final var game = findByCode(code);
        return Stream.of(game.player1(), game.player2())
                .filter(Objects::nonNull)
                .filter(p -> name.equals(p.name()))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Player '" + name + "' not found!"));

    }
}
