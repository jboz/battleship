export interface JsonProblem {
  status: number;
  title: string;
  instance: string;
  detail?: string;
  violations: [
    {
      field: string;
      in: string;
      message: string;
    }
  ];
}

export class JsonProblemError extends Error {
  constructor(public problem: JsonProblem) {
    super(problem.title);
  }
}
