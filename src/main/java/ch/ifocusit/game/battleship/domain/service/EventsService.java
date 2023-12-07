package ch.ifocusit.game.battleship.domain.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;

import ch.ifocusit.game.battleship.domain.model.PlayerId;
import ch.ifocusit.game.battleship.domain.model.events.Event;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseEventSink;
import lombok.SneakyThrows;

@Singleton
public class EventsService {
    @Context
    private Sse sse;
    @Inject
    ObjectMapper objectMapper;

    private final Map<String, SseEventSink> clients = new HashMap<>();

    @SneakyThrows
    public void publish(Event event) {
        final var sseEvent = sse.newEventBuilder()
                .id(UUID.randomUUID().toString())
                .name(event.getClass().getSimpleName())
                .data(objectMapper.writeValueAsString(event))
                .reconnectDelay(1000)
                .build();

        clients.entrySet().stream()
                .filter(e -> e.getKey().startsWith(event.channel()))
                .filter(e -> !e.getValue().isClosed())
                .forEach(e -> e.getValue().send(sseEvent));
    }

    private String channel(String gameCode, PlayerId playerId) {
        return gameCode + "-" + playerId;
    }

    public void listen(String code, PlayerId player, SseEventSink sink) {
        String channel = channel(code, player);
        clients.remove(channel);
        clients.put(channel, sink);
    }
}
