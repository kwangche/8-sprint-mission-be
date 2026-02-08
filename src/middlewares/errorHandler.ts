import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const asyncHandler = <
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown
>(
  fn: (req: Request<TParams, unknown, TBody, TQuery>, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request<TParams, unknown, TBody, TQuery>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
): void => {
  console.error(err.stack);

  // Prisma 에러 처리
  if (err.code === 'P2025') {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  if (err.code === 'P2002') {
    res.status(409).json({ message: 'Duplicate entry' });
    return;
  }

  if (err.code === 'P2003') {
    res.status(400).json({ message: 'Foreign key constraint failed' });
    return;
  }

  if (err.code === 'P2023') {
    res.status(400).json({ message: 'Invalid ID format' });
    return;
  }

  // 기본 에러 처리
  res.status(500).json({ message: 'Internal server error' });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ message: 'Route not found' });
};
