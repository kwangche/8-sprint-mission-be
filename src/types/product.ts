import { User } from './user';

// 상품 기본 타입
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  favoriteCount: number;
  images: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  ownerNickname?: string;
  owner?: User;
  isFavorite?: boolean;
}

// 상품 생성 데이터
export interface CreateProductData {
  name: string;
  description?: string | null;
  price: number;
  images?: string[];
  tags?: string[];
  ownerId: string;
}

// 상품 수정 데이터
export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  tags?: string[];
}

// 상품 목록 응답
export interface ProductsResponse {
  products?: Product[];
  list?: Product[];
  totalCount?: number;
}

// 상품 검색/정렬 파라미터
export interface ProductParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  keyword?: string;
}

// 상품 좋아요 (Favorite)
export interface ProductFavorite {
  id: string;
  productId: string;
  userId: string;
  createdAt: Date;
}
