import { Request } from 'express';
import { JWTPayload } from './auth.js';

// Express Request에 사용자 정보 추가
export interface AuthenticatedRequest<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown
> extends Request<TParams, unknown, TBody, TQuery> {
  user?: JWTPayload;
}
