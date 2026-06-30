import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword(phone);
      toast.success('Reset OTP sent to phone');
      navigate('/verify-otp', {
        state: {
          flow: 'reset',
          phone,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4">
          <label className="mb-2 block text-gray-700">Phone (+countrycode)</label>
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded border p-2"
            placeholder="+14155552671"
            required
          />
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Sending OTP...' : 'Send Reset OTP'}
        </button>
        <p className="mt-4 text-sm text-slate-600">
          Back to <Link className="text-green-700 hover:underline" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
