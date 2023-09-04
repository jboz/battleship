import { GameCreation } from '@/app/(core)/model';
import { games } from '@/app/api/repository';
import { createGame } from '@/app/api/service';
import { NextRequest } from 'next/server';
import { apiWrapper } from '../(errors)/errors.handler';
import { ValidationError } from '../(errors)/errors.model';

export const GET = apiWrapper(() => games().then(body => ({ body })));

export const POST = apiWrapper((request: NextRequest) =>
  request
    .json()
    .then(body => body as GameCreation)
    .then(newGame => {
      if (!newGame.player) {
        throw new ValidationError('Player name not provided!');
      }
      return createGame(newGame.player).then(createdGame => ({ body: createdGame, status: 201 }));
    })
);
