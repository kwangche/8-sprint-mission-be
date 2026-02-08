import prisma from '../../prisma/prismaClient.js';

interface ToggleParams {
  userId: string;
  articleId: string;
}

interface FindOneParams {
  userId: string;
  articleId: string;
}

interface FindManyParams {
  userId: string;
  articleIds: string[];
}

export const articleFavoriteRepository = {
  // 좋아요 토글 (upsert + favoriteState 토글)
  async toggle({ userId, articleId }: ToggleParams) {
    return await prisma.$transaction(async tx => {
      // 현재 상태 확인
      const existing = await tx.articleFavorite.findUnique({
        where: { userId_articleId: { userId, articleId } },
      });

      const newState = existing ? !existing.favoriteState : true;
      const countChange = newState ? 1 : -1;

      // upsert로 생성 또는 업데이트
      const favorite = await tx.articleFavorite.upsert({
        where: { userId_articleId: { userId, articleId } },
        create: {
          userId,
          articleId,
          favoriteState: true,
        },
        update: {
          favoriteState: newState,
        },
      });

      // favoriteCount 조정
      await tx.article.update({
        where: { id: articleId },
        data: { favoriteCount: { increment: countChange } },
      });

      return { favorite, isLiked: newState };
    });
  },

  // 좋아요 상태 확인
  async findOne({ userId, articleId }: FindOneParams) {
    return await prisma.articleFavorite.findUnique({
      where: {
        userId_articleId: { userId, articleId },
      },
    });
  },

  // 사용자의 특정 게시글들에 대한 좋아요 상태 조회
  async findMany({ userId, articleIds }: FindManyParams) {
    return await prisma.articleFavorite.findMany({
      where: {
        userId,
        articleId: { in: articleIds },
        favoriteState: true, // true인 것만 조회
      },
    });
  },
};
