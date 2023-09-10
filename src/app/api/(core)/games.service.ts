import { Coordinates, Game, Zone } from '@/app/(core)/model';
import { BusinessError } from '@/app/api/(core)/(errors)/errors.model';
import { sendEvent } from './events.service';
import { existingGameCodes, findByCode, games, insertGame, updateGame } from './games.repository';

export const createGame = (player: string, board: Coordinates[]) =>
  games()
    .then(games => games.find(g => g.player1.name === player || g.player2.name === player))
    .then(playerGame => {
      if (playerGame) {
        throw new BusinessError(`Player '${player}' already in the game '${playerGame.code}'`);
      }

      return generateCode()
        .then(
          code =>
            ({
              code,
              state: 'creation',
              player1: {
                id: 'player1',
                name: player,
                board,
                hits: [] as Zone[]
              }
            } as Game)
        )
        .then(insertGame);
    });

const generateCode = () => existingGameCodes().then(codes => 'game' + (codes.length + 1));

export const joinGame = (game: Game, player2: string, board: Coordinates[]) => {
  game.player2 = {
    id: 'player2',
    name: player2,
    board,
    hits: [] as Zone[]
  };
  game.state = 'progress';
  return updateGame(game);
};

export const publishState = (code: string) =>
  findByCode(code).then(game => {
    if (game) {
      game.player1 && sendEvent(game.code, 'player1', 'onBoardChange', { board: game.player1.board });
      game.player1 && sendEvent(game.code, 'player2', 'onBoardChange', { board: game.player2.board });
    }
    return Promise.resolve();
  });
