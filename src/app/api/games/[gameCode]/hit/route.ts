import { GameHit } from '@/app/(core)/model';
import { apiWrapper } from '@/app/api/(core)/(errors)/errors.handler';
import { NotFoundError, ValidationError } from '@/app/api/(core)/(errors)/errors.model';
import { findByCode } from '@/app/api/(core)/games.repository';
import { hit } from '@/app/api/(core)/hits.service';

export const PUT = apiWrapper((request: Request, { params }: { params: { gameCode: string } }) =>
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
      return findByCode(params.gameCode).then(game => {
        if (!game) {
          throw new NotFoundError(`Game '${params.gameCode}' not found!`);
        }
        return hit(game, hitRequest.coords, hitRequest.target).then(body => ({ body }));
      });
    })
);
