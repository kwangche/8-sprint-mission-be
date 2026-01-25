import prisma from '../../prisma/prismaClient.js';
import { CreateArticleData, UpdateArticleData } from '../types/index.js';
import { Prisma } from '@prisma/client';

interface FindManyParams {
  where?: Prisma.ArticleWhereInput;
  orderBy?: Prisma.ArticleOrderByWithRelationInput | Prisma.ArticleOrderByWithRelationInput[];
  skip?: number;
  take?: number;
}

interface FindManyWithLikesParams extends FindManyParams {
  userId?: string | null;
}

export const articleRepository = {
  // 게시글 생성
  async create({ writerId, title, content }: Omit<CreateArticleData, 'image'> & { writerId: string }) {
    const article = await prisma.article.create({
      data: { userId: writerId, title, content },
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
    
    const { user, ...rest } = article;
    return { ...rest, writer: user };
  },

  // 게시글 단건 조회
  async findById(id: string) {
    const article = await prisma.article.findUnique({
      where: { id, deleted: false },
      select: {
        id: true,
        title: true,
        content: true,
        favoriteCount: true,
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
    
    if (!article) return null;
    const { user, ...rest } = article;
    return { ...rest, writer: user };
  },

  // 게시글 단건 조회 (댓글, 좋아요 상태 포함)
  async findByIdWithDetails(id: string, userId: string | null = null) {
    const article = await prisma.article.findUnique({
      where: { id, deleted: false },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        comments: {
          where: { deleted: false },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                nickname: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        articleFavorites: userId
          ? {
              where: { userId, favoriteState: true },
              select: { id: true },
            }
          : false,
      },
    });

    if (!article) return null;

    // isLiked 필드 추가 및 user를 writer로 변환
    const { articleFavorites, user, comments, ...rest } = article;
    return {
      ...rest,
      writer: user,
      comments: comments.map(comment => {
        const { user: commentUser, ...commentRest } = comment;
        return { ...commentRest, writer: commentUser };
      }),
      isLiked: userId && Array.isArray(articleFavorites) ? articleFavorites.length > 0 : false,
    };
  },

  // 게시글 수정
  async update(id: string, { title, content }: Omit<UpdateArticleData, 'image'>) {
    return await prisma.article.update({
      where: { id },
      data: { title, content },
    });
  },

  // 게시글 삭제 (soft delete)
  async delete(id: string) {
    return await prisma.article.update({
      where: { id },
      data: { deleted: true },
    });
  },

  // 게시글 개수 조회
  async count(where: Prisma.ArticleWhereInput = {}) {
    return await prisma.article.count({
      where: { ...where, deleted: false },
    });
  },

  // 게시글 목록 조회
  async findMany({ where, orderBy, skip, take }: FindManyParams) {
    const articles = await prisma.article.findMany({
      where: { ...where, deleted: false },
      orderBy,
      skip,
      take,
      select: {
        id: true,
        title: true,
        content: true,
        favoriteCount: true,
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
    
    return articles.map(article => {
      const { user, ...rest } = article;
      return { ...rest, writer: user };
    });
  },

  // 게시글 목록 조회 (좋아요 상태 포함)
  async findManyWithLikes({ where, orderBy, skip, take, userId }: FindManyWithLikesParams) {
    const articles = await prisma.article.findMany({
      where: { ...where, deleted: false },
      orderBy,
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        articleFavorites: userId
          ? {
              where: { userId, favoriteState: true },
              select: { id: true },
            }
          : false,
      },
    });

    // isLiked 필드 추가 및 user를 writer로 변환
    return articles.map(article => {
      const { articleFavorites, user, ...rest } = article;
      return {
        ...rest,
        writer: user,
        isLiked: userId && Array.isArray(articleFavorites) ? articleFavorites.length > 0 : false,
      };
    });
  },
};
