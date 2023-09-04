import { findById } from '@/app/api/repository';
import { apiWrapper } from '../../(errors)/errors.handler';
import { NotFoundError } from '../../(errors)/errors.model';

export const GET = apiWrapper((_: Request, { params }: { params: { gameId: string } }) =>
  findById(params.gameId).then(game => {
    if (!game) {
      throw new NotFoundError(`Game '${params.gameId}' not found!`);
    }
    return { body: game };
  })
);
