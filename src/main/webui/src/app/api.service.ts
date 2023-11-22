import { Coordinate, Game, GameJoining, PlayerId, Shot, Tile } from './model';

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
  create: (request: GameJoining) => fetchUrl<Game>('/', 'POST', request),

  join: (gameCode: string, request: GameJoining) => fetchUrl<Game>(`/${gameCode}/join`, 'PUT', request),

  shot: (gameCode: string, target: PlayerId, coords: Coordinate) =>
    fetchUrl<Tile[]>(`/${gameCode}/shot`, 'PUT', { target, coords } as Shot),

  connect: (gameCode: string, playerId: PlayerId) => new EventSource(`${API_URL}/${gameCode}/players/${playerId}/events`)
};

export default GameApi;
