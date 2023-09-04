import { NextRequest, NextResponse } from 'next/server';
import { BusinessError, NotFoundError, ProblemJson, UnauthorizedError, ValidationError } from './errors.model';

// export const middleware = (request: NextRequest) => {
//   try {
//     return NextResponse.next();
//   } catch (error) {
//     console.log(`Error:`, error);
//     return errorHandler(error as Error, request);
//   }
// };

// export const config = {
//   matcher: '/api/:function*'
// };

export interface ApiResponse {
  status?: number;
  body: any;
}

export const apiWrapper = (handler: (req: NextRequest, params: any) => Promise<ApiResponse>) => {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      console.log(`Request triggered at route ${req.method} ${req.url}`);

      const { status, body } = await handler(req, res);

      return NextResponse.json(body, { status });
    } catch (error) {
      return errorHandler(error, req);
    }
  };
};

const errorHandler = (error: unknown, req: NextRequest) => {
  const err = error as Error;
  console.error('Error:', error);
  const problem = {
    instance: req.url,
    details: {
      message: err.message,
      stack: err.stack
    }
  } as ProblemJson;

  if (err instanceof ValidationError) {
    problem.status = 400;
    problem.title = `Bad request!`;
  } else if (err instanceof NotFoundError) {
    problem.status = 404;
    problem.title = `Not found!`;
  } else if (err instanceof UnauthorizedError) {
    problem.status = 401;
    problem.title = `Not authorized!`;
    delete problem.details;
  } else if (err instanceof BusinessError) {
    problem.status = 422;
    problem.title = err.message;
  } else {
    problem.status = 500;
    problem.title = 'Unexpected error!';
  }

  return NextResponse.json(problem, { status: problem.status });
};
