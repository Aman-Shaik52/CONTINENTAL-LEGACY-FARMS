import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const categoryOrder = ['fruit', 'vegetable', 'dairy', 'rare food'];

const categoryTitles = {
  fruit: 'Fruits',
  vegetable: 'Vegetables',
  dairy: 'Dairy Products',
  'rare food': 'Rare Foods',
};

const categoryBannerImages = {
  fruit: 'https://picsum.photos/seed/banner-fruit/1600/500',
  vegetable: 'https://picsum.photos/seed/banner-vegetable/1600/500',
  dairy: 'https://picsum.photos/seed/banner-dairy/1600/500',
  'rare food': 'https://picsum.photos/seed/banner-rare-food/1600/500',
};

const rarityOptions = ['rare', 'ultra rare', 'extinct'];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartToast, setCartToast] = useState('');
  const { addToCart } = useCart();
  const toastTimerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';
  const rarityFilter = searchParams.get('rarity') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (categoryFilter) params.category = categoryFilter;
      if (rarityFilter) params.rarity = rarityFilter;

      try {
        const { data } = await axios.get('http://localhost:5000/api/products', { params });
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setError('Unable to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryFilter, rarityFilter]);

  useEffect(() => () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
  }, []);

  const getProductImage = (product) => {
    if (product.image && !product.image.includes('via.placeholder.com') && !product.image.includes('source.unsplash.com')) {
      return product.image;
    }

    const seed = `${product.name || 'product'}-${product.category || 'general'}`;
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/400`;
  };

  const updateSearchParams = (nextParams) => {
    const merged = {
      q: searchQuery,
      category: categoryFilter,
      rarity: rarityFilter,
      ...nextParams,
    };

    Object.keys(merged).forEach((key) => {
      if (!merged[key]) {
        delete merged[key];
      }
    });

    setSearchParams(merged);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateSearchParams({ q: searchInput.trim() });
  };

  const hasActiveFilters = Boolean(searchQuery || categoryFilter || rarityFilter);

  const groupedProducts = products.reduce((groups, product) => {
    const key = (product.category || 'uncategorized').toString().trim().toLowerCase();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(product);
    return groups;
  }, {});

  const categoriesToRender = [
    ...categoryOrder.filter((category) => (groupedProducts[category] || []).length > 0),
    ...Object.keys(groupedProducts).filter((category) => !categoryOrder.includes(category)),
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    setCartToast(`${product.name} added to cart`);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setCartToast('');
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8 relative">
      <Motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        Continental Legacy Farm's Products
      </Motion.h1>

      <div className="mb-8 rounded-3xl bg-white p-4 shadow-md">
        <form className="mb-3 flex flex-col gap-3 md:flex-row" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by product name, category, rarity, or origin..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-slate-500 focus:outline-none"
          />
          <button type="submit" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
            Search
          </button>
        </form>

        <div className="mb-2 flex flex-wrap gap-2">
          <span className="self-center text-xs font-semibold uppercase tracking-wide text-slate-500">Category</span>
          <button type="button" onClick={() => updateSearchParams({ category: '' })} className={`rounded-full px-3 py-1 text-xs font-semibold ${!categoryFilter ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>All</button>
          {categoryOrder.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => updateSearchParams({ category })}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryFilter === category ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {categoryTitles[category]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="self-center text-xs font-semibold uppercase tracking-wide text-slate-500">Rarity</span>
          <button type="button" onClick={() => updateSearchParams({ rarity: '' })} className={`rounded-full px-3 py-1 text-xs font-semibold ${!rarityFilter ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>All</button>
          {rarityOptions.map((rarity) => (
            <button
              key={rarity}
              type="button"
              onClick={() => updateSearchParams({ rarity })}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${rarityFilter === rarity ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {rarity}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="ml-auto rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {!loading && !error && (
        <p className="mb-6 text-sm text-slate-600">
          Showing {products.length} result{products.length === 1 ? '' : 's'}
          {searchQuery ? ` for "${searchQuery}"` : ''}
          {categoryFilter ? ` in ${categoryTitles[categoryFilter] || categoryFilter}` : ''}
          {rarityFilter ? ` with rarity ${rarityFilter}` : ''}
          .
        </p>
      )}

      {loading && <div className="text-center py-16 text-xl">Loading...</div>}
      {error && <div className="text-center py-16 text-red-600">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16 text-gray-600 text-lg">No products found</div>
      )}

      {!loading && !error && categoriesToRender.map((category, categoryIndex) => {
        const categoryProducts = groupedProducts[category] || [];
        if (categoryProducts.length === 0) return null;

        return (
          <Motion.section
            key={category}
            className="mb-14"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: categoryIndex * 0.08 }}
          >
            <Motion.div className="relative mb-6 overflow-hidden rounded-3xl card-lift" whileHover={{ scale: 1.01 }}>
              <img
                src={categoryBannerImages[category]}
                alt={categoryTitles[category]}
                className="h-36 w-full object-cover md:h-48"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-end justify-between p-6 text-white">
                <h2 className="text-2xl font-bold md:text-3xl">{categoryTitles[category] || category.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm">{categoryProducts.length} items</span>
              </div>
            </Motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {categoryProducts.map((product, index) => (
                <Motion.div
                  key={product._id}
                  className="card-lift group rounded-3xl bg-white p-5 shadow-lg"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: categoryIndex * 0.08 + (index % 8) * 0.04 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {(() => {
                    const rarity = (product.rarityLevel || product.rarity || 'rare').toString().toLowerCase();
                    const price = Number(product.price);
                    const formattedPrice = Number.isFinite(price) ? price.toFixed(2) : '0.00';

                    return (
                      <>
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="mb-4 h-56 w-full rounded-3xl object-cover"
                        />
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            rarity === 'extinct' || rarity === 'extremely rare' ? 'bg-red-100 text-red-800' :
                            rarity === 'ultra rare' || rarity === 'very rare' || rarity === 'premium' ? 'bg-violet-100 text-violet-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {product.rarityLevel || product.rarity || 'Rare'}
                          </span>
                        </div>
                        <p className="mb-4 text-sm text-slate-500">Origin: {product.origin}</p>
                        <p className="mb-4 text-2xl font-bold text-slate-900">${formattedPrice}</p>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="mb-2 w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Quick View
                        </button>
                      </>
                    );
                  })()}
                </Motion.div>
              ))}
            </div>
          </Motion.section>
        );
      })}

      <AnimatePresence>
        {selectedProduct && (
          <Motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <Motion.div
              className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.95 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={getProductImage(selectedProduct)}
                alt={selectedProduct.name}
                className="mb-4 h-72 w-full rounded-2xl object-cover"
              />
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-2xl font-bold text-slate-900">{selectedProduct.name}</h3>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {selectedProduct.rarityLevel}
                </span>
              </div>
              <p className="mb-3 text-slate-600">{selectedProduct.description}</p>
              <p className="mb-5 text-sm text-slate-500">Origin: {selectedProduct.origin} · Stock: {selectedProduct.stock}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Add to Cart
                </button>
                <Link
                  to={`/products/${selectedProduct._id}`}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  onClick={() => setSelectedProduct(null)}
                >
                  Open Details
                </Link>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartToast && (
          <Motion.div
            className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.28 }}
          >
            {cartToast}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;