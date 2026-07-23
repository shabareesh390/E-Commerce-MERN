const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');

dotenv.config();

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
];

const products = [
  {
    name: 'Wireless Headphones',
    description: 'High quality wireless headphones with noise cancellation.',
    price: 99.99,
    brand: 'AudioTech',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000'],
    ratingsAvg: 4.5,
    numReviews: 12,
    tags: ['audio', 'wireless', 'headphones'],
  },
  {
    name: 'Smart Watch',
    description: 'Track your fitness and stay connected.',
    price: 199.99,
    brand: 'FitGear',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000'],
    ratingsAvg: 4.8,
    numReviews: 24,
    tags: ['smartwatch', 'fitness', 'wearable'],
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable and lightweight running shoes.',
    price: 79.99,
    brand: 'Sprint',
    stock: 100,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000'],
    ratingsAvg: 4.2,
    numReviews: 8,
    tags: ['shoes', 'running', 'clothing'],
  },
  {
    name: 'Smartphone 5G',
    description: 'Latest 5G smartphone with incredible camera.',
    price: 899.99,
    brand: 'TechPro',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000'],
    ratingsAvg: 4.9,
    numReviews: 45,
    tags: ['smartphone', '5g', 'electronics'],
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await Product.deleteMany();
    await Category.deleteMany();

    const createdCategories = await Category.insertMany(categories);
    const electronicsId = createdCategories[0]._id;
    const clothingId = createdCategories[1]._id;

    products[0].category = electronicsId;
    products[1].category = electronicsId;
    products[2].category = clothingId;
    products[3].category = electronicsId;

    await Product.insertMany(products);
    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
