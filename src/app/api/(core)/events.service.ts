'use server';

import { Event, EventPayload, EventType, OnStateChangeEvent, PlayerId } from '@/app/(core)/model';

interface Clients {
  (clientId: string): WritableStreamDefaultWriter;
}

const clients = {} as any;

// const internalBus = new EventEmitter();

// const events = () => internalBus;

const channelId = (gameCode: string, playerId: PlayerId) => `${gameCode}-${playerId}`;

// export const onEvent = (gameCode: string, playerId: PlayerId, listener: (payload: EventPayload) => void) =>
//   events().on(channelId(gameCode, playerId), event => {
//     console.log(`Emit message:`, event);
//     listener(event);
//   });

export const sendEvent = (gameCode: string, playerId: PlayerId, type: EventType, event: Event) => {
  // events().emit(channelId(gameCode, playerId), { type, content }
  const clientId = channelId(gameCode, playerId);
  const client = clients[clientId];
  if (client) {
    client.write(JSON.stringify({ type, content: event } as EventPayload) + '\n');
    if (type === 'onStateChange' && (event as OnStateChangeEvent).state !== 'progress') {
      client.close();
      delete clients[clientId];
    }
  }
};

export const createListener = (gameCode: string, playerId: PlayerId) => {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  try {
    const clientId = channelId(gameCode, playerId);
    clients[clientId] = writer;
    // onEvent(gameCode, playerId, (payload: EventPayload) => {
    // writer.write(`${JSON.stringify(payload)}\n`);
    // });
  } catch (error) {
    console.log(`Stream error`, error);
    writer.close();
  }
  return responseStream.readable;
};
