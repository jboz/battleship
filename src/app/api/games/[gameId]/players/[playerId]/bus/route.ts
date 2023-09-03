import { PlayerId } from '@/app/(core)/model';
import { bus } from '@/app/api/service';
import { tap } from 'rxjs';

export async function GET(_: Request, { params }: { params: { gameId: string; playerId: PlayerId } }) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  try {
    bus().pipe(
      tap(payload => {
        if (payload.game.id === params.gameId && payload.player === params.playerId) {
          writer.write(encoder.encode(JSON.stringify(payload)));
        }
        if (payload.finished) {
          writer.close();
        }
      })
    );
  } catch (error) {
    writer.close();
  }

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform'
    }
  });
}
