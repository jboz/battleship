'use server';

import { PlayerId } from '@/app/(core)/model';
import { createListener } from '@/app/api/(core)/events.service';

export async function GET(_: Request, { params }: { params: { gameCode: string; playerId: PlayerId } }) {
  const stream = createListener(params.gameCode, params.playerId);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Content-Encoding': 'none'
    }
  });
}
