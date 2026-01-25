import express from 'express';
import { productController } from '../controllers/productController.js';
import { productFavoriteController } from '../controllers/productFavoriteController.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { validateUUID, validateProduct } from '../middlewares/validation.js';
import { upload } from '../middlewares/upload.js';
import {
  authenticate,
  optionalAuthenticate,
  authorizeOwner,
} from '../middlewares/auth.js';
import { productRepository } from '../repositories/productRepository.js';

const router = express.Router();

// 상품 목록 조회 (좋아요 상태 포함, limit 지원)
router.get(
  '/',
  optionalAuthenticate,
  asyncHandler(productController.getProducts)
);

// 상품 단건 조회 (댓글, 좋아요 상태 포함)
router.get(
  '/:id',
  optionalAuthenticate,
  validateUUID,
  asyncHandler(productController.getProductById)
);

// 상품 등록 (로그인 필수)
router.post(
  '/',
  authenticate,
  validateProduct,
  upload.single('image'),
  asyncHandler(productController.createProduct)
);

// 상품 수정 (로그인 + 본인 확인)
router.patch(
  '/:id',
  authenticate,
  validateUUID,
  authorizeOwner<{ id: string }>(async req => {
    const product = await productRepository.findById(req.params.id);
    return product?.userId || null;
  }),
  upload.single('image'),
  asyncHandler(productController.updateProduct)
);

// 상품 삭제 (로그인 + 본인 확인)
router.delete(
  '/:id',
  authenticate,
  validateUUID,
  authorizeOwner(async req => {
    const product = await productRepository.findById(req.params.id);
    return product?.userId || null;
  }),
  asyncHandler(productController.deleteProduct)
);

// 좋아요 토글 (로그인 필수)
router.post(
  '/:id/favorite',
  authenticate,
  validateUUID,
  asyncHandler(productFavoriteController.toggleFavorite)
);

export default router;
