import { GameHit } from '@/app/(core)/model';
import { findById } from '@/app/api/repository';
import { getPlayer, hit } from '@/app/api/service';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { gameId: string } }) {
  const hitRequest = (await request.json()) as GameHit;
  if (!['player1', 'player2'].includes(hitRequest.playerId)) {
    return NextResponse.json({ error: `Unknow player id! Should be 'player1' or 'player2'` }, { status: 400 });
  }
  if (!hitRequest.coords || isNaN(hitRequest.coords.x) || isNaN(hitRequest.coords.y)) {
    return NextResponse.json({ error: `Bad coordinates!` }, { status: 400 });
  }
  return findById(params.gameId).then(game => {
    if (!game) {
      return NextResponse.json({ error: `Game ${params.gameId} not found!` }, { status: 404 });
    }
    return NextResponse.json(hit(getPlayer(game, hitRequest.playerId), hitRequest.coords));
  });
}
