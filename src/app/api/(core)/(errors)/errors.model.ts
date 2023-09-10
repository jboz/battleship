export class UnauthorizedError extends Error {}

export class NotFoundError extends Error {}

export class ValidationError extends Error {}

export class BusinessError extends Error {
  constructor(message: string, err?: string) {
    super(message);
    this.stack = err;
  }
}

export interface ProblemJson {
  title: string;
  status: number;
  details?: { message: string; stack: string };
  instance: string;
}
