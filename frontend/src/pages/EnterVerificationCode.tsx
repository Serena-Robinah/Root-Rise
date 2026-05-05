import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function EnterVerificationCode() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showResend, setShowResend] = React.useState(false);
  const [email, setEmail] = React.useState(searchParams.get('email') ?? '');
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
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-bold">Verify your email</h2>
          <p className="text-zinc-500 text-sm">
            We sent a verification link to{' '}
            {email ? <strong className="text-zinc-700">{email}</strong> : 'your email address'}.
            <br />Click the link in the email, or paste the token below.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-zinc-700 ml-1 mb-1">Verification Token</label>
            <input
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-green/20"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste the token from your email"
            />
          </div>
          {message && (
            <p className={`text-sm px-3 py-2 rounded-lg ${message.includes('success') || message.includes('verified') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              {message}
            </p>
          )}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1 py-3" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <button type="button" className="btn-secondary px-5 py-3" onClick={() => navigate('/login')}>
              Cancel
            </button>
          </div>
        </form>

        <div className="border-t pt-4">
          <p className="text-sm text-zinc-500 text-center">Didn't receive the email?</p>
          <div className="mt-3 space-y-2">
            <input
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            <button
              type="button"
              className="w-full btn-secondary py-3 text-sm"
              onClick={resend}
            >
              Resend verification email
            </button>
            {resendMessage && (
              <p className={`text-sm px-3 py-2 rounded-lg ${resendMessage.includes('resent') || resendMessage.includes('sent') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {resendMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
