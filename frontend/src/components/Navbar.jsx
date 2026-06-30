import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const topNavLinks = [
  { label: 'Fruits', to: '/products?category=fruit' },
  { label: 'Vegetables', to: '/products?category=vegetable' },
  { label: 'Dairy', to: '/products?category=dairy' },
  { label: 'Rare Foods', to: '/products?category=rare+food' },
  { label: 'Extinct Picks', to: '/products?rarity=extinct' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const navItemHover = { y: -2, scale: 1.04 };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products');
  };

  return (
    <Motion.div
      className="sticky-nav-shell text-white shadow-lg"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="px-4 py-3">
        <div className="container mx-auto flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Motion.div whileHover={navItemHover}>
            <Link to="/" className="headline-sora text-xl font-bold tracking-tight transition hover:opacity-90 md:text-2xl">
              Continental Legacy Farm
            </Link>
          </Motion.div>

          <form className="glass-shell flex w-full items-center rounded-xl px-3 lg:max-w-xl" onSubmit={handleSearch}>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search fruits, dairy, rare foods..."
              className="w-full bg-transparent py-2.5 text-sm placeholder:text-white/70 focus:outline-none"
            />
            <button type="submit" className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 transition hover:bg-amber-300">
              Search
            </button>
          </form>

          <div className="flex items-center gap-4 text-sm">
            <Motion.div whileHover={navItemHover}><Link to="/products" className="transition hover:text-blue-100">Products</Link></Motion.div>
            {user ? (
              <>
                <Motion.div whileHover={navItemHover}><Link to="/cart" className="chip-glow relative overflow-hidden rounded-lg bg-white/15 px-3 py-1.5 font-semibold transition hover:bg-white/25">Cart ({cart.length})</Link></Motion.div>
                <Motion.button
                  onClick={logout}
                  className="rounded-lg bg-white/15 px-3 py-1.5 transition hover:bg-white/25"
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Logout
                </Motion.button>
              </>
            ) : (
              <>
                <Motion.div whileHover={navItemHover}><Link to="/login" className="transition hover:text-blue-100">Login</Link></Motion.div>
                <Motion.div whileHover={navItemHover}><Link to="/register" className="transition hover:text-blue-100">Register</Link></Motion.div>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="border-t border-white/15 bg-black/20 px-4 py-2">
        <div className="container mx-auto flex items-center gap-2 overflow-x-auto text-xs font-semibold text-white/90">
          {topNavLinks.map((item) => (
            <Link key={item.label} to={item.to} className="whitespace-nowrap rounded-full bg-white/10 px-3 py-1 transition hover:bg-white/20">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </Motion.div>
  );
};

export default Navbar;