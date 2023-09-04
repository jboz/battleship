import { Coordinates, Game, GameCreation, GameHit, GameJoining, PlayerId } from './model';

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
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    });
}

const GameApi = {
  create: (player: string) => fetchUrl<Game>('/', 'POST', { player } as GameCreation),

  join: (gameId: string, player: string) => fetchUrl<Game>(`/${gameId}/join`, 'PUT', { player } as GameJoining),

  hit: (gameId: string, target: PlayerId, coords: Coordinates) => fetchUrl(`/${gameId}/hit`, 'PUT', { target, coords } as GameHit),

  connect: (gameId: string, playerId: PlayerId) => {
    const eventSource = new EventSource(`${API_URL}/${gameId}/players/${playerId}/events`);

    eventSource.onerror = event => {
      console.log('Connection was closed due to an error:', event);
      eventSource.close();
    };

    return eventSource;
  }
};

export default GameApi;
