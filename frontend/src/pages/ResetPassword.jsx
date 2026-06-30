import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(phone, newPassword);
      toast.success('Password reset successful');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!phone) {
    return (
      <div className="container mx-auto max-w-md px-4 py-10 text-center">
        <p className="rounded-lg bg-amber-50 p-4 text-amber-800">Reset session expired. Restart forgot password flow.</p>
        <Link to="/forgot-password" className="mt-4 inline-block text-green-700 hover:underline">
          Go to Forgot Password
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <h1 className="mb-2 text-center text-3xl font-bold">Reset Password</h1>
      <p className="mb-6 text-center text-sm text-slate-600">Phone: {phone}</p>
      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4">
          <label className="mb-2 block text-gray-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded border p-2"
            minLength={8}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded border p-2"
            minLength={8}
            required
          />
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
