import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4">
          <label className="mb-2 block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-60" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-green-700 hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="text-slate-700 hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;