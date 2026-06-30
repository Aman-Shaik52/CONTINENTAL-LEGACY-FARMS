const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

const buildProductImage = (name, category, origin, rarityLevel) => {
  const seed = `${name || 'product'}-${category || 'general'}-${origin || 'origin'}-${rarityLevel || 'rare'}`;
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/700`;
};

const resolveImageUrl = (imageUrl, fallbackSeed) => {
  const candidate = String(imageUrl || '').trim();

  if (!candidate) {
    return `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/900/700`;
  }

  if (candidate.includes('source.unsplash.com')) {
    return `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/900/700`;
  }

  return candidate;
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const inferImportedRarityLevel = (product) => {
  const rating = Number(product.rating);

  if (Number.isFinite(rating)) {
    if (rating >= 4.5) {
      return 'ultra rare';
    }

    if (rating >= 4) {
      return 'rare';
    }
  }

  return 'rare';
};

const normalizeProduct = (product) => ({
  _id: product._id,
  name: product.name || product.product || 'Unnamed Product',
  category: normalizeText(product.category || product.type || 'uncategorized'),
  origin: product.origin || product.brand || product.sub_category || 'Unknown',
  rarityLevel: normalizeText(product.rarityLevel || inferImportedRarityLevel(product)),
  price: Number(product.price ?? product.sale_price ?? product.market_price ?? 0),
  stock: Number.isFinite(Number(product.stock)) ? Number(product.stock) : 1,
  description: product.description || '',
  image: resolveImageUrl(product.image || product.image_url, product.name || product.product || product._id),
  isExtinctType: Boolean(product.isExtinctType),
});

const matchesProductFilters = (product, { q, category, rarity }) => {
  if (category && normalizeText(product.category) !== normalizeText(category)) {
    return false;
  }

  if (rarity && normalizeText(product.rarityLevel) !== normalizeText(rarity)) {
    return false;
  }

  if (q) {
    const searchTerm = normalizeText(q);
    const searchableFields = [product.name, product.description, product.category, product.origin, product.rarityLevel]
      .map(normalizeText);

    if (!searchableFields.some((field) => field.includes(searchTerm))) {
      return false;
    }
  }

  return true;
};

const loadCatalogProducts = async () => {
  const products = await Product.find({}).lean();

  let importedProducts = [];
  try {
    importedProducts = await Product.db.collection('BBproducts').find({}).toArray();
  } catch (error) {
    importedProducts = [];
  }

  return [...products.map(normalizeProduct), ...importedProducts.map(normalizeProduct)];
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const { q, category, rarity } = req.query;
    const products = await loadCatalogProducts();
    const filteredProducts = products.filter((product) => matchesProductFilters(product, { q, category, rarity }));

    filteredProducts.sort((left, right) => {
      const categoryComparison = normalizeText(left.category).localeCompare(normalizeText(right.category));
      if (categoryComparison !== 0) {
        return categoryComparison;
      }

      return normalizeText(left.name).localeCompare(normalizeText(right.name));
    });

    res.json(filteredProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (product) {
      return res.json(normalizeProduct(product));
    }

    let importedProduct = null;
    try {
      importedProduct = await Product.db.collection('BBproducts').findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    } catch (error) {
      importedProduct = null;
    }

    if (!importedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(normalizeProduct(importedProduct));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', auth, admin, async (req, res) => {
  const { name, category, origin, rarityLevel, price, stock, description, image, isExtinctType } = req.body;
  try {
    const resolvedImage = image || buildProductImage(name, category, origin, rarityLevel);

    const product = new Product({
      name,
      category,
      origin,
      rarityLevel,
      price,
      stock,
      description,
      image: resolvedImage,
      isExtinctType,
    });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const updatePayload = { ...req.body };

    if (!updatePayload.image) {
      const existing = await Product.findById(req.params.id);
      const merged = {
        name: updatePayload.name || existing?.name,
        category: updatePayload.category || existing?.category,
        origin: updatePayload.origin || existing?.origin,
        rarityLevel: updatePayload.rarityLevel || existing?.rarityLevel,
      };

      updatePayload.image = buildProductImage(merged.name, merged.category, merged.origin, merged.rarityLevel);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;