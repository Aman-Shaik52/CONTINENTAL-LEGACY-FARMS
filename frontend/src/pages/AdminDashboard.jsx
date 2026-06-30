import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const initialFormState = {
  name: '',
  category: '',
  origin: '',
  rarityLevel: '',
  price: '',
  stock: '',
  description: '',
  image: '',
  isExtinctType: false,
};

const AdminDashboard = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token || localStorage.getItem('token') || ''}`,
    },
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load products');
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          form,
          getAuthHeaders()
        );
        setSuccess('Product updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/products', form, getAuthHeaders());
        setSuccess('Product added successfully');
      }

      await fetchProducts();
      resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      category: product.category || '',
      origin: product.origin || '',
      rarityLevel: product.rarityLevel || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      description: product.description || '',
      image: product.image || '',
      isExtinctType: Boolean(product.isExtinctType),
    });
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      setSuccess('');
      await axios.delete(`http://localhost:5000/api/products/${id}`, getAuthHeaders());
      setSuccess('Product deleted successfully');
      await fetchProducts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete product');
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const inventoryValue = products.reduce(
    (sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0),
    0
  );
  const lowStockCount = products.filter((product) => Number(product.stock || 0) < 10).length;

  const fieldClass =
    'w-full rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200';

  return (
    <div className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-amber-300/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-4 left-1/3 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-white/60 bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-800 p-6 text-white shadow-[0_30px_70px_-30px_rgba(14,116,144,0.9)] sm:p-8">
          <p className="mb-2 inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
            Control Center
          </p>
          <h1 className="headline-sora text-3xl font-extrabold leading-tight sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-cyan-100/90 sm:text-base">
            Manage your catalog with precision. Add, update, and curate inventory with a premium data-first workflow.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">Products</p>
              <p className="mt-1 text-3xl font-extrabold text-white">{products.length}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">Total Stock</p>
              <p className="mt-1 text-3xl font-extrabold text-white">{totalStock}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">Low Stock (&lt;10)</p>
              <p className="mt-1 text-3xl font-extrabold text-white">{lowStockCount}</p>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="fade-scale-in rounded-3xl border border-cyan-100/70 bg-gradient-to-br from-white via-cyan-50/70 to-sky-100/60 p-6 shadow-[0_30px_60px_-35px_rgba(2,132,199,0.65)] sm:p-8"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="headline-sora text-2xl font-bold text-slate-900">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-slate-300/80 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
            >
              Cancel edit
            </button>
          )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className={fieldClass} required />
            <select name="category" value={form.category} onChange={handleChange} className={fieldClass} required>
              <option value="">Category</option>
              <option value="fruit">Fruit</option>
              <option value="vegetable">Vegetable</option>
              <option value="dairy">Dairy</option>
              <option value="rare food">Rare Food</option>
            </select>
            <input name="origin" value={form.origin} onChange={handleChange} placeholder="Origin" className={fieldClass} required />
            <select name="rarityLevel" value={form.rarityLevel} onChange={handleChange} className={fieldClass} required>
              <option value="">Rarity Level</option>
              <option value="rare">Rare</option>
              <option value="ultra rare">Ultra Rare</option>
              <option value="extinct">Extinct</option>
            </select>
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className={fieldClass} required />
            <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" className={fieldClass} required />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className={`${fieldClass} md:col-span-2`} />
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm md:col-span-2">
              <input name="isExtinctType" type="checkbox" checked={form.isExtinctType} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-400" />
              Is Extinct Type
            </label>
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className={`${fieldClass} mt-4 min-h-[108px]`}
            rows="3"
          />

          {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50/95 p-3 text-sm font-medium text-red-700">{error}</p>}
          {success && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/95 p-3 text-sm font-medium text-emerald-700">{success}</p>}

          <button
            type="submit"
            className="chip-glow mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-cyan-800/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-[0_26px_60px_-38px_rgba(15,23,42,0.55)] backdrop-blur-sm sm:p-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="headline-sora text-2xl font-bold text-slate-900">Products</h2>
            <p className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
              Inventory Value: ${inventoryValue.toFixed(2)}
            </p>
          </div>

          <div className="space-y-4">
            {products.map((product) => (
              <article
                key={product._id}
                className="card-lift rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white via-slate-50/90 to-cyan-50/70 p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      ${product.price} - {product.stock} in stock
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.08em]">
                      <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-cyan-800">{product.category}</span>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">{product.rarityLevel}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{product.origin}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      className="rounded-lg bg-gradient-to-r from-rose-600 to-red-700 px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;