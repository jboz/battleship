import { GameJoining } from '@/app/(core)/model';
import { apiWrapper } from '@/app/api/(errors)/errors.handler';
import { BusinessError, NotFoundError, ValidationError } from '@/app/api/(errors)/errors.model';
import { findById } from '@/app/api/repository';
import { joinGame } from '@/app/api/service';

export const PUT = apiWrapper((request: Request, { params }: { params: { gameId: string } }) =>
  request
    .json()
    .then(req => req as GameJoining)
    .then(player2 => {
      if (!player2.player) {
        throw new ValidationError(`Joint player name not provided!`);
      }
      return findById(params.gameId).then(async game => {
        if (!game) {
          throw new NotFoundError(`Game '${params.gameId}' not found!`);
        }
        if (game.player2 && game.player2.name) {
          throw new BusinessError(`Can't join the game, game is ready!`);
        }
        return joinGame(game, player2.player).then(body => ({ body }));
      });
    })
);
