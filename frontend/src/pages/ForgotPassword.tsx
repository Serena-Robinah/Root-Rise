import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { authService } from '../services';

const forgotSchema = z.object({ email: z.string().email('Invalid email address') });
type Form = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(forgotSchema) });
  const [status, setStatus] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: Form) => {
    setLoading(true);
    setStatus(null);
    try {
      await authService.forgotPassword(data.email, window.location.origin);
      setStatus('If an account exists, a reset email was sent.');
    } catch (err) {
      setStatus('Something went wrong. Try again later.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-display font-bold">Forgot Password</h1>
          <p className="text-zinc-500">Enter your email to receive reset instructions</p>
        </div>

        {status && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{status}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input {...register('email')} type="email" placeholder="hello@example.com" className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200" />
            </div>
            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg flex items-center justify-center disabled:opacity-50">{loading ? 'Sending...' : 'Send reset email'}</button>
        </form>
      </motion.div>
    </div>
  );
}
