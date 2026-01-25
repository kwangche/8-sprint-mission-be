// 사용자 기본 타입
export interface User {
  id: string;
  email: string;
  nickname?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 사용자 업데이트 데이터
export interface UpdateUserData {
  nickname?: string;
}

// 사용자 생성 데이터 (DB용)
export interface CreateUserData {
  email: string;
  nickname: string;
  password: string;
}
