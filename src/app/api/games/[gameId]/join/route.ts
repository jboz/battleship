import { GameJoining } from '@/app/(core)/model';
import { findById } from '@/app/api/repository';
import { joinGame } from '@/app/api/service';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { gameId: string } }) {
  const player2 = (await request.json()) as GameJoining;
  if (!player2.player) {
    return NextResponse.json({ error: `Joint player name not provided!` }, { status: 400 });
  }
  return findById(params.gameId).then(async game => {
    if (!game) {
      return NextResponse.json({ error: `Game ${params.gameId} not found!` }, { status: 404 });
    }
    if (game.player2 && game.player2.name) {
      return NextResponse.json({ error: `Can't join the game, game is ready!` }, { status: 422 });
    }
    const joinedGame = await joinGame(game, player2.player);
    return NextResponse.json(joinedGame);
  });
}
