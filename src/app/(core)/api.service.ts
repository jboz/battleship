import { Coordinates, Game, GameHit, GameJoining, PlayerId, Zone } from './model';

const API_URL = '/api/games';

function fetchUrl<T>(serviceUrl: string, method: 'GET' | 'POST' | 'PUT' = 'GET', body?: any): Promise<T> {
  return fetch(`${API_URL}${serviceUrl}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      if (data.status >= 400) {
        throw new Error(data.title);
      }
      return data;
    });
}

const GameApi = {
  create: (player: string, board: Coordinates[]) => fetchUrl<Game>('/', 'POST', { player, board } as GameJoining),

  join: (gameCode: string, player: string, board: Coordinates[]) =>
    fetchUrl<Game>(`/${gameCode}/join`, 'PUT', { player, board } as GameJoining),

  hit: (gameCode: string, target: PlayerId, coords: Coordinates) =>
    fetchUrl<Zone[]>(`/${gameCode}/hit`, 'PUT', { target, coords } as GameHit),

  connect: (gameCode: string, playerId: PlayerId) => {
    const eventSource = new EventSource(`${API_URL}/${gameCode}/players/${playerId}/events`);

    eventSource.onerror = event => {
      console.log('Connection was closed due to an error:', event);
      eventSource.close();
    };

    return eventSource;
  }
};

export default GameApi;
