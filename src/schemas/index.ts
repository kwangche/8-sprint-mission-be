import { z } from 'zod';

// ================== User Schemas ==================

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  nickname: z.string().min(1).max(50),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  nickname: z.string().min(1, { message: 'Nickname is required' }).max(50),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const updateUserSchema = z.object({
  nickname: z.string().min(1).max(50).optional(),
});

// ================== Auth Schemas ==================

export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  nickname: z.string().min(1, { message: 'Nickname is required' }).max(50),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token is required' }),
});

// ================== Product Schemas ==================

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number().positive(),
  favoriteCount: z.number().int().nonnegative(),
  images: z.array(z.string()),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  ownerId: z.string().uuid(),
  ownerNickname: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }).max(50),
  description: z.string().max(500).optional(),
  price: z.number().positive({ message: 'Price must be positive' }),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(500).optional(),
  price: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  orderBy: z.enum(['recent', 'favorite', 'price']).optional().default('recent'),
  keyword: z.string().optional(),
  sort: z.enum(['recent', 'favorite', 'price']).optional(),
  limit: z.coerce.number().int().positive().optional(),
});

// ================== Article Schemas ==================

export const articleSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  image: z.string().optional(),
  favoriteCount: z.number().int().nonnegative(),
  viewCount: z.number().int().nonnegative().optional().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
  writerId: z.string().uuid(),
  isFavorite: z.boolean().optional(),
});

export const createArticleSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(100),
  content: z.string().min(1, { message: 'Content is required' }).max(2000),
  image: z.string().optional(),
});

export const updateArticleSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).max(2000).optional(),
  image: z.string().optional(),
});

export const articleQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  orderBy: z.enum(['recent', 'favorite']).optional().default('recent'),
  search: z.string().optional().default(''),
});

// ================== Comment Schemas ==================

export const commentSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  writerId: z.string().uuid(),
  productId: z.string().uuid().optional(),
  articleId: z.string().uuid().optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, { message: 'Content is required' }).max(1000),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, { message: 'Content is required' }).max(1000),
});

export const commentQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional().default(10),
  cursor: z.string().uuid().optional(),
});

// ================== UUID Validation ==================

export const uuidSchema = z.string().uuid({ message: 'Invalid UUID format' });

// ================== Type Inference ==================

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export type Product = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;

export type Article = z.infer<typeof articleSchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ArticleQuery = z.infer<typeof articleQuerySchema>;

export type Comment = z.infer<typeof commentSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CommentQuery = z.infer<typeof commentQuerySchema>;
