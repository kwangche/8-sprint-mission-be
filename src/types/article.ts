import { User } from './user';

// 게시글 기본 타입
export interface Article {
  id: string;
  title: string;
  content: string;
  image?: string;
  favoriteCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  writerId: string;
  writer: User;
  isFavorite?: boolean;
  likes?: number;
}

// 게시글 생성 데이터
export interface CreateArticleData {
  title: string;
  content: string;
  image?: string;
  writerId: string;
}

// 게시글 수정 데이터
export interface UpdateArticleData {
  title?: string;
  content?: string;
  image?: string;
}

// 게시글 목록 응답
export interface ArticlesResponse {
  articles: Article[];
  totalCount?: number;
}

// 게시글 검색/정렬 파라미터
export interface ArticleParams {
  page?: number;
  limit?: number;
  sort?: 'recent' | 'favorite';
  search?: string;
}

// 게시글 좋아요 응답
export interface ArticleFavoriteResponse {
  isLiked: boolean;
  favoriteCount: number;
}

// 게시글 좋아요 (Favorite)
export interface ArticleFavorite {
  id: string;
  articleId: string;
  userId: string;
  createdAt: Date;
}
