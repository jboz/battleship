import { Game, GameJoining, GameSumary } from '@/app/(core)/model';
import { apiWrapper } from '@/app/api/(core)/(errors)/errors.handler';
import { BusinessError, NotFoundError, ValidationError } from '@/app/api/(core)/(errors)/errors.model';
import { findByCode } from '@/app/api/(core)/games.repository';
import { joinGame } from '@/app/api/(core)/games.service';

export const PUT = apiWrapper((request: Request, { params }: { params: { gameCode: string } }) =>
  request
    .json()
    .then(req => req as GameJoining)
    .then(player2 => {
      if (!player2.player) {
        throw new ValidationError(`Joint player name not provided!`);
      }
      if (!player2.board || player2.board.length === 0) {
        throw new ValidationError(`Board game not provided!`);
      }
      return findByCode(params.gameCode).then(async game => {
        if (!game) {
          throw new NotFoundError(`Game '${params.gameCode}' not found!`);
        }
        if (game.player2 && game.player2.name) {
          throw new BusinessError(`Can't join the game, game is ready!`);
        }
        return joinGame(game, player2.player, player2.board)
          .then(summary)
          .then(body => ({ body }));
      });
    })
);

const summary = (game: Game) =>
  ({
    code: game.code,
    player1: game.player1?.name,
    player2: game.player2?.name
  } as GameSumary);
