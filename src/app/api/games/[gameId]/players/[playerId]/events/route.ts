import { PlayerId } from '@/app/(core)/model';
import { BusPayload, channelId, events } from '@/app/api/service';

export async function GET(_: Request, { params }: { params: { gameId: string; playerId: PlayerId } }) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  try {
    events().on(channelId(params.gameId, params.playerId), (payload: BusPayload) => {
      console.log(`payload received`, payload);
      // if (event === channelId(params.gameId, params.playerId)) {
      writer.write(`${JSON.stringify(payload)}\n`);
      if (payload.finished) {
        writer.close();
      }
    });
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
