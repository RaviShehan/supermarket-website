import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial database data...');

    // 1. Create Categories
    const produce = await prisma.category.upsert({
        where: { slug: 'produce' },
        update: {},
        create: { name: 'Fresh Produce', slug: 'produce' },
    });

    const dairy = await prisma.category.upsert({
        where: { slug: 'dairy' },
        update: {},
        create: { name: 'Dairy & Eggs', slug: 'dairy' },
    });

    const bakery = await prisma.category.upsert({
        where: { slug: 'bakery' },
        update: {},
        create: { name: 'Bakery', slug: 'bakery' },
    });

    // 2. Create Products
    const products = [
        {
            name: 'Organic Bananas (1 Bunch)',
            description: 'Fresh and sweet organic bananas.',
            price: 1.99,
            stock: 50,
            imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
            categoryId: produce.id,
        },
        {
            name: 'Fresh Whole Milk (1 Gallon)',
            description: 'Grade A pasteurized whole milk.',
            price: 3.49,
            stock: 30,
            imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
            categoryId: dairy.id,
        },
        {
            name: 'Artisan Sourdough Bread',
            description: 'Freshly baked sourdough loaf with crisp crust.',
            price: 4.99,
            stock: 20,
            imageUrl: 'https://images.unsplash.com/photo-1585478259715-876a6a81fc08',
            categoryId: bakery.id,
        },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });