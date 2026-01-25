import prisma from '../../prisma/prismaClient.js';
import { CreateProductData, UpdateProductData } from '../types/index.js';
import { Prisma } from '@prisma/client';

interface FindManyWithLikesParams {
  where?: Prisma.ProductWhereInput;
  orderBy?: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];
  skip?: number;
  take?: number;
  userId?: string | null;
}

export const productRepository = {
  // 상품 목록 조회 (좋아요 상태 포함)
  async findManyWithLikes({ where, orderBy, skip, take, userId }: FindManyWithLikesParams) {
    const products = await prisma.product.findMany({
      where: { ...where, deleted: false },
      skip,
      take,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        productFavorites: userId
          ? {
              where: { userId, favoriteState: true },
              select: { id: true },
            }
          : false,
      },
    });

    return products.map(product => {
      const { productFavorites, price, ...rest } = product;
      return {
        ...rest,
        price: Number(price),
        isLiked: userId && Array.isArray(productFavorites) ? productFavorites.length > 0 : false,
      };
    });
  },

  // 상품 단건 조회
  async findById(id: string) {
    return await prisma.product.findUnique({
      where: { id, deleted: false },
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

  // 상품 단건 조회 (댓글, 좋아요 상태 포함)
  async findByIdWithDetails(id: string, userId: string | null = null) {
    const product = await prisma.product.findUnique({
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
        productFavorites: userId
          ? {
              where: { userId, favoriteState: true },
              select: { id: true },
            }
          : false,
      },
    });

    if (!product) return null;

    const { productFavorites, price, ...rest } = product;
    return {
      ...rest,
      price: Number(price),
      isLiked: userId && Array.isArray(productFavorites) ? productFavorites.length > 0 : false,
    };
  },

  async create({ ownerId, name, description, price, tags, images }: CreateProductData & { ownerId: string }) {
    return await prisma.product.create({
      data: { userId: ownerId, name, description, price, tags: tags || [], images: images || [] },
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

  // 상품 수정
  async update(id: string, data: UpdateProductData) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  },

  // 상품 삭제 (soft delete)
  async delete(id: string) {
    return await prisma.product.update({
      where: { id },
      data: { deleted: true },
    });
  },
};
