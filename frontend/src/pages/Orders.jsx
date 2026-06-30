import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('token') || ''}`,
          },
        });
        setOrders(response.data.orders || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <div className="container mx-auto py-12 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {error && <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-700">{error}</div>}

      {!error && orders.length === 0 && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
          <p className="text-slate-600">No orders found.</p>
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Order ID</p>
                <p className="font-semibold">{order._id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <p className="font-semibold capitalize text-green-700">{order.orderStatus}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date</p>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total</p>
                <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <p className="mb-4 text-sm text-slate-600">{order.shippingAddress}</p>
            <div className="space-y-2">
              {order.products.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-sm">
                  <span>{item.productId?.name || 'Product'}</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;