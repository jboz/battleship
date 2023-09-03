import { Subject } from 'rxjs';
import { BusPayload, Coordinates, Game, Player, PlayerId } from '../(core)/model';
import { existingGameCodes, insertGame, saveGame } from './repository';

const internalBus = new Subject<BusPayload>();

export const bus = () => internalBus.asObservable();

export const createGame = (player: string) => {
  return existingGameCodes()
    .then(
      codes =>
        ({
          id: 'game' + codes.length + 1,
          player1: {
            name: player
          }
        } as Game)
    )
    .then(newGame => insertGame(newGame));
};

export const joinGame = (game: Game, player2: string) => {
  game.player2 = {
    name: player2
  };
  return saveGame(game);
};

export const getPlayer = (game: Game, playerId: PlayerId) => (playerId === 'player2' ? game.player2 : game.player1);

export const hit = (player: Player, hit: Coordinates) => {
  const hits = player.hits || [];
  if (!findHit(hits, hit)) {
    hits.push(hit);
    player.hits = hits;
  }
  return hits;
};

const findHit = (hits: Coordinates[], hit: Coordinates) => hits.find(h => h.x === hit.x && h.y === hit.y);
