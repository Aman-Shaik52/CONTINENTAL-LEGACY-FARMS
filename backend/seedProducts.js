const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const buildItemImage = (category, name, origin, rarityLevel) => (
  `https://source.unsplash.com/900x700/?${encodeURIComponent(`${name} ${category} ${origin} ${rarityLevel} food`)}`
);

const specificImageByNameToken = [
  ['black sapote', 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Black_sapote.jpg'],
  ['breadfruit', 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Breadfruit.jpg'],
  ['cherimoya', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Cherimoya.jpg'],
  ['cloudberry', 'https://upload.wikimedia.org/wikipedia/commons/8/88/Cloudberries.jpg'],
  ['tambalacoque', 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Sideroxylon_grandiflorum.jpg'],
  ['feijoa', 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Feijoa_fruit.jpg'],
  ['gros michel banana', 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Gros_Michel_banana.jpg'],
  ['jabuticaba', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Jabuticaba.jpg'],
  ['kiwano', 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Kiwano.jpg'],
  ['mangosteen', 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mangosteen.jpg'],
  ['miracle berry', 'https://upload.wikimedia.org/wikipedia/commons/3/36/Miracle_fruit.jpg'],
  ['yuzu', 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Yuzu_fruit.jpg'],
  ['cardoon', 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Cardoon.jpg'],
  ['chioggia', 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Chioggia_beet.jpg'],
  ['crosne', 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Stachys_affinis.jpg'],
  ['lotus root', 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Lotus_root.jpg'],
  ['mangel wurzel', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Mangelwurzel.jpg'],
  ['moringa pod', 'https://upload.wikimedia.org/wikipedia/commons/2/21/Moringa_oleifera_pods.jpg'],
  ['oca', 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Oca_tubers.jpg'],
  ['purple carrot', 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Purple_carrot.jpg'],
  ['romanesco', 'https://upload.wikimedia.org/wikipedia/commons/0/03/Romanesco_broccoli.jpg'],
  ['salsify', 'https://upload.wikimedia.org/wikipedia/commons/3/34/Salsify_root.jpg'],
  ['skirret', 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Sium_sisarum.jpg'],
  ['yardlong', 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Yardlong_beans.jpg'],
  ['butter', 'https://upload.wikimedia.org/wikipedia/commons/7/70/Butter.jpg'],
  ['blue stilton', 'https://upload.wikimedia.org/wikipedia/commons/3/30/Stilton_cheese.jpg'],
  ['clotted cream', 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Clotted_cream.jpg'],
  ['burrata', 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Burrata_cheese.jpg'],
  ['kefir', 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Kefir.jpg'],
  ['mascarpone', 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Mascarpone.jpg'],
  ['comte', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Comte_cheese.jpg'],
  ['sheep yogurt', 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Yogurt.jpg'],
  ['chhurpi', 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Chhurpi.jpg'],
  ['ambergris', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Ambergris.jpg'],
  ['beluga caviar', 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Beluga_caviar.jpg'],
  ['iberico', 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Jamon_iberico.jpg'],
  ['kopi luwak', 'https://upload.wikimedia.org/wikipedia/commons/4/45/Kopi_Luwak.jpg'],
  ['matsutake', 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Matsutake.jpg'],
  ['morel mushroom', 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Morels.jpg'],
  ['saffron', 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Saffron.jpg'],
];

const getSpecificImage = (productName) => {
  const normalizedName = productName.toLowerCase();
  const match = specificImageByNameToken.find(([token]) => normalizedName.includes(token));
  return match ? match[1] : null;
};

const catalog = [
  { category: 'fruit', name: 'Mangosteen Royal Selection', origin: 'Thailand', rarityLevel: 'rare', price: 210, stock: 24, description: 'Premium tropical mangosteen known for floral sweetness and delicate rind.' },
  { category: 'fruit', name: 'Jabuticaba Vineyard Pearl', origin: 'Brazil', rarityLevel: 'rare', price: 245, stock: 18, description: 'Small grape-like fruit that grows on tree trunks and ferments quickly after harvest.' },
  { category: 'fruit', name: 'Cloudberry Arctic Gold', origin: 'Norway', rarityLevel: 'ultra rare', price: 360, stock: 10, description: 'Northern berry with honey-apricot notes, hand-collected in short summer windows.' },
  { category: 'fruit', name: 'Yuzu Imperial Reserve', origin: 'Japan', rarityLevel: 'ultra rare', price: 320, stock: 12, description: 'Highly aromatic citrus used by chefs for zest oils and fragrant juice.' },
  { category: 'fruit', name: 'Black Sapote Midnight Cream', origin: 'Mexico', rarityLevel: 'rare', price: 195, stock: 20, description: 'Custard-like fruit prized for chocolate-like texture when fully ripe.' },
  { category: 'fruit', name: 'Miracle Berry Tasting Set', origin: 'Ghana', rarityLevel: 'ultra rare', price: 340, stock: 9, description: 'Berry containing miraculin, often used in sensory dining experiences.' },
  { category: 'fruit', name: 'Feijoa Alpine Fragrance', origin: 'New Zealand', rarityLevel: 'rare', price: 180, stock: 22, description: 'Perfumed guava-like fruit with bright acidity and pineapple aroma.' },
  { category: 'fruit', name: 'Gros Michel Banana Heritage', origin: 'Caribbean', rarityLevel: 'extinct', price: 980, stock: 3, description: 'Legacy cultivar profile recreated from preserved lines and heritage farms.' },
  { category: 'fruit', name: 'Dodo Tree Tambalacoque Legacy', origin: 'Mauritius', rarityLevel: 'extinct', price: 1120, stock: 2, description: 'Historic fruit line inspired by records from now-vanished island ecosystems.' },
  { category: 'fruit', name: 'Cherimoya Mist Valley', origin: 'Peru', rarityLevel: 'rare', price: 260, stock: 15, description: 'Creamy Andean fruit with banana, pineapple, and vanilla notes.' },
  { category: 'fruit', name: 'Kiwano Desert Flame', origin: 'Namibia', rarityLevel: 'rare', price: 220, stock: 16, description: 'Spined melon with bright green jelly flesh and cucumber-lime flavor.' },
  { category: 'fruit', name: 'Breadfruit Heirloom Hearth', origin: 'Samoa', rarityLevel: 'ultra rare', price: 310, stock: 8, description: 'Starchy island staple selected for roasting and savory applications.' },

  { category: 'vegetable', name: 'Romanesco Fractal Crown', origin: 'Italy', rarityLevel: 'rare', price: 145, stock: 30, description: 'Chartreuse brassica celebrated for geometric spirals and nutty crunch.' },
  { category: 'vegetable', name: 'Oca Rainbow Tubers', origin: 'Peru', rarityLevel: 'rare', price: 170, stock: 26, description: 'Andean tuber blend with tangy flavor and vibrant skin colors.' },
  { category: 'vegetable', name: 'Crosne Pearl Knots', origin: 'France', rarityLevel: 'ultra rare', price: 240, stock: 14, description: 'Small knot-like rhizomes with crisp texture and subtle artichoke notes.' },
  { category: 'vegetable', name: 'Cardoon Silver Stalk', origin: 'Spain', rarityLevel: 'ultra rare', price: 225, stock: 12, description: 'Mediterranean thistle stalk prized for braising and winter stews.' },
  { category: 'vegetable', name: 'Chioggia Candy Beet', origin: 'Italy', rarityLevel: 'rare', price: 130, stock: 28, description: 'Striped beet variety offering sweet flavor and striking sliced pattern.' },
  { category: 'vegetable', name: 'Moringa Pod Estate', origin: 'India', rarityLevel: 'rare', price: 160, stock: 25, description: 'Tender drumstick pods selected for curries and nutrient-rich broths.' },
  { category: 'vegetable', name: 'Salsify Oyster Root', origin: 'Belgium', rarityLevel: 'ultra rare', price: 255, stock: 10, description: 'Root vegetable with delicate shellfish-like aroma when cooked.' },
  { category: 'vegetable', name: 'Skirret Monastic Root', origin: 'United Kingdom', rarityLevel: 'extinct', price: 890, stock: 3, description: 'Revived medieval sweet root line sourced from heritage conservation plots.' },
  { category: 'vegetable', name: 'Mangel Wurzel Noble Strain', origin: 'Germany', rarityLevel: 'extinct', price: 840, stock: 4, description: 'Historical beet cultivar once widespread in Europe, now extremely limited.' },
  { category: 'vegetable', name: 'Yardlong Emerald Bean', origin: 'Thailand', rarityLevel: 'rare', price: 150, stock: 27, description: 'Long tender beans with sweet grassy bite, ideal for quick stir fry.' },
  { category: 'vegetable', name: 'Lotus Root Crystal Rings', origin: 'Japan', rarityLevel: 'rare', price: 175, stock: 22, description: 'Crisp aquatic root with signature ring structure and mild sweetness.' },
  { category: 'vegetable', name: 'Purple Carrot Imperial', origin: 'Turkey', rarityLevel: 'rare', price: 140, stock: 29, description: 'Deep anthocyanin-rich carrot selected for juicing and roasting.' },

  { category: 'dairy', name: 'Buffalo Clotted Cream Reserve', origin: 'India', rarityLevel: 'rare', price: 280, stock: 18, description: 'Rich slow-set cream from grass-fed buffalo milk with caramelized notes.' },
  { category: 'dairy', name: 'Raw Milk Comte Cellar 30M', origin: 'France', rarityLevel: 'ultra rare', price: 520, stock: 7, description: 'Mountain-aged wheel cut from deep cellar maturation batches.' },
  { category: 'dairy', name: 'Burrata Pearl Hand-Stretched', origin: 'Italy', rarityLevel: 'rare', price: 240, stock: 16, description: 'Fresh stretched-curd shell with stracciatella center and lactic sweetness.' },
  { category: 'dairy', name: 'Yak Milk Chhurpi Aged Block', origin: 'Nepal', rarityLevel: 'ultra rare', price: 460, stock: 6, description: 'High-altitude hard dairy craft aged for savory intensity.' },
  { category: 'dairy', name: 'Blue Stilton Cask Finish', origin: 'United Kingdom', rarityLevel: 'rare', price: 330, stock: 11, description: 'Creamy blue-veined cheese finished in seasoned oak casks.' },
  { category: 'dairy', name: 'Goat Kefir Wild Culture', origin: 'Georgia', rarityLevel: 'rare', price: 210, stock: 20, description: 'Natural kefir grains fermented with diverse native microflora.' },
  { category: 'dairy', name: 'Aurochs Milk Heritage Butter', origin: 'Europe', rarityLevel: 'extinct', price: 1180, stock: 2, description: 'Historical dairy profile inspired by now-lost bovine lineage archives.' },
  { category: 'dairy', name: 'Monastic Smoked Curd Legacy', origin: 'Alps', rarityLevel: 'extinct', price: 960, stock: 3, description: 'Reconstructed recipe from discontinued monastery dairy traditions.' },
  { category: 'dairy', name: 'Sheep Yogurt Alpine Pot', origin: 'Greece', rarityLevel: 'rare', price: 190, stock: 24, description: 'Dense cultured sheep yogurt with clean tang and silky texture.' },
  { category: 'dairy', name: 'Mascarpone Gold Batch', origin: 'Italy', rarityLevel: 'rare', price: 250, stock: 14, description: 'Small batch mascarpone with elevated butterfat and dessert finish.' },

  { category: 'rare food', name: 'Saffron Threads Super Negin', origin: 'Iran', rarityLevel: 'ultra rare', price: 680, stock: 8, description: 'Top-grade hand-selected stigma strands with intense floral depth.' },
  { category: 'rare food', name: 'White Truffle Alba Selection', origin: 'Italy', rarityLevel: 'ultra rare', price: 1400, stock: 3, description: 'Aromatic truffle selected from limited seasonal Alba harvests.' },
  { category: 'rare food', name: 'Beluga Caviar Estate Tin', origin: 'Caspian Region', rarityLevel: 'extinct', price: 1650, stock: 2, description: 'Historic caviar profile sourced through tightly controlled legacy channels.' },
  { category: 'rare food', name: 'Matsutake Mountain Grade', origin: 'Japan', rarityLevel: 'ultra rare', price: 820, stock: 6, description: 'Wild pine mushroom with signature resinous aroma and firm texture.' },
  { category: 'rare food', name: 'Kopi Luwak Micro Lot', origin: 'Indonesia', rarityLevel: 'ultra rare', price: 740, stock: 5, description: 'Traceable micro-lot coffee beans processed in highly limited batches.' },
  { category: 'rare food', name: 'Vanilla Caviar Tahitian Reserve', origin: 'French Polynesia', rarityLevel: 'rare', price: 520, stock: 10, description: 'Plump fragrant vanilla seeds for premium pastry and confection use.' },
  { category: 'rare food', name: 'Morel Mushroom Forest Prime', origin: 'Turkey', rarityLevel: 'rare', price: 430, stock: 12, description: 'Wild morels with nutty-earthy profile and honeycomb texture.' },
  { category: 'rare food', name: 'Wasabi Rhizome Shizuoka Line', origin: 'Japan', rarityLevel: 'ultra rare', price: 610, stock: 7, description: 'True wasabi rhizome with bright heat and short-lived floral finish.' },
  { category: 'rare food', name: 'Iberico Bellota 100 Slice Set', origin: 'Spain', rarityLevel: 'rare', price: 560, stock: 9, description: 'Acorn-fed ham selection with long-aged complexity and marbling.' },
  { category: 'rare food', name: 'Ambergris Salt Archive Blend', origin: 'North Atlantic', rarityLevel: 'extinct', price: 1320, stock: 2, description: 'Historical perfumed salt concept recreated from archival culinary references.' },
];

const generateProducts = () => catalog.map((item) => ({
  ...item,
  image: getSpecificImage(item.name) || buildItemImage(item.category, item.name, item.origin, item.rarityLevel),
  isExtinctType: item.rarityLevel === 'extinct',
}));

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    const products = generateProducts();
    await Product.insertMany(products);

    console.log(`✅ ${products.length} Curated Products Inserted Successfully!`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();