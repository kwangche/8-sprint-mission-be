import { User } from './user';

// 회원가입 요청 데이터
export interface SignUpData {
  email: string;
  nickname: string;
  password: string;
}

// 로그인 요청 데이터
export interface SignInData {
  email: string;
  password: string;
}

// 토큰 갱신 요청 데이터
export interface RefreshTokenData {
  refreshToken: string;
}

// 회원가입 응답
export interface SignUpResponse {
  message?: string;
  user?: User;
}

// 로그인 응답
export interface SignInResponse {
  message?: string;
  user?: User;
  refreshToken?: string;
}

// 토큰 갱신 응답
export interface RefreshTokenResponse {
  message?: string;
  user?: User;
}

// 로그아웃 응답
export interface SignOutResponse {
  message?: string;
}

// JWT 페이로드
export interface JWTPayload {
  userId: string;
  email: string;
}
