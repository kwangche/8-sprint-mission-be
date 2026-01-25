import prisma from '../../prisma/prismaClient.js';
import { CreateUserData, UpdateUserData } from '../types/index.js';

export const userRepository = {
  // 사용자 생성
  async create({ email, nickname, password }: CreateUserData) {
    return await prisma.user.create({
      data: { email, nickname, password },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // 사용자 단건 조회
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id, deleted: false },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // 이메일로 사용자 조회 (로그인 등에 사용)
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email, deleted: false },
    });
  },

  // 이메일로 사용자 조회 (비밀번호 포함)
  async findByEmailWithPassword(email: string) {
    return await prisma.user.findUnique({
      where: { email, deleted: false },
      select: {
        id: true,
        email: true,
        nickname: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // 사용자 수정
  async update(id: string, data: UpdateUserData) {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // 사용자 삭제 (soft delete)
  async delete(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { deleted: true },
    });
  },
};
