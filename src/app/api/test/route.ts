import { NextRequest, NextResponse } from 'next/server';
import { EventEmitter } from 'stream';

const clients: WritableStreamDefaultWriter[] = [];

const internalBus = new EventEmitter();

export async function GET(request: NextRequest) {
  //   let responseStream = new ReadableStream({
  // start(controller) {
  //   clients.push(controller);
  // }
  //   });
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  try {
    clients.push(writer);
    // setTimeout(() => {
    // internalBus.on('my-event', event => {
    //   writer.write(JSON.stringify(event.data));
    // });
    // });
  } catch (error) {
    console.log(`Stream error`, error);
    writer.close();
  }

  console.log(`send response`);
  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Encoding': 'none'
    }
  });
}

export async function POST(request: NextRequest) {
  return request.json().then(content => {
    // internalBus.emit('my-event', content);
    clients.forEach(client => client.write(`${new Date().toISOString()}: ${content.message}\n`));
    // clients.forEach(client => client.enqueue(content.message));
    return NextResponse.json('ok');
  });
}
