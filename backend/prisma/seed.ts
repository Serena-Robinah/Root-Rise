import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding products...');

    await prisma.product.createMany({
        data: [
            // Onesies
            {
                name: 'Soft Cotton Onesie – White',
                description: 'Ultra-soft cotton onesie perfect for newborns. Easy snap buttons for quick changes.',
                price: 12.99,
                category: 'Onesies',
                age_group: '0–1',
                gender: 'Unisex',
                stock: 50,
                image_url: null,
            },
            {
                name: 'Floral Snap Onesie',
                description: 'Cute floral print onesie with long sleeves, ideal for cooler days.',
                price: 14.99,
                category: 'Onesies',
                age_group: '0–1',
                gender: 'Girls',
                stock: 40,
                image_url: null,
            },
            {
                name: 'Striped Onesie – Blue',
                description: 'Classic blue striped onesie made from breathable cotton blend.',
                price: 11.99,
                category: 'Onesies',
                age_group: '0–1',
                gender: 'Boys',
                stock: 45,
                image_url: null,
            },

            // Tops
            {
                name: 'Rainbow Graphic Tee',
                description: 'Bright rainbow graphic tee for toddlers. Machine washable.',
                price: 13.99,
                category: 'Tops',
                age_group: '2–4',
                gender: 'Girls',
                stock: 35,
                image_url: null,
            },
            {
                name: 'Dinosaur Print T-Shirt',
                description: 'Fun dinosaur print t-shirt for active kids. 100% cotton.',
                price: 13.99,
                category: 'Tops',
                age_group: '2–4',
                gender: 'Boys',
                stock: 30,
                image_url: null,
            },
            {
                name: 'Long Sleeve Henley Top',
                description: 'Classic henley style long sleeve top. Great for layering.',
                price: 16.99,
                category: 'Tops',
                age_group: '5–7',
                gender: 'Unisex',
                stock: 25,
                image_url: null,
            },

            // Bottoms
            {
                name: 'Elastic Waist Joggers – Grey',
                description: 'Comfortable jogger pants with elastic waist. Perfect for play.',
                price: 17.99,
                category: 'Bottoms',
                age_group: '2–4',
                gender: 'Unisex',
                stock: 30,
                image_url: null,
            },
            {
                name: 'Denim Pull-On Jeans',
                description: 'Easy pull-on denim jeans with no buttons. Soft waistband.',
                price: 22.99,
                category: 'Bottoms',
                age_group: '5–7',
                gender: 'Unisex',
                stock: 20,
                image_url: null,
            },
            {
                name: 'Floral Leggings',
                description: 'Stretchy floral print leggings. Great for school or play.',
                price: 14.99,
                category: 'Bottoms',
                age_group: '8–10',
                gender: 'Girls',
                stock: 25,
                image_url: null,
            },

            // Dresses
            {
                name: 'Tiered Ruffle Dress – Pink',
                description: 'Adorable tiered ruffle dress in soft pink. Machine washable.',
                price: 24.99,
                category: 'Dresses',
                age_group: '2–4',
                gender: 'Girls',
                stock: 20,
                image_url: null,
            },
            {
                name: 'Floral Smock Dress',
                description: 'Pretty smocked floral dress with adjustable straps.',
                price: 27.99,
                category: 'Dresses',
                age_group: '5–7',
                gender: 'Girls',
                stock: 15,
                image_url: null,
            },
            {
                name: 'Denim Pinafore Dress',
                description: 'Versatile denim pinafore dress. Can be worn over a tee or on its own.',
                price: 29.99,
                category: 'Dresses',
                age_group: '8–10',
                gender: 'Girls',
                stock: 15,
                image_url: null,
            },

            // Outerwear
            {
                name: 'Fleece Zip Hoodie – Navy',
                description: 'Warm fleece zip-up hoodie with kangaroo pocket.',
                price: 32.99,
                category: 'Outerwear',
                age_group: '5–7',
                gender: 'Unisex',
                stock: 20,
                image_url: null,
            },
            {
                name: 'Puffer Vest – Pink',
                description: 'Lightweight puffer vest for layering. Water resistant.',
                price: 34.99,
                category: 'Outerwear',
                age_group: '8–10',
                gender: 'Girls',
                stock: 15,
                image_url: null,
            },
            {
                name: 'Windbreaker Jacket – Green',
                description: 'Packable windbreaker jacket. Ideal for outdoor adventures.',
                price: 39.99,
                category: 'Outerwear',
                age_group: '11–14',
                gender: 'Boys',
                stock: 15,
                image_url: null,
            },
        ],
    });

    console.log('✅ Seeded 15 products successfully.');
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });