import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.product._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <img src={item.product.image || '/placeholder.jpg'} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1 ml-4">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p>${item.product.price}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product._id, true)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 text-right">
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            <Link
              to="/checkout"
              className="mt-4 inline-block rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;