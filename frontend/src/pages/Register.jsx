import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(form);
      toast.success('Email OTP sent');
      navigate('/verify-otp', {
        state: {
          flow: 'signup-email',
          email: form.email,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4">
          <label className="mb-2 block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />
        </div>
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
          <label className="mb-2 block text-gray-700">Phone (+countrycode)</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded border p-2"
            placeholder="+14155552671"
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
            minLength={8}
            required
          />
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-60" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Continue'}
        </button>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account? <Link className="text-green-700 hover:underline" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;