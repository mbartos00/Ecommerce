import { faker } from '@faker-js/faker';
import { PrismaClient, Size } from '@prisma/client';
const prisma = new PrismaClient();

const productDefaults = {
  numOfCategories: 10,
  numOfProducts: 20,
  numOfVariantsPerProduct: 3,
  maxQuantity: 100,
  maxRating: 5,
  imagesPerProduct: 3,
};

export async function seedProducts() {
  function getRandNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomSize() {
    const sizeValues = Object.values(Size);
    const randomIndex = Math.floor(Math.random() * sizeValues.length);

    return sizeValues[randomIndex];
  }

  function getRandomCategoryIds(
    categoryIds: string[],
    min: number,
    max: number,
  ) {
    const numCategories = getRandNum(min, max);
    const selectedIds = [];
    for (let i = 0; i < numCategories; i++) {
      const randomIndex = getRandNum(0, categoryIds.length - 1);
      selectedIds.push(categoryIds[randomIndex]);
      categoryIds.splice(randomIndex, 1);
    }
    return selectedIds;
  }

  await prisma.product.deleteMany();
  await prisma.favorites.deleteMany();
  await prisma.category.deleteMany();
  await prisma.variant.deleteMany();

  const uniqueCategoryNames = new Set<string>();

  while (uniqueCategoryNames.size < productDefaults.numOfCategories) {
    uniqueCategoryNames.add(faker.commerce.department().toLowerCase());
  }

  await prisma.category.createMany({
    data: Array.from(uniqueCategoryNames).map((name) => ({
      name,
    })),
  });

  const categories = await prisma.category.findMany();

  await prisma.product.createMany({
    data: Array.from({ length: productDefaults.numOfProducts }).map(() => ({
      name: faker.commerce.productName(),
      brand: faker.company.name(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      rating: getRandNum(0, productDefaults.maxRating),
      images: Array.from({ length: productDefaults.imagesPerProduct }).map(() =>
        faker.image.url(),
      ),
      categoryIds: getRandomCategoryIds(
        categories.map((cat) => cat.id),
        1,
        3,
      ),
      createdAt: new Date(),
    })),
  });

  const products = await prisma.product.findMany();
  for (const product of products) {
    await prisma.variant.createMany({
      data: Array.from({ length: productDefaults.numOfVariantsPerProduct }).map(
        () => ({
          color: faker.color.human(),
          condition: 'new',
          size: getRandomSize(),
          quantity: getRandNum(0, productDefaults.maxQuantity),
          productId: product.id,
        }),
      ),
    });
  }

  console.log('Seeding products completed!');
}
