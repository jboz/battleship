import { PlayerId } from '@/app/(core)/model';
import { findById } from '@/app/api/repository';
import { getPlayer } from '@/app/api/service';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { gameId: string; playerId: PlayerId } }) {
  if (['player1', 'player2'].includes(params.playerId)) {
    return NextResponse.json({ error: `Unknow player id! Should be 'player1' or 'player2'` }, { status: 400 });
  }
  return findById(params.gameId).then(game => {
    if (!game) {
      return NextResponse.json({ error: `Game ${params.gameId} not found!` }, { status: 404 });
    }
    return NextResponse.json(getPlayer(game, params.playerId));
  });
}
