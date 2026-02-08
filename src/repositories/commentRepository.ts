import prisma from '../../prisma/prismaClient.js';

interface CreateCommentForArticleParams {
  userId: string;
  content: string;
  articleId: string;
}

interface CreateCommentForProductParams {
  userId: string;
  content: string;
  productId: string;
}

interface UpdateCommentParams {
  content: string;
}

export const commentRepository = {
  // 댓글 생성 (Article용)
  async createForArticle({ userId, content, articleId }: CreateCommentForArticleParams) {
    return await prisma.comment.create({
      data: { userId, content, articleId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
    });
  },

  // 댓글 생성 (Product용)
  async createForProduct({ userId, content, productId }: CreateCommentForProductParams) {
    return await prisma.comment.create({
      data: { userId, content, productId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
    });
  },

  // 댓글 수정
  async update(id: string, { content }: UpdateCommentParams) {
    return await prisma.comment.update({
      where: { id },
      data: { content },
    });
  },

  // 댓글 삭제 (soft delete)
  async delete(id: string) {
    return await prisma.comment.update({
      where: { id },
      data: { deleted: true },
    });
  },

  // 댓글 조회 (단일)
  async findById(id: string) {
    return await prisma.comment.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        content: true,
        createdAt: true,
        deleted: true,
      },
    });
  },

  // Article 댓글 목록 조회 (cursor)
  async findManyByArticle({ articleId, cursor, take }: { articleId: string; cursor?: string; take: number }) {
    return await prisma.comment.findMany({
      where: { articleId, deleted: false },
      orderBy: { createdAt: 'desc' },
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      take,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
    });
  },

  // Product 댓글 목록 조회 (cursor)
  async findManyByProduct({ productId, cursor, take }: { productId: string; cursor?: string; take: number }) {
    return await prisma.comment.findMany({
      where: { productId, deleted: false },
      orderBy: { createdAt: 'desc' },
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      take,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
    });
  },
};
