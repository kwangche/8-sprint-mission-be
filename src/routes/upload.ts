import express, { Request, Response, NextFunction } from 'express';
import { uploadMultiple } from '../middlewares/upload.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

// 다중 이미지 업로드 (최대 3개)
router.post(
  '/images',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    uploadMultiple(req, res, err => {
      if (err) {
        res.status(400).json({
          message: err.message || '이미지 업로드에 실패했습니다.',
        });
        return;
      }

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({
          message: '최소 1개의 이미지를 업로드해야 합니다.',
        });
        return;
      }

      // 업로드된 이미지 URL 목록 생성
      const imageUrls = req.files.map(
        (file: Express.Multer.File) => `/uploads/products/${file.filename}`
      );

      res.status(200).json({
        message: '이미지 업로드 성공',
        images: imageUrls,
      });
    });
  })
);

// 단일 이미지 업로드
router.post(
  '/image',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { upload } = await import('../middlewares/upload.js');

    upload.single('image')(req, res, err => {
      if (err) {
        res.status(400).json({
          message: err.message || '이미지 업로드에 실패했습니다.',
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          message: '이미지를 업로드해야 합니다.',
        });
        return;
      }

      const imageUrl = `/uploads/products/${req.file.filename}`;

      res.status(200).json({
        message: '이미지 업로드 성공',
        imageUrl,
      });
    });
  })
);

export default router;
