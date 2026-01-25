import { Response } from 'express';
import { userRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/express.js';
import { SignInInput, SignUpInput, RefreshTokenInput, UpdateUserInput } from '../schemas/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES_IN = '30m';
const ACCESS_TOKEN_MAX_AGE = 30 * 60 * 1000; // 30분

interface UserPayload {
  id: string;
  email: string;
  nickname: string;
}

// Access Token 생성 헬퍼 함수
const generateAccessToken = (user: UserPayload): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
};

// Refresh Token 생성 헬퍼 함수
const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET);
};

// Access Token 쿠키 설정 헬퍼 함수
const setAccessTokenCookie = (res: Response, accessToken: string): void => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
};

export const userController = {
  // 사용자 등록
  async createUser(req: AuthenticatedRequest<SignUpInput>, res: Response): Promise<void> {
    const { email, nickname, password } = req.body;

    // 이메일 중복 체크
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await userRepository.create({
      email,
      nickname,
      password: hashedPassword,
    });
    res.status(201).json(user);
  },

  // 로그인
  async login(req: AuthenticatedRequest<SignInInput>, res: Response): Promise<void> {
    const { email, password } = req.body;

    // 사용자 조회
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // 토큰 생성
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);

    // Access Token 쿠키 설정
    setAccessTokenCookie(res, accessToken);

    // 비밀번호 제외한 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      refreshToken,
    });
  },

  // 로그아웃
  async logout(_req: AuthenticatedRequest, res: Response): Promise<void> {
    res.clearCookie('accessToken');
    res.json({ message: 'Logout successful' });
  },

  // 토큰 갱신
  async refreshToken(req: AuthenticatedRequest<RefreshTokenInput>, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token required' });
      return;
    }

    try {
      // Refresh Token 검증
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };

      // 사용자 존재 확인
      const user = await userRepository.findById(decoded.id);
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      // 새로운 Access Token 생성 및 쿠키 설정
      const newAccessToken = generateAccessToken(user);
      setAccessTokenCookie(res, newAccessToken);

      res.json({
        message: 'Token refreshed successfully',
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
        },
      });
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  },

  // 사용자 단건 조회
  async getUserById(req: AuthenticatedRequest<unknown, unknown, { id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await userRepository.findById(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  },

  // 사용자 수정
  async updateUser(req: AuthenticatedRequest<UpdateUserInput, unknown, { id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    const { nickname } = req.body;

    const user = await userRepository.update(id, { nickname });
    res.json(user);
  },

  // 사용자 삭제 (soft delete)
  async deleteUser(req: AuthenticatedRequest<unknown, unknown, { id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    await userRepository.delete(id);
    res.sendStatus(204);
  },
};
