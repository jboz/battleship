import { Coordinates, Game, GameCreation, GameHit, GameJoining, PlayerId } from './model';

const API_URL = '/api/';

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
  create: (player: string) => fetchUrl<Game>('/games', 'POST', { player } as GameCreation),

  join: (gameId: string, player: string) => fetchUrl<Game>(`/games/${gameId}/join`, 'PUT', { player } as GameJoining),

  hit: (gameId: string, playerId: PlayerId, coords: Coordinates) => fetchUrl(`/games/${gameId}/hit`, 'PUT', { playerId, coords } as GameHit)
};

export default GameApi;
