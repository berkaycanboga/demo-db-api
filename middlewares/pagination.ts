import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const PaginationOptionsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).default(10),
  orderByField: z.string().default('id'),
  orderByDirection: z.enum(['asc', 'desc']).default('asc'),
});

export interface PaginationOptions
  extends z.infer<typeof PaginationOptionsSchema> {}

export const getPaginationOptions = (req: Request): PaginationOptions => {
  try {
    const rawOptions = req.query;

    const limit =
      rawOptions.limit !== undefined ? Number(rawOptions.limit) : undefined;

    const options = PaginationOptionsSchema.parse({
      ...rawOptions,
      limit,
    });

    return options;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation error:', error.errors);
      throw new Error('Invalid pagination options');
    } else {
      throw error;
    }
  }
};

export const handlePagination = async <T>(
  req: Request,
  res: Response,
  next: NextFunction,
  getAllFunction: (options: PaginationOptions) => Promise<T[]>,
) => {
  try {
    const options = await getPaginationOptions(req);
    const result = await getAllFunction(options);
    res.json(result);
  } catch (error) {
    console.error('Internal Server Error:', error);
    next(error);
  }
};
