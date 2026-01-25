/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding start...');

  // 1) 기존 데이터 정리 (FK 순서 유의)
  await prisma.comment.deleteMany();
  await prisma.articleFavorite.deleteMany();
  await prisma.productFavorite.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 2) 사용자 생성
  const hashedPassword = await bcrypt.hash('password123', 10);

  const usersData = [
    {
      email: 'user1@example.com',
      nickname: '철수',
      password: hashedPassword,
    },
    {
      email: 'user2@example.com',
      nickname: '영희',
      password: hashedPassword,
    },
    {
      email: 'user3@example.com',
      nickname: '민수',
      password: hashedPassword,
    },
    {
      email: 'admin@example.com',
      nickname: '관리자',
      password: hashedPassword,
    },
  ];

  const createdUsers = await Promise.all(
    usersData.map(data => prisma.user.create({ data })),
  );

  console.log(`✅ Created ${createdUsers.length} users`);

  // 3) 제품 더미 데이터 생성
  const productsData = [
    {
      userId: createdUsers[0].id,
      name: '귀여운 포메라니안 인형',
      description:
        '복슬복슬 하얀 포메라니안 강아지 인형입니다. 부드러운 소재로 만들어져 안아보면 기분이 좋아져요!',
      price: 49900,
      tags: ['인형', '강아지', '포메라니안', '선물'],
      favoriteCount: 42,
      images: ['/uploads/products/puppy-white.jpg'],
    },
    {
      userId: createdUsers[1].id,
      name: '포메라니안 아트 프린트',
      description:
        '블루 톤의 아티스틱한 강아지 프린트. 거실이나 방 인테리어에 완벽합니다.',
      price: 35000,
      tags: ['인테리어', '아트', '강아지', '포스터'],
      favoriteCount: 128,
      images: [
        '/uploads/products/puppy-blue.jpg',
        '/uploads/products/puppy-blue-2.jpg',
      ],
    },
    {
      userId: createdUsers[0].id,
      name: '빈티지 강아지 포스터',
      description:
        '흑백 감성의 포메라니안 포스터. 빈티지한 분위기를 연출하고 싶다면!',
      price: 28000,
      tags: ['포스터', '빈티지', '흑백', '감성'],
      favoriteCount: 35,
      images: ['/uploads/products/puppy-grayscale.jpg'],
    },
    {
      userId: createdUsers[2].id,
      name: '무선 기계식 키보드',
      description:
        '저소음 적축 무선 키보드. RGB 백라이트 지원으로 야간 작업도 편리합니다.',
      price: 89900,
      tags: ['전자제품', '키보드', '무선', '게이밍'],
      favoriteCount: 91,
      images: [],
    },
    {
      userId: createdUsers[1].id,
      name: '노이즈캔슬링 헤드폰',
      description:
        '액티브 노이즈 캔슬링 헤드폰. 통근길, 카페, 집 어디서나 나만의 음악 공간을 만들어보세요.',
      price: 199000,
      tags: ['오디오', '전자제품', '헤드폰'],
      favoriteCount: 203,
      images: [],
    },
    {
      userId: createdUsers[0].id,
      name: 'LED 모니터 27인치',
      description:
        '27인치 QHD(1440p) IPS 모니터. 선명한 화질과 넓은 시야각으로 작업 효율 UP!',
      price: 279900,
      tags: ['전자제품', '모니터', '디스플레이'],
      favoriteCount: 156,
      images: [],
    },
    {
      userId: createdUsers[3].id,
      name: '스마트워치 프로',
      description:
        '건강 관리부터 스마트 알림까지. 일상을 스마트하게 관리하는 웨어러블 디바이스.',
      price: 349000,
      tags: ['전자제품', '웨어러블', '스마트워치'],
      favoriteCount: 87,
      images: [],
    },
    {
      userId: createdUsers[2].id,
      name: '블루투스 스피커',
      description:
        '360도 사운드로 어디서나 최고의 음질을 즐기세요. 방수 기능 지원!',
      price: 79000,
      tags: ['오디오', '스피커', '블루투스', '방수'],
      favoriteCount: 64,
      images: [],
    },
  ];

  const createdProducts = await Promise.all(
    productsData.map(data => prisma.product.create({ data })),
  );

  console.log(`✅ Created ${createdProducts.length} products`);

  // 4) 게시글 더미 데이터 생성
  const articlesData = [
    {
      userId: createdUsers[0].id,
      title: 'Prisma로 시작하는 백엔드 개발',
      content:
        'Prisma 스키마 정의부터 Client 사용까지 기본기를 정리합니다. ORM을 사용하면 타입 안전성을 확보하면서도 생산성을 높일 수 있습니다.',
      favoriteCount: 15,
    },
    {
      userId: createdUsers[1].id,
      title: 'PostgreSQL 성능 튜닝 팁',
      content:
        '인덱스 전략과 실행계획을 통해 쿼리 성능을 개선합니다. EXPLAIN ANALYZE를 활용한 쿼리 최적화 방법을 소개합니다.',
      favoriteCount: 28,
    },
    {
      userId: createdUsers[2].id,
      title: 'TypeScript로 Node.js 프로젝트 구조화하기',
      content:
        '레이어드 구조와 타입 세이프티를 챙기는 방법을 다룹니다. Controller, Service, Repository 패턴을 적용해봅시다.',
      favoriteCount: 42,
    },
    {
      userId: createdUsers[3].id,
      title: 'REST API 설계 베스트 프랙티스',
      content:
        'RESTful한 API를 설계하기 위한 핵심 원칙들. HTTP 메서드, 상태 코드, 리소스 명명 규칙 등을 알아봅니다.',
      favoriteCount: 56,
    },
    {
      userId: createdUsers[0].id,
      title: 'JWT 인증 구현하기',
      content:
        'Access Token과 Refresh Token을 활용한 안전한 인증 시스템 구축. Sliding Session 전략도 함께 다룹니다.',
      favoriteCount: 33,
    },
    {
      userId: createdUsers[1].id,
      title: 'Docker로 개발 환경 구축하기',
      content:
        'Docker Compose를 활용하여 PostgreSQL, Redis 등 필요한 서비스들을 한 번에 실행해봅시다.',
      favoriteCount: 21,
    },
  ];

  const createdArticles = await Promise.all(
    articlesData.map(data => prisma.article.create({ data })),
  );

  console.log(`✅ Created ${createdArticles.length} articles`);

  // 5) 각 제품/글에 코멘트 생성
  const productComments = createdProducts.flatMap((p, i) => [
    prisma.comment.create({
      data: {
        userId: createdUsers[i % createdUsers.length].id,
        content: `이 제품 정말 마음에 들어요! 품질이 생각보다 훨씬 좋네요 👍`,
        productId: p.id,
      },
    }),
    prisma.comment.create({
      data: {
        userId: createdUsers[(i + 1) % createdUsers.length].id,
        content: `가격 대비 만족스럽습니다. 배송도 빨라서 좋았어요.`,
        productId: p.id,
      },
    }),
    prisma.comment.create({
      data: {
        userId: createdUsers[(i + 2) % createdUsers.length].id,
        content: `혹시 다른 색상도 있나요? 이 제품 추천합니다!`,
        productId: p.id,
      },
    }),
  ]);

  const articleComments = createdArticles.flatMap((a, i) => [
    prisma.comment.create({
      data: {
        userId: createdUsers[i % createdUsers.length].id,
        content: `유익한 글 감사합니다. 많은 도움이 되었어요! 🙏`,
        articleId: a.id,
      },
    }),
    prisma.comment.create({
      data: {
        userId: createdUsers[(i + 1) % createdUsers.length].id,
        content: `추가로 예제 코드를 더 보고 싶어요. 실전에서 바로 적용해보고 싶네요.`,
        articleId: a.id,
      },
    }),
    prisma.comment.create({
      data: {
        userId: createdUsers[(i + 2) % createdUsers.length].id,
        content: `이해하기 쉽게 설명해주셔서 감사합니다. 다음 글도 기대할게요!`,
        articleId: a.id,
      },
    }),
  ]);

  await Promise.all([...productComments, ...articleComments]);

  console.log(
    `✅ Created ${productComments.length + articleComments.length} comments`,
  );

  // 6) 제품 좋아요 생성
  const productFavorites = [
    // 노이즈캔슬링 헤드폰 (가장 인기)
    prisma.productFavorite.create({
      data: {
        userId: createdUsers[0].id,
        productId: createdProducts[4].id,
        favoriteState: true,
      },
    }),
    prisma.productFavorite.create({
      data: {
        userId: createdUsers[1].id,
        productId: createdProducts[4].id,
        favoriteState: true,
      },
    }),
    prisma.productFavorite.create({
      data: {
        userId: createdUsers[2].id,
        productId: createdProducts[4].id,
        favoriteState: true,
      },
    }),
    // 포메라니안 아트 프린트
    prisma.productFavorite.create({
      data: {
        userId: createdUsers[0].id,
        productId: createdProducts[1].id,
        favoriteState: true,
      },
    }),
    prisma.productFavorite.create({
      data: {
        userId: createdUsers[3].id,
        productId: createdProducts[1].id,
        favoriteState: true,
      },
    }),
    // LED 모니터
    prisma.productFavorite.create({
      data: {
        userId: createdUsers[1].id,
        productId: createdProducts[5].id,
        favoriteState: true,
      },
    }),
    prisma.productFavorite.create({
      data: {
        userId: createdUsers[2].id,
        productId: createdProducts[5].id,
        favoriteState: true,
      },
    }),
    // 무선 키보드
    prisma.productFavorite.create({
      data: {
        userId: createdUsers[0].id,
        productId: createdProducts[3].id,
        favoriteState: true,
      },
    }),
  ];

  await Promise.all(productFavorites);

  // 7) 게시글 좋아요 생성
  const articleFavorites = [
    // REST API 설계 (가장 인기)
    prisma.articleFavorite.create({
      data: {
        userId: createdUsers[0].id,
        articleId: createdArticles[3].id,
        favoriteState: true,
      },
    }),
    prisma.articleFavorite.create({
      data: {
        userId: createdUsers[1].id,
        articleId: createdArticles[3].id,
        favoriteState: true,
      },
    }),
    prisma.articleFavorite.create({
      data: {
        userId: createdUsers[2].id,
        articleId: createdArticles[3].id,
        favoriteState: true,
      },
    }),
    // TypeScript 프로젝트 구조화
    prisma.articleFavorite.create({
      data: {
        userId: createdUsers[0].id,
        articleId: createdArticles[2].id,
        favoriteState: true,
      },
    }),
    prisma.articleFavorite.create({
      data: {
        userId: createdUsers[3].id,
        articleId: createdArticles[2].id,
        favoriteState: true,
      },
    }),
    // JWT 인증
    prisma.articleFavorite.create({
      data: {
        userId: createdUsers[1].id,
        articleId: createdArticles[4].id,
        favoriteState: true,
      },
    }),
    prisma.articleFavorite.create({
      data: {
        userId: createdUsers[2].id,
        articleId: createdArticles[4].id,
        favoriteState: true,
      },
    }),
    // PostgreSQL 성능 튜닝
    prisma.articleFavorite.create({
      data: {
        userId: createdUsers[0].id,
        articleId: createdArticles[1].id,
        favoriteState: true,
      },
    }),
  ];

  await Promise.all(articleFavorites);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding done.');
  });
