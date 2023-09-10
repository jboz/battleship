import { Game, GameJoining, GameSumary } from '@/app/(core)/model';
import { apiWrapper } from '@/app/api/(core)/(errors)/errors.handler';
import { ValidationError } from '@/app/api/(core)/(errors)/errors.model';
import { games } from '@/app/api/(core)/games.repository';
import { createGame } from '@/app/api/(core)/games.service';
import { NextRequest } from 'next/server';

export const GET = apiWrapper(() =>
  games()
    .then(games => games.map(summary))
    .then(body => ({ body }))
);

const summary = (game: Game) =>
  ({
    code: game.code,
    player1: game.player1?.name,
    player2: game.player2?.name
  } as GameSumary);

export const POST = apiWrapper((request: NextRequest) =>
  request
    .json()
    .then(body => body as GameJoining)
    .then(newGame => {
      if (!newGame.player) {
        throw new ValidationError('Player name not provided!');
      }
      if (!newGame.board || newGame.board.length === 0) {
        throw new ValidationError(`Board game not provided!`);
      }
      return createGame(newGame.player, newGame.board)
        .then(summary)
        .then(body => ({ body, status: 201 }));
    })
);
