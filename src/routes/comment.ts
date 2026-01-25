import express from 'express';
import { commentController } from '../controllers/commentController.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import {
  validateUUID,
  validateParamUUID,
  validateCommentData,
  validateCommentQuery,
} from '../middlewares/validation.js';
import { authenticate, authorizeOwner } from '../middlewares/auth.js';
import { commentRepository } from '../repositories/commentRepository.js';

const router = express.Router();

// 자유게시판 댓글 목록 조회
router.get(
  '/article/:articleId',
  validateParamUUID('articleId'),
  validateCommentQuery,
  asyncHandler(commentController.getArticleComments) as unknown as express.RequestHandler
);

// 중고마켓 댓글 목록 조회
router.get(
  '/product/:productId',
  validateParamUUID('productId'),
  validateCommentQuery,
  asyncHandler(commentController.getProductComments) as unknown as express.RequestHandler
);

// 자유게시판 댓글 등록 (로그인 필수)
router.post(
  '/article/:articleId',
  authenticate,
  validateParamUUID('articleId'),
  validateCommentData,
  asyncHandler(commentController.createArticleComment)
);

// 중고마켓 댓글 등록 (로그인 필수)
router.post(
  '/product/:productId',
  authenticate,
  validateParamUUID('productId'),
  validateCommentData,
  asyncHandler(commentController.createProductComment)
);

// 댓글 수정 (로그인 + 본인 확인)
router.patch(
  '/:id',
  authenticate,
  validateUUID,
  authorizeOwner<{ id: string }>(async req => {
    const comment = await commentRepository.findById(req.params.id);
    return comment?.userId || null;
  }),
  asyncHandler(commentController.updateComment)
);

// 댓글 삭제 (로그인 + 본인 확인)
router.delete(
  '/:id',
  authenticate,
  validateUUID,
  authorizeOwner<{ id: string }>(async req => {
    const comment = await commentRepository.findById(req.params.id);
    return comment?.userId || null;
  }),
  asyncHandler(commentController.deleteComment)
);

export default router;
