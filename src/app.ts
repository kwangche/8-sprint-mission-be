import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/user.js';
import articleRouter from './routes/article.js';
import commentRouter from './routes/comment.js';
import productRouter from './routes/product.js';
import uploadRouter from './routes/upload.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { swaggerUi, specs } from './swagger.js';

dotenv.config();
console.log('Prisma ready');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000', // 특정 출처만 허용
    credentials: true, // 쿠키 허용
  })
);
app.use(express.json());
app.use(cookieParser());

// 정적 파일 제공 (업로드된 이미지)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger 문서
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// User API
app.use('/auth', userRouter);
// Product(중고마켓) API
app.use('/products', productRouter);
// Article(자유게시판) API
app.use('/articles', articleRouter);
// Comment(댓글) API
app.use('/comments', commentRouter);
// Upload(파일 업로드) API
app.use('/upload', uploadRouter);

// 에러 핸들러 (라우터 등록 후 마지막에 추가)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT || 4000, () => console.log('Server Started'));
