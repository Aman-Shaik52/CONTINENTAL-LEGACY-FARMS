const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const toSeedSlug = (name) => String(name)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);

const buildUniqueImageUrl = (name, id, serial) => {
  const slug = toSeedSlug(name);
  const seed = `clf-${serial}-${slug}-${id}`;
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/700`;
};

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const products = await Product.find({}, '_id name').sort({ _id: 1 });

    if (products.length === 0) {
      console.log('No products found to update.');
      process.exit(0);
    }

    const operations = products.map((product, index) => ({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            image: buildUniqueImageUrl(product.name, product._id.toString(), index + 1),
          },
        },
      },
    }));

    await Product.bulkWrite(operations, { ordered: false });

    console.log(`Updated unique images for ${products.length} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to assign unique product images:', error.message);
    process.exit(1);
  }
};

main();