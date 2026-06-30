import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';

const heroContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const heroHighlights = [
  'Global premium sourcing',
  'Daily flash prices',
  'Verified farm-to-home freshness',
  'Limited ultra-rare drops',
];

const tickerItems = [
  'Flash Sale 70% Off Rare Picks',
  'Express Delivery in 90 Minutes',
  'New Farm Drops Every Day at 8 PM',
  'Premium Club Members Get Early Access',
];

const flashDeals = [
  {
    id: 'deal-1',
    title: 'Dragon Fruit Estate Box',
    price: '$49.90',
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80',
    label: 'Lightning Deal',
  },
  {
    id: 'deal-2',
    title: 'Romanesco Green Bundle',
    price: '$27.40',
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=900&q=80',
    label: 'Best Seller',
  },
  {
    id: 'deal-3',
    title: 'Comte and Burrata Duo',
    price: '$33.25',
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=900&q=80',
    label: 'Farm Fresh',
  },
  {
    id: 'deal-4',
    title: 'Saffron Signature Pack',
    price: '$89.00',
    image: 'https://images.unsplash.com/photo-1573414405995-0c9fc445a86a?auto=format&fit=crop&w=900&q=80',
    label: 'Premium Drop',
  },
];

const launchTabs = [
  {
    key: 'fruit',
    title: 'Fruit Arena',
    subtitle: 'Color-rich, exotic, and seasonal picks with rapid restock.',
    accent: 'from-red-500 to-orange-400',
    cards: [
      { name: 'Mangosteen Reserve', price: '$14.50', image: 'https://images.unsplash.com/photo-1623428454614-abaf08018039?auto=format&fit=crop&w=800&q=80' },
      { name: 'Yuzu Citrus Gold', price: '$11.90', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80' },
      { name: 'Rambutan Fresh Crate', price: '$16.20', image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    key: 'vegetable',
    title: 'Vegetable Vault',
    subtitle: 'Chef-favorite roots, greens, and heritage crops in one click.',
    accent: 'from-emerald-500 to-lime-400',
    cards: [
      { name: 'Romanesco Crown', price: '$9.80', image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80' },
      { name: 'Purple Carrot Prime', price: '$8.70', image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=80' },
      { name: 'Lotus Root Crisp', price: '$12.10', image: 'https://images.unsplash.com/photo-1592997572594-34be01bc36c7?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    key: 'dairy',
    title: 'Dairy Studio',
    subtitle: 'Small-batch artisan dairy for high-flavor everyday luxury.',
    accent: 'from-blue-500 to-cyan-400',
    cards: [
      { name: 'Burrata Pearl Box', price: '$19.40', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80' },
      { name: 'Kefir Reserve Bottle', price: '$7.50', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80' },
      { name: 'Aged Paneer Craft', price: '$13.90', image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    key: 'rare-food',
    title: 'Rare Elite',
    subtitle: 'Collector-grade ingredients and gourmet signatures.',
    accent: 'from-amber-500 to-yellow-400',
    cards: [
      { name: 'White Truffle Select', price: '$120.00', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145f9d?auto=format&fit=crop&w=800&q=80' },
      { name: 'Beluga Caviar Tin', price: '$95.00', image: 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?auto=format&fit=crop&w=800&q=80' },
      { name: 'Saffron Gold Threads', price: '$61.00', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80' },
    ],
  },
];

const trustMetrics = [
  { label: 'Orders Delivered', value: '120K+' },
  { label: 'Farm Partners', value: '340+' },
  { label: 'Customer Satisfaction', value: '98.7%' },
  { label: 'Cities Covered', value: '240+' },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState(launchTabs[0].key);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const activeTabData = useMemo(
    () => launchTabs.find((tab) => tab.key === activeTab) || launchTabs[0],
    [activeTab]
  );

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Motion.section
        className="theme-aurora relative overflow-hidden text-white"
        variants={heroContainer}
        initial="hidden"
        animate="show"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_55%),radial-gradient(circle_at_85%_15%,rgba(234,179,8,0.2),transparent_40%)]" />
        <Motion.div
          className="float-soft absolute -left-16 top-16 h-40 w-40 rounded-full bg-cyan-300/30 blur-2xl"
          animate={{ opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <Motion.div
          className="absolute -right-10 bottom-10 h-44 w-44 rounded-full bg-orange-300/35 blur-2xl"
          animate={{ y: [0, -14, 0], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 6.3, repeat: Infinity }}
        />
        <div className="container relative mx-auto px-4 py-14 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Motion.p className="chip-glow mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider" variants={fadeUp}>
                Marketplace Launchpad
              </Motion.p>
              <Motion.h1 className="headline-sora mb-4 text-4xl font-black leading-tight md:text-6xl" variants={fadeUp}>
                Shop Rare Harvests Like a Premium Mega Market
              </Motion.h1>
              <Motion.p className="mb-7 max-w-xl text-base text-slate-200 md:text-lg" variants={fadeUp}>
                Discover the energy of top ecommerce home tabs with curated deals, fast discovery lanes, and cinematic product experiences built for modern buyers.
              </Motion.p>

              <Motion.form className="mb-6 flex flex-col gap-3 sm:flex-row" variants={fadeUp} onSubmit={handleSearch}>
                <div className="glass-shell flex w-full items-center rounded-xl px-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search for fruits, dairy, rare ingredients..."
                    className="w-full bg-transparent py-3 text-sm text-white placeholder:text-slate-300 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="chip-glow relative overflow-hidden rounded-xl bg-amber-400 px-6 py-3 text-center text-sm font-bold text-slate-900 transition hover:bg-amber-300"
                >
                  Start Shopping
                </button>
              </Motion.form>

              <Motion.div className="grid grid-cols-2 gap-2 text-xs text-slate-200 md:grid-cols-4" variants={fadeUp}>
                {heroHighlights.map((item) => (
                  <div key={item} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-center">
                    {item}
                  </div>
                ))}
              </Motion.div>
            </div>

            <Motion.div className="grid grid-cols-2 gap-4" variants={fadeUp}>
              {flashDeals.map((deal, index) => (
                <Motion.div
                  key={deal.id}
                  className="glass-shell fade-scale-in relative overflow-hidden rounded-2xl shadow-xl"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.07 + 0.15 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <img src={deal.image} alt={deal.title} className="h-36 w-full object-cover" />
                  <div className="p-3">
                    <span className="mb-2 inline-block rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide">
                      {deal.label}
                    </span>
                    <h3 className="line-clamp-2 text-sm font-semibold">{deal.title}</h3>
                    <p className="mt-2 text-lg font-black text-amber-300">{deal.price}</p>
                  </div>
                </Motion.div>
              ))}
            </Motion.div>
          </div>
        </div>
      </Motion.section>

      <div className="border-y border-slate-200 bg-white/85 py-2 backdrop-blur">
        <Motion.div
          className="flex gap-4 whitespace-nowrap px-4 text-sm font-bold text-slate-700"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'linear' }}
        >
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1">
              {item}
            </span>
          ))}
        </Motion.div>
      </div>

      <section className="container mx-auto px-4 py-14">
        <Motion.div
          className="mb-6 flex flex-wrap items-center justify-between gap-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-black text-slate-900">Trending Start Tabs</h2>
          <Link to="/products" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            Explore All Products
          </Link>
        </Motion.div>

        <div className="mb-6 flex flex-wrap gap-2">
          {launchTabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'text-white' : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isActive && (
                  <Motion.span
                    layoutId="active-home-tab"
                    className={`absolute inset-0 bg-gradient-to-r ${tab.accent}`}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.title}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link to="/products?category=fruit" className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-200">Fruits</Link>
          <Link to="/products?category=vegetable" className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-200">Vegetables</Link>
          <Link to="/products?category=dairy" className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-200">Dairy Products</Link>
          <Link to="/products?category=rare+food" className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-200">Rare Foods</Link>
          <Link to="/products?rarity=extinct" className="rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200">Extinct Picks</Link>
        </div>

        <AnimatePresence mode="wait">
          <Motion.div
            key={activeTabData.key}
            className="rounded-3xl bg-white p-5 shadow-lg md:p-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h3 className="headline-sora text-2xl font-bold text-slate-900">{activeTabData.title}</h3>
              <p className="max-w-xl text-sm text-slate-600">{activeTabData.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {activeTabData.cards.map((item, index) => (
                <Motion.div
                  key={item.name}
                  className="group overflow-hidden rounded-2xl border border-slate-200"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                >
                  <img src={item.image} alt={item.name} className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
                  <div className="p-4">
                    <h4 className="text-base font-semibold text-slate-900">{item.name}</h4>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xl font-black text-slate-800">{item.price}</span>
                      <Link to="/products" className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                        View
                      </Link>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </div>
          </Motion.div>
        </AnimatePresence>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <Motion.div
          className="grid grid-cols-2 gap-4 rounded-3xl bg-slate-900 p-6 text-white md:grid-cols-4"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          {trustMetrics.map((metric, index) => (
            <Motion.div
              key={metric.label}
              className="rounded-xl border border-white/15 bg-white/5 p-4 text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06 }}
            >
              <p className="text-2xl font-black text-amber-300">{metric.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-300">{metric.label}</p>
            </Motion.div>
          ))}
        </Motion.div>
      </section>
    </div>
  );
};

export default Home;