import { PlayerId } from '@/app/(core)/model';
import { apiWrapper } from '@/app/api/(errors)/errors.handler';
import { NotFoundError, ValidationError } from '@/app/api/(errors)/errors.model';
import { findById } from '@/app/api/repository';
import { getPlayer } from '@/app/api/service';

export const GET = apiWrapper((_: Request, { params }: { params: { gameId: string; playerId: PlayerId } }) => {
  if (['player1', 'player2'].includes(params.playerId)) {
    throw new ValidationError(`Unknow player id! Should be 'player1' or 'player2'`);
  }
  return findById(params.gameId).then(game => {
    if (!game) {
      throw new NotFoundError(`Game '${params.gameId}' not found!`);
    }
    return { body: getPlayer(game, params.playerId) };
  });
});
