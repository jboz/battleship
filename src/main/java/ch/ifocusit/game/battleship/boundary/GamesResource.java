package ch.ifocusit.game.battleship.boundary;

import java.util.List;

import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestQuery;

import ch.ifocusit.game.battleship.domain.model.GameHit;
import ch.ifocusit.game.battleship.domain.model.GameJoining;
import ch.ifocusit.game.battleship.domain.model.GameSummary;
import ch.ifocusit.game.battleship.domain.model.Player;
import ch.ifocusit.game.battleship.domain.model.PlayerId;
import ch.ifocusit.game.battleship.domain.model.boards.attack.AttackBoard;
import ch.ifocusit.game.battleship.domain.service.EventsService;
import ch.ifocusit.game.battleship.domain.service.GamesService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.sse.SseEventSink;

@Path("/api/games")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GamesResource {

    @Inject
    GamesService service;

    @Inject
    EventsService eventsService;

    @GET
    public List<GameSummary> games() {
        return service.games();
    }

    @POST
    public GameSummary create(@Valid @NotNull GameJoining request) {
        return service.create(request);
    }

    @GET()
    @Path("/{code}")
    public GameSummary get(@RestPath("code") String code) {
        return service.get(code);
    }

    @DELETE()
    @Path("/{code}")
    public void delete(@RestPath("code") String code) {
        service.delete(code);
    }

    @PUT()
    @Path("/{code}/join")
    public GameSummary join(@RestPath("code") String code, @Valid @NotNull GameJoining request) {
        return service.join(code, request);
    }

    @PUT()
    @Path("/{code}/hit")
    public AttackBoard hit(@RestPath("code") String code, @Valid @NotNull GameHit request) {
        return service.hit(code, request);
    }

    @GET
    @Path("/{code}/players")
    public Player player(@RestPath("code") String code, @RestQuery("name") @NotBlank String name) {
        return service.playerByName(code, name);
    }

    @GET
    @Path("/{code}/players/{player}/events")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public void events(@RestPath("code") String code, @RestPath("player") PlayerId player, @Context SseEventSink sink) {
        eventsService.listen(code, player, sink);
        service.sendState(code);
    }
}
