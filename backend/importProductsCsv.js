const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const INPUT_FILE = path.resolve(__dirname, 'products_1000.csv');

const parseBoolean = (value) => String(value).trim().toLowerCase() === 'true';

const toCategory = (category) => {
  const normalized = String(category).trim().toLowerCase();
  if (normalized === 'rare_food') {
    return 'rare food';
  }
  return normalized;
};

const toRarityLevel = (rarity, extinct) => {
  if (extinct) {
    return 'extinct';
  }

  const normalized = String(rarity).trim().toLowerCase();
  if (normalized === 'rare') {
    return 'rare';
  }

  return 'ultra rare';
};

const randomStock = (isExtinctType) => {
  if (isExtinctType) {
    return Math.floor(Math.random() * 5) + 1;
  }
  return Math.floor(Math.random() * 36) + 5;
};

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
};

const parseCsv = (csvText) => {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return [];
  }

  const header = parseCsvLine(lines[0]);
  const expectedHeader = ['name', 'category', 'rarity', 'extinct', 'origin', 'price', 'image'];

  if (header.join(',') !== expectedHeader.join(',')) {
    throw new Error('Invalid CSV header. Expected: name,category,rarity,extinct,origin,price,image');
  }

  return lines.slice(1).map((line) => {
    const [name, category, rarity, extinct, origin, price, image] = parseCsvLine(line);
    return { name, category, rarity, extinct, origin, price, image };
  });
};

const toProductDocument = (row) => {
  const extinct = parseBoolean(row.extinct);
  const category = toCategory(row.category);

  return {
    name: row.name,
    category,
    origin: row.origin,
    rarityLevel: toRarityLevel(row.rarity, extinct),
    price: Number.parseFloat(row.price),
    stock: randomStock(extinct),
    description: `${row.name} sourced from ${row.origin} for premium collections.`,
    image: row.image,
    isExtinctType: extinct,
  };
};

const main = async () => {
  try {
    if (!fs.existsSync(INPUT_FILE)) {
      throw new Error(`CSV file not found: ${INPUT_FILE}`);
    }

    const csvText = fs.readFileSync(INPUT_FILE, 'utf8');
    const rows = parseCsv(csvText);

    if (rows.length === 0) {
      throw new Error('CSV contains no product rows.');
    }

    const products = rows.map(toProductDocument);

    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`Successfully imported ${products.length} products from ${INPUT_FILE}`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to import products CSV:', error.message);
    process.exit(1);
  }
};

main();