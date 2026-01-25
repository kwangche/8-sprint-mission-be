import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/express.js';
import { JWTPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 인증 필수 미들웨어
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED',
      });
      return;
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

// 인증 선택 미들웨어 (토큰이 있으면 검증, 없어도 통과)
export const optionalAuthenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.accessToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      req.user = decoded;
    } catch (error) {
      // 토큰이 유효하지 않아도 에러를 발생시키지 않음
      req.user = undefined;
    }
  }

  next();
};

// 리소스 소유자 확인 미들웨어
export const authorizeOwner = <TParams = unknown>(
  getResourceOwner: (req: AuthenticatedRequest<unknown, unknown, TParams>) => Promise<string | null>
) => {
  return async (
    req: AuthenticatedRequest<unknown, unknown, TParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      const resourceOwnerId = await getResourceOwner(req);

      if (!resourceOwnerId) {
        res.status(404).json({ message: 'Resource not found' });
        return;
      }

      if (resourceOwnerId !== userId) {
        res.status(403).json({ message: 'Forbidden: You do not have permission' });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
