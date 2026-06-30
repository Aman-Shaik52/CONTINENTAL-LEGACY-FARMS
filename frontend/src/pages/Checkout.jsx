import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, clearCart, total } = useCart();
  const { user, token } = useAuth();
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          userId: user?.id,
          cartItems: cart.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          totalPrice: total,
          shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('token') || ''}`,
          },
        }
      );

      setMessage('Order placed successfully');
      clearCart();
      setTimeout(() => navigate('/orders'), 1000);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-slate-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.product._id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-4 flex items-center justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-green-700">${total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <textarea
            value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)}
            rows="6"
            className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-green-500"
            placeholder="Enter your shipping address"
            required
          />

          {message && <p className="mt-4 rounded-2xl bg-green-50 p-3 text-green-700">{message}</p>}
          {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-red-700">{error}</p>}

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Placing order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;