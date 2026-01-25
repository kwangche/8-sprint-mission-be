import express from 'express';
import { userController } from '../controllers/userController.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import {
  validateUser,
  validateUUID,
  validateLogin,
} from '../middlewares/validation.js';

const router = express.Router();

// 로그인
router.post('/signIn', validateLogin, asyncHandler(userController.login));

// 로그아웃
router.post('/logout', asyncHandler(userController.logout));

// 토큰 갱신
router.post('/refresh', asyncHandler(userController.refreshToken));

// 사용자 등록
router.post('/signUp', validateUser, asyncHandler(userController.createUser));

// 사용자 단건 조회
router.get('/:id', validateUUID, asyncHandler(userController.getUserById));

// 사용자 수정
router.patch('/:id', validateUUID, asyncHandler(userController.updateUser));

// 사용자 삭제
router.delete('/:id', validateUUID, asyncHandler(userController.deleteUser));

export default router;
