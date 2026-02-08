import { Response } from 'express';

import { productRepository } from '../repositories/productRepository.js';
import { mapOrderBy, mapImagesToUrls } from '../utils/queryMapper.js';

import type { CreateProductInput, ProductQuery, UpdateProductInput } from '../schemas/index.js';
import type { AuthenticatedRequest } from '../types/express.js';

export const productController = {
  // 상품 목록 조회 (좋아요 상태 포함, limit 지원)
  async getProducts(req: AuthenticatedRequest<unknown, ProductQuery>, res: Response): Promise<void> {
    const { orderBy, limit } = req.query;
    const userId = req.user?.userId;

    const order = mapOrderBy(orderBy);
    const take = limit ? Number(limit) : undefined;

    const products = await productRepository.findManyWithLikes({
      orderBy: order,
      userId,
      take,
    });
    res.json({ list: products });
  },

  // 상품 단건 조회 (댓글, 좋아요 상태 포함)
  async getProductById(req: AuthenticatedRequest<unknown, unknown, { id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.userId;

    const product = await productRepository.findByIdWithDetails(id, userId);

    if (!product) {
      res.status(404).json({ message: 'Cannot find given id.' });
      return;
    }

    res.json(product);
  },

  // 상품 등록
  async createProduct(req: AuthenticatedRequest<CreateProductInput>, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { name, description, price, tags, images } = req.body;
    const imageUrls = mapImagesToUrls(images, req.file);

    const newProduct = await productRepository.create({
      ownerId: userId,
      name,
      description: description ?? null,
      price,
      tags,
      images: imageUrls,
    });

    res.status(201).json(newProduct);
  },

  // 상품 수정
  async updateProduct(req: AuthenticatedRequest<UpdateProductInput, unknown, { id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    const { images, ...updateData } = req.body;
    const imageUrls = mapImagesToUrls(images, req.file);
    
    const updatePayload: UpdateProductInput & { images?: string[] } = {
      ...updateData,
      ...(imageUrls.length > 0 && { images: imageUrls }),
    };

    const product = await productRepository.update(id, updatePayload);
    res.json(product);
  },

  // 상품 삭제
  async deleteProduct(req: AuthenticatedRequest<unknown, unknown, { id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    await productRepository.delete(id);
    res.sendStatus(204);
  },
};
