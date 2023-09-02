import { GameCreation } from '@/app/(core)/model';
import { games } from '@/app/api/repository';
import { createGame } from '@/app/api/service';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(games());
}

export async function POST(request: Request) {
  const newGame = (await request.json()) as GameCreation;
  if (!newGame.player) {
    return NextResponse.json({ error: `Player name not provided!` }, { status: 400 });
  }
  return createGame(newGame.player).then(createdGame => NextResponse.json(createdGame, { status: 201 }));
}
