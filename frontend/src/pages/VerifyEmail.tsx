import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setMessage('Missing verification token.');
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        if (res.redirected) {
          // Backend redirects to frontend; follow and show success
          window.location.href = res.url;
          return;
        }
        const json = await res.json();
        if (res.ok) setMessage(json.message || 'Email verified successfully.');
        else setMessage(json.error || 'Verification failed.');
      } catch (err) {
        setMessage('Network error while verifying email.');
      }
    })();
  }, [searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
        <h2 className="text-2xl font-bold">Email Verification</h2>
        <p className="mt-4 text-zinc-600">{message ?? 'Verifying...'}</p>
        <div className="mt-6">
          <button onClick={() => navigate('/login')} className="btn-primary px-6 py-2">Go to Login</button>
        </div>
      </div>
    </div>
  );
}
