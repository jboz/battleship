import { Board, Coordinates, Game, GameHit, GameJoining, Player, PlayerId } from './model';

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
  create: (player: string, board: Board) => fetchUrl<Game>('/', 'POST', { player, board } as GameJoining),

  join: (gameCode: string, player: string, board: Board) => fetchUrl<Game>(`/${gameCode}/join`, 'PUT', { player, board } as GameJoining),

  getPlayer: (gameCode: string, player: string) => fetchUrl<Player>(`/${gameCode}/players?name=${player}`),

  hit: (gameCode: string, target: PlayerId, coords: Coordinates) =>
    fetchUrl<Board>(`/${gameCode}/hit`, 'PUT', { target, coords } as GameHit),

  connect: (gameCode: string, playerId: PlayerId) => new EventSource(`${API_URL}/${gameCode}/players/${playerId}/events`)
};

export default GameApi;
