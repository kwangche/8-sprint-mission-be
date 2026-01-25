import { Response } from 'express';
import { productFavoriteRepository } from '../repositories/productFavoriteRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { AuthenticatedRequest } from '../types/express.js';

export const productFavoriteController = {
  // 좋아요 토글 (favoriteState 기반)
  async toggleFavorite(req: AuthenticatedRequest<unknown, unknown, { id: string }>, res: Response): Promise<void> {
    const { id: productId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // 상품 존재 확인
    const product = await productRepository.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // upsert로 favoriteState 토글
    const { isLiked } = await productFavoriteRepository.toggle({
      userId,
      productId,
    });

    // 업데이트된 상품 정보 조회
    const updatedProduct = await productRepository.findById(productId);

    res.status(200).json({
      message: isLiked
        ? 'Product liked successfully'
        : 'Product unliked successfully',
      isLiked,
      favoriteCount: updatedProduct?.favoriteCount || 0,
    });
  },
};
