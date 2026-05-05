import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EnterVerificationCode() {
  const [token, setToken] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showResend, setShowResend] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [resendMessage, setResendMessage] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setMessage(null);
    if (!token) return setMessage('Please enter the verification code.');
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }
      const json = await res.json();
      if (res.ok) {
        setMessage(json.message || 'Email verified successfully.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(json.error || 'Verification failed.');
      }
    } catch (err) {
      setMessage('Network error while verifying email.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email) return setResendMessage('Please enter your email to resend.');
    setResendMessage(null);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) setResendMessage(json.message || 'Verification email resent.');
      else setResendMessage(json.error || 'Failed to resend verification email.');
    } catch (err) {
      setResendMessage('Network error while resending.');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold">Enter Verification Code</h2>
        <form onSubmit={submit} className="mt-4">
          <label className="block text-sm text-zinc-600">Verification Code</label>
          <input
            className="w-full border rounded px-3 py-2 mt-2"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste the code from your email"
          />
          {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
          <div className="mt-4 flex gap-2">
            <button type="submit" className="btn-primary px-4 py-2" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            <button type="button" className="btn-secondary px-4 py-2" onClick={() => navigate('/login')}>
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 border-t pt-4">
          <button className="text-sm text-blue-600" onClick={() => setShowResend((s) => !s)}>
            {showResend ? 'Hide' : 'Resend verification email'}
          </button>
          {showResend && (
            <div className="mt-3">
              <label className="block text-sm text-zinc-600">Email</label>
              <input
                className="w-full border rounded px-3 py-2 mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
              <div className="mt-3 flex gap-2">
                <button type="button" className="btn-primary px-4 py-2" onClick={resend}>
                  Resend
                </button>
                <button type="button" className="btn-secondary px-4 py-2" onClick={() => setShowResend(false)}>
                  Close
                </button>
              </div>
              {resendMessage && <p className="mt-2 text-sm">{resendMessage}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
