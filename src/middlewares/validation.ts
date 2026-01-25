import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError, ZodIssue } from 'zod';
import {
  uuidSchema,
  signInSchema,
  signUpSchema,
  createArticleSchema,
  createCommentSchema,
  createProductSchema,
  commentQuerySchema,
  productQuerySchema,
  articleQuerySchema,
} from '../schemas/index.js';

// Zod 스키마를 사용한 범용 검증 미들웨어
export const validateBody = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Validation failed',
          errors: error.issues.map((err: ZodIssue) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Validation failed',
          errors: error.issues.map((err: ZodIssue) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};

export const validateParams = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed as typeof req.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Validation failed',
          errors: error.issues.map((err: ZodIssue) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};

// UUID 검증
export const validateUUID = validateParams(z.object({ id: uuidSchema }));

export const validateParamUUID = (paramName: string) => {
  return validateParams(z.object({ [paramName]: uuidSchema }));
};

// 특정 스키마를 위한 편의 미들웨어
export const validateLogin = validateBody(signInSchema);
export const validateUser = validateBody(signUpSchema);
export const validateArticleData = validateBody(createArticleSchema);
export const validateCommentData = validateBody(createCommentSchema);
export const validateProduct = validateBody(createProductSchema);

// Query 검증 미들웨어
export const validateCommentQuery = validateQuery(commentQuerySchema);
export const validateProductQuery = validateQuery(productQuerySchema);
export const validateArticleQuery = validateQuery(articleQuerySchema);
