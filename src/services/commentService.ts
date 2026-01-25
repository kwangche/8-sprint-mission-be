/**
 * 댓글 서비스 레이어
 * 비즈니스 로직 처리 및 데이터 가공
 */

import { commentRepository } from '../repositories/commentRepository.js';

/**
 * user 필드를 writer로 변환하는 헬퍼 함수
 */
function transformCommentData<T extends { user: any }>(comment: T) {
  const { user, ...rest } = comment;
  return {
    ...rest,
    writer: user,
  };
}

export const commentService = {
  /**
   * 게시글 댓글 생성
   */
  async createArticleComment(userId: string, content: string, articleId: string) {
    const comment = await commentRepository.createForArticle({
      userId,
      content,
      articleId,
    });
    return transformCommentData(comment);
  },

  /**
   * 상품 댓글 생성
   */
  async createProductComment(userId: string, content: string, productId: string) {
    const comment = await commentRepository.createForProduct({
      userId,
      content,
      productId,
    });
    return transformCommentData(comment);
  },

  /**
   * 댓글 수정
   */
  async updateComment(id: string, content: string) {
    return await commentRepository.update(id, { content });
  },

  /**
   * 댓글 삭제
   */
  async deleteComment(id: string) {
    return await commentRepository.delete(id);
  },

  /**
   * 댓글 단건 조회
   */
  async getCommentById(id: string) {
    return await commentRepository.findById(id);
  },

  /**
   * 게시글 댓글 목록 조회
   */
  async getArticleComments(articleId: string, cursor?: string, take: number = 10) {
    const comments = await commentRepository.findManyByArticle({
      articleId,
      cursor,
      take,
    });
    return comments.map(transformCommentData);
  },

  /**
   * 상품 댓글 목록 조회
   */
  async getProductComments(productId: string, cursor?: string, take: number = 10) {
    const comments = await commentRepository.findManyByProduct({
      productId,
      cursor,
      take,
    });
    return comments.map(transformCommentData);
  },
};
