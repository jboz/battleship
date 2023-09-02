import { findById } from '@/app/api/repository';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { gameId: string } }) {
  return findById(params.gameId).then(game => {
    if (!game) {
      return NextResponse.json({ error: `Game '${params.gameId}' not found!` }, { status: 404 });
    }
    return NextResponse.json(game);
  });
}
