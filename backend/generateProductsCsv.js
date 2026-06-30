const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.resolve(__dirname, 'products_1000.csv');
const PRODUCT_COUNT = 1000;
const EXTINCT_PROBABILITY = 0.15;

const ORIGINS = [
  'India',
  'Japan',
  'Peru',
  'Brazil',
  'Italy',
  'France',
  'Mexico',
  'Thailand',
  'Spain',
  'Turkey',
  'Nepal',
  'New Zealand',
  'Greece',
  'Indonesia',
  'Iran',
  'Norway',
  'United Kingdom',
  'Mauritius',
  'Ghana',
  'Caspian Region',
];

const RARITIES = ['rare', 'exotic', 'legendary'];

const PREMIUM_SUFFIXES = [
  'Reserve',
  'Heritage',
  'Imperial',
  'Estate',
  'Legacy',
  'Prime',
  'Royal Selection',
  'Grand Vintage',
];

const BRAND_MODIFIERS = [
  'Noir',
  'Crown',
  'Noble',
  'Aurora',
  'Summit',
  'Signature',
  'Prestige',
  'Masterpiece',
  'Grand',
  'Select',
  'Velvet',
  'Estate',
  'Cellar',
  'Heritage',
  'Monarch',
  'Apex',
  'Elite',
  'Collection',
  'Artisan',
  'Prime',
];

const CATEGORY_POOLS = {
  fruit: [
    'Black Sapote',
    'Breadfruit',
    'Cherimoya',
    'Cloudberry',
    'Feijoa',
    'Gros Michel Banana',
    'Jabuticaba',
    'Kiwano',
    'Mangosteen',
    'Miracle Berry',
    'Yuzu',
  ],
  vegetable: [
    'Cardoon',
    'Chioggia Beet',
    'Crosne',
    'Lotus Root',
    'Mangelwurzel',
    'Moringa Pod',
    'Oca',
    'Purple Carrot',
    'Romanesco',
    'Salsify',
    'Skirret',
    'Yardlong Bean',
  ],
  dairy: [
    'Heritage Butter',
    'Blue Stilton',
    'Clotted Cream',
    'Burrata',
    'Kefir',
    'Mascarpone',
    'Comte Cheese',
    'Sheep Yogurt',
    'Chhurpi',
  ],
  rare_food: [
    'Ambergris Salt',
    'Beluga Caviar',
    'Iberico Ham',
    'Kopi Luwak',
    'Matsutake',
    'Morel Mushroom',
    'Saffron',
    'White Truffle',
  ],
};

const CATEGORIES = Object.keys(CATEGORY_POOLS);

const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

const randomPrice = () => (Math.random() * (250 - 10) + 10).toFixed(2);

const buildName = (baseName) => {
  const modifier = randomItem(BRAND_MODIFIERS);
  const suffix = randomItem(PREMIUM_SUFFIXES);
  return `${baseName} ${modifier} ${suffix}`;
};

const buildImageUrl = (productName, serial) => (
  `https://picsum.photos/seed/${encodeURIComponent(`clf-${serial}-${productName.toLowerCase()}`)}/900/700`
);

const escapeCsvValue = (value) => {
  const stringValue = String(value);
  if (/[,"\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const buildProduct = (existingNames, serial) => {
  let attempts = 0;
  let name = '';
  let category = '';

  while (attempts < 2000) {
    category = randomItem(CATEGORIES);
    const baseName = randomItem(CATEGORY_POOLS[category]);
    const candidateName = buildName(baseName);

    if (!existingNames.has(candidateName)) {
      name = candidateName;
      break;
    }

    attempts += 1;
  }

  if (!name) {
    throw new Error('Could not generate a unique product name within retry limit.');
  }

  existingNames.add(name);

  return {
    name,
    category,
    rarity: randomItem(RARITIES),
    extinct: Math.random() < EXTINCT_PROBABILITY,
    origin: randomItem(ORIGINS),
    price: randomPrice(),
    image: buildImageUrl(name, serial),
  };
};

const generateProducts = () => {
  const usedNames = new Set();
  const products = [];

  while (products.length < PRODUCT_COUNT) {
    products.push(buildProduct(usedNames, products.length + 1));
  }

  return products;
};

const toCsv = (products) => {
  const header = 'name,category,rarity,extinct,origin,price,image';
  const lines = products.map((product) => [
    product.name,
    product.category,
    product.rarity,
    product.extinct,
    product.origin,
    product.price,
    product.image,
  ].map(escapeCsvValue).join(','));

  return [header, ...lines].join('\n');
};

const main = () => {
  try {
    const products = generateProducts();
    const csvContent = toCsv(products);
    fs.writeFileSync(OUTPUT_FILE, csvContent, 'utf8');

    console.log(`Successfully generated ${products.length} products at ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Failed to generate products CSV:', error.message);
    process.exit(1);
  }
};

main();