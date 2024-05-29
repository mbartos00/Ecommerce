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

const newsDefaults = {
  numOfCategories: 4,
  numOfNews: 20,
};

function getRandNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(from: Date, to: Date) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

function getRandomSize() {
  const sizeValues = Object.values(Size);
  const randomIndex = Math.floor(Math.random() * sizeValues.length);

  return sizeValues[randomIndex];
}

export async function seedProducts() {
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

export async function seedNews() {
  await prisma.news.deleteMany();
  await prisma.newsCategory.deleteMany();

  const fakePostDescription = `
  <div>
 <h1>Breaking News: Major Tech Companies Announce New Products</h1>
 <p>
    In a groundbreaking announcement, leading tech companies have unveiled their latest innovations, promising to revolutionize the way we live and work. The event, held virtually, saw representatives from Apple, Google, Microsoft, and Amazon showcasing their newest products and services.
 </p>
 <br/>
 <p>
    <strong>Apple's New iPad Pro</strong> - Apple introduced the iPad Pro 2023, boasting a 12.9-inch Liquid Retina display, A16 Bionic chip, and up to 64GB of storage. The device is designed to cater to both professionals and creatives, offering advanced features such as ProMotion technology for smoother scrolling and a new Magic Keyboard with Touch ID.
 </p>
 <br/>
 <p>
    <strong>Google's Quantum Computing Breakthrough</strong> - Google announced a significant leap in quantum computing, unveiling a 128-qubit processor that can perform 2 trillion operations per second. This milestone marks a significant step forward in the development of quantum computing, which could potentially solve complex problems in fields like cryptography, optimization, and drug discovery.
 </p>
 <br/>
 <p>
    <strong>Microsoft's AI-Powered Healthcare Solutions</strong> - Microsoft introduced a suite of AI-powered healthcare solutions aimed at improving patient care and outcomes. The solutions include AI-driven diagnostics, personalized treatment plans, and predictive analytics for healthcare providers. Microsoft's commitment to leveraging AI in healthcare is part of its broader strategy to address global health challenges.
 </p>
 <br/>
 <p>
    <strong>Amazon's Sustainable Packaging Initiative</strong> - Amazon announced a new initiative to reduce its environmental impact by transitioning to 100% recycled or biodegradable packaging materials by 2040. The company is investing in innovative technologies and partnerships to achieve this ambitious goal, demonstrating its commitment to sustainability and environmental stewardship.
 </p>
 <br/>
 <p>
    These announcements highlight the ongoing race among tech giants to innovate and lead in various sectors, from hardware and software to healthcare and environmental sustainability. As we look forward to the future, it's clear that technology will continue to play a pivotal role in shaping our world.
 </p>
 <br/>
 <p>
    <a href="https://www.example.com/news/tech-companies-announce-new-products">Read more about the event and the new products</a>
 </p>
</div>
  `;

  const uniqueCategoryNames = new Set<string>();

  while (uniqueCategoryNames.size < newsDefaults.numOfCategories) {
    uniqueCategoryNames.add(faker.commerce.department().toLowerCase());
  }

  await prisma.newsCategory.createMany({
    data: Array.from(uniqueCategoryNames).map((name) => ({
      name,
    })),
  });

  const newsCategories = await prisma.newsCategory.findMany();

  await prisma.news.createMany({
    data: Array.from({ length: newsDefaults.numOfNews }).map(() => {
      const randomCategoryIndex = getRandNum(0, newsCategories.length - 1);

      return {
        title: faker.commerce.productName(),
        content: fakePostDescription,
        description_short: faker.lorem.sentence(20),
        author_full_name: faker.person.fullName(),
        imageUrl: faker.image.url(),
        news_category_id: newsCategories[randomCategoryIndex].id,
        createdAt: getRandomDate(
          new Date('2020-02-12T01:57:45.271Z'),
          new Date(Date.now()),
        ),
      };
    }),
  });

  console.log('Seeding news completed!');
}

export async function seedSoldProduct() {
  await prisma.soldProduct.deleteMany();

  const products = await prisma.product.findMany();

  for (let i = 0; i < Math.ceil(products.length / 1.5); i++) {
    await prisma.soldProduct.create({
      data: {
        quantity: getRandNum(1, 50),
        productId: products[i].id,
        saleDate: getRandomDate(
          new Date('2020-02-12T01:57:45.271Z'),
          new Date(Date.now()),
        ),
      },
    });
  }

  console.log('Seeding sold products completed');
}

async function main() {
  await Promise.all([seedNews(), seedProducts(), seedSoldProduct()]);
}

await main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
