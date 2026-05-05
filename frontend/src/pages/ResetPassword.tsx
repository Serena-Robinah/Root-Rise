import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { authService } from '../services';

const resetSchema = z.object({ password: z.string().min(6, 'Password must be at least 6 characters') });
type Form = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(resetSchema) });
  const [status, setStatus] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: Form) => {
    setLoading(true);
    setStatus(null);
    try {
      await authService.resetPassword(token, data.password);
      setStatus('Password reset successful — redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setStatus('Invalid or expired token.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-display font-bold">Reset Password</h1>
          <p className="text-zinc-500">Set a new password for your account</p>
        </div>

        {status && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{status}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input {...register('password')} type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200" />
            </div>
            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg flex items-center justify-center disabled:opacity-50">{loading ? 'Resetting...' : 'Reset password'}</button>
        </form>
      </motion.div>
    </div>
  );
}
