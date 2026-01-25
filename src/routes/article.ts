import express from 'express';
import { articleController } from '../controllers/articleController.js';
import { articleFavoriteController } from '../controllers/articleFavoriteController.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import {
  validateUUID,
  validateArticleData,
} from '../middlewares/validation.js';
import {
  authenticate,
  optionalAuthenticate,
  authorizeOwner,
} from '../middlewares/auth.js';
import { articleRepository } from '../repositories/articleRepository.js';

const router = express.Router();

// 게시글 목록 조회 (검색, 최신순, offset 페이지네이션)
router.get(
  '/',
  optionalAuthenticate,
  asyncHandler(articleController.getArticles)
);

// 게시글 등록 (로그인 필수)
router.post(
  '/',
  authenticate,
  validateArticleData,
  asyncHandler(articleController.createArticle)
);

// 게시글 단건 조회 (댓글, 좋아요 상태 포함)
router.get(
  '/:id',
  optionalAuthenticate,
  validateUUID,
  asyncHandler(articleController.getArticleById)
);

// 게시글 수정 (로그인 + 본인 확인)
router.patch(
  '/:id',
  authenticate,
  validateUUID,
  authorizeOwner<{ id: string }>(async req => {
    const article = await articleRepository.findById(req.params.id);
    return article?.writer.id || null;
  }),
  asyncHandler(articleController.updateArticle)
);

// 게시글 삭제 (로그인 + 본인 확인)
router.delete(
  '/:id',
  authenticate,
  validateUUID,
  authorizeOwner<{ id: string }>(async req => {
    const article = await articleRepository.findById(req.params.id);
    return article?.writer.id || null;
  }),
  asyncHandler(articleController.deleteArticle)
);

// 좋아요 토글 (로그인 필수)
router.post(
  '/:id/favorite',
  authenticate,
  validateUUID,
  asyncHandler(articleFavoriteController.toggleFavorite)
);

export default router;
