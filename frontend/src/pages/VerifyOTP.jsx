import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyEmailOtp, sendPhoneOtp, verifyPhoneOtp, verifyResetOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { flow, email, phone } = location.state || {};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (flow === 'signup-email') {
        await verifyEmailOtp(email, otp);
        await sendPhoneOtp(email);
        toast.success('Email verified. Phone OTP sent.');
        navigate('/verify-otp', {
          state: {
            flow: 'signup-phone',
            email,
          },
        });
      } else if (flow === 'signup-phone') {
        await verifyPhoneOtp(email, otp);
        toast.success('Phone verified. Account created.');
        navigate('/');
      } else if (flow === 'reset') {
        await verifyResetOtp(phone, otp);
        toast.success('OTP verified. Set your new password.');
        navigate('/reset-password', { state: { phone } });
      } else {
        setError('Invalid OTP flow. Please start again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const title =
    flow === 'signup-email'
      ? 'Verify Email OTP'
      : flow === 'signup-phone'
      ? 'Verify Phone OTP'
      : 'Verify Reset OTP';

  if (!flow) {
    return (
      <div className="container mx-auto max-w-md px-4 py-10 text-center">
        <p className="rounded-lg bg-amber-50 p-4 text-amber-800">OTP flow expired. Please start again.</p>
        <Link to="/register" className="mt-4 inline-block text-green-700 hover:underline">
          Go to Register
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <h1 className="mb-2 text-center text-3xl font-bold">{title}</h1>
      <p className="mb-6 text-center text-sm text-slate-600">
        {flow === 'reset' ? `Phone: ${phone}` : `Email: ${email}`}
      </p>
      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4">
          <label className="mb-2 block text-gray-700">6-digit OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            className="w-full rounded border p-2 tracking-[0.3em]"
            maxLength={6}
            required
          />
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
