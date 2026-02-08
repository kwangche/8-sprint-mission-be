import { Response } from 'express';

import { CreateCommentInput, UpdateCommentInput, CommentQuery } from '../schemas/index.js';
import { commentService } from '../services/commentService.js';

import type { AuthenticatedRequest } from '../types/express.js';

export const commentController = {
  // 자유게시판 댓글 등록
  async createArticleComment(req: AuthenticatedRequest<CreateCommentInput, unknown, { articleId: string }>, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { content } = req.body;
    const { articleId } = req.params;

    const comment = await commentService.createArticleComment(userId, content, articleId);
    res.status(201).json(comment);
  },

  // 중고마켓 댓글 등록
  async createProductComment(req: AuthenticatedRequest<CreateCommentInput, unknown, { productId: string }>, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { content } = req.body;
    const { productId } = req.params;

    const comment = await commentService.createProductComment(userId, content, productId);
    res.status(201).json(comment);
  },

  // 댓글 수정
  async updateComment(req: AuthenticatedRequest<UpdateCommentInput, unknown, { id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await commentService.updateComment(id, content);
    res.json(comment);
  },

  // 댓글 삭제
  async deleteComment(req: AuthenticatedRequest<unknown, unknown, { id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    await commentService.deleteComment(id);
    res.sendStatus(204);
  },

  // 자유게시판 댓글 목록 조회
  async getArticleComments(req: AuthenticatedRequest<unknown, CommentQuery, { articleId: string }>, res: Response): Promise<void> {
    const { articleId } = req.params;
    const { cursor, limit = 10 } = req.query;

    const comments = await commentService.getArticleComments(articleId, cursor, Number(limit));

    res.json({ list: comments });
  },

  // 중고마켓 댓글 목록 조회
  async getProductComments(req: AuthenticatedRequest<unknown, CommentQuery, { productId: string }>, res: Response): Promise<void> {
    const { productId } = req.params;
    const { cursor, limit = 10 } = req.query;

    const comments = await commentService.getProductComments(productId, cursor, Number(limit));

    res.json({ list: comments });
  },
};
