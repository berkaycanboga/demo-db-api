import { Request, Response, NextFunction } from 'express';

export interface PaginationOptions {
  cursor?: string | undefined;
  limit: number;
  orderByField: string;
  orderByDirection: 'asc' | 'desc';
}

export const getPaginationOptions = (req: Request): PaginationOptions => {
  const { cursor, limit: rawLimit, orderByField, orderByDirection } = req.query;

  const limit = rawLimit ? Math.max(1, Number(rawLimit)) : 10;

  const defaultOrderByField = 'id';
  const defaultOrderByDirection = 'asc';

  const options: PaginationOptions = {
    cursor: cursor as string | undefined,
    limit,
    orderByField: (orderByField as string) || defaultOrderByField,
    orderByDirection:
      orderByDirection === 'asc' || orderByDirection === 'desc'
        ? orderByDirection
        : defaultOrderByDirection,
  };

  return options;
};

export const handlePagination = async <T>(
  req: Request,
  res: Response,
  next: NextFunction,
  getAllFunction: (options: PaginationOptions) => Promise<T[]>,
) => {
  try {
    const options = getPaginationOptions(req);
    const result = await getAllFunction(options);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
