import prisma from '../../prisma/prismaClient.js';

interface ToggleParams {
  userId: string;
  productId: string;
}

interface FindOneParams {
  userId: string;
  productId: string;
}

interface FindManyParams {
  userId: string;
  productIds: string[];
}

export const productFavoriteRepository = {
  // 좋아요 토글 (upsert + favoriteState 토글)
  async toggle({ userId, productId }: ToggleParams) {
    return await prisma.$transaction(async tx => {
      // 현재 상태 확인
      const existing = await tx.productFavorite.findUnique({
        where: { userId_productId: { userId, productId } },
      });

      const newState = existing ? !existing.favoriteState : true;
      const countChange = newState ? 1 : -1;

      // upsert로 생성 또는 업데이트
      const favorite = await tx.productFavorite.upsert({
        where: { userId_productId: { userId, productId } },
        create: {
          userId,
          productId,
          favoriteState: true,
        },
        update: {
          favoriteState: newState,
        },
      });

      // favoriteCount 조정
      await tx.product.update({
        where: { id: productId },
        data: { favoriteCount: { increment: countChange } },
      });

      return { favorite, isLiked: newState };
    });
  },

  // 좋아요 상태 확인
  async findOne({ userId, productId }: FindOneParams) {
    return await prisma.productFavorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
  },

  // 사용자의 특정 상품들에 대한 좋아요 상태 조회
  async findMany({ userId, productIds }: FindManyParams) {
    return await prisma.productFavorite.findMany({
      where: {
        userId,
        productId: { in: productIds },
        favoriteState: true, // true인 것만 조회
      },
    });
  },
};
