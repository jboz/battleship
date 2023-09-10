import { apiWrapper } from '@/app/api/(core)/(errors)/errors.handler';
import { deleteGame, findByCode } from '@/app/api/(core)/games.repository';

export const DELETE = apiWrapper((request: Request, { params }: { params: { gameCode: string } }) =>
  findByCode(params.gameCode).then(game => {
    if (game) {
      return deleteGame(game);
    }
    return;
  })
);
