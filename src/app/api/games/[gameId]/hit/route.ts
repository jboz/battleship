import { GameHit } from '@/app/(core)/model';
import { apiWrapper } from '@/app/api/(errors)/errors.handler';
import { NotFoundError, ValidationError } from '@/app/api/(errors)/errors.model';
import { findById } from '@/app/api/repository';
import { getPlayer, hit } from '@/app/api/service';

export const PUT = apiWrapper((request: Request, { params }: { params: { gameId: string } }) =>
  request
    .json()
    .then(req => req as GameHit)
    .then(hitRequest => {
      if (!['player1', 'player2'].includes(hitRequest.target)) {
        throw new ValidationError(`Unknow player id! Should be 'player1' or 'player2'`);
      }
      if (!hitRequest.coords || isNaN(hitRequest.coords.x) || isNaN(hitRequest.coords.y)) {
        throw new ValidationError(`Bad coordinates!`);
      }
      return findById(params.gameId).then(game => {
        if (!game) {
          throw new NotFoundError(`Game '${params.gameId}' not found!`);
        }
        return { body: hit(game, hitRequest.target, getPlayer(game, hitRequest.target), hitRequest.coords) };
      });
    })
);
