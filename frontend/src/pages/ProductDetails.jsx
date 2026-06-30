import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cartToast, setCartToast] = useState('');
  const { addToCart } = useCart();
  const toastTimerRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
  }, []);

  const handleAddToCart = () => {
    addToCart(product);
    setCartToast(`${product.name} added to cart`);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setCartToast('');
    }, 2000);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8 relative">
      <Motion.div
        className="grid grid-cols-1 gap-8 md:grid-cols-2"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Motion.img
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          className="h-96 w-full rounded-3xl object-cover shadow-xl"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        />
        <Motion.div
          className="rounded-3xl bg-white p-6 shadow-lg"
          initial={{ opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.42, delay: 0.08 }}
        >
          <h1 className="mb-3 text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mb-4 text-3xl font-black text-slate-800">${Number(product.price || 0).toFixed(2)}</p>
          <span className={`mb-4 inline-block rounded-full px-3 py-1 text-sm ${
            product.rarityLevel === 'extinct' ? 'bg-red-200 text-red-800' :
            product.rarityLevel === 'ultra rare' ? 'bg-violet-200 text-violet-800' :
            'bg-yellow-200 text-yellow-800'
          }`}>
            {product.rarityLevel}
          </span>
          <p className="mb-4 text-slate-700">{product.description}</p>
          <p className="mb-2"><strong>Category:</strong> {product.category}</p>
          <p className="mb-2"><strong>Origin:</strong> {product.origin}</p>
          <p className="mb-5"><strong>Stock:</strong> {product.stock}</p>
          <Motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Add to Cart
          </Motion.button>
        </Motion.div>
      </Motion.div>

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

export default ProductDetails;