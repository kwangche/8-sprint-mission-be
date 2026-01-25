/**
 * 쿼리 파라미터 변환 유틸리티
 */

/**
 * orderBy 파라미터를 Prisma orderBy 객체로 변환
 */
export function mapOrderBy(orderBy?: string) {
  switch (orderBy) {
    case 'price':
      return { price: 'desc' as const };
    case 'favorite':
      return { favoriteCount: 'desc' as const };
    case 'recent':
    default:
      return { createdAt: 'desc' as const };
  }
}

/**
 * 검색어를 Prisma where 조건으로 변환
 */
export function mapSearchToWhere(search: string, fields: string[]) {
  if (!search) return {};
  
  return {
    OR: fields.map(field => ({
      [field]: { contains: search, mode: 'insensitive' as const }
    }))
  };
}

/**
 * 페이지네이션 파라미터를 skip/take로 변환
 */
export function mapPagination(page: number = 1, limit: number = 10) {
  const pageNum = Number(page);
  const limitNum = Number(limit);
  
  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
}

/**
 * 이미지 데이터를 URL 배열로 변환
 */
export function mapImagesToUrls(
  images?: string[],
  file?: Express.Multer.File
): string[] {
  if (images && Array.isArray(images)) {
    return images;
  }
  
  if (file) {
    return [`/uploads/products/${file.filename}`];
  }
  
  return [];
}
