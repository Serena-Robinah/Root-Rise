import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { authService } from '../services';

const profileSchema = z.object({ name: z.string().min(1, 'Required'), email: z.string().email('Invalid email'), password: z.string().optional() });
type Form = z.infer<typeof profileSchema>;

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({ resolver: zodResolver(profileSchema) });

  React.useEffect(() => {
    (async () => {
      try {
        const user = await authService.me();
        reset({ name: user.name || '', email: user.email || '' });
      } catch (err) {
        navigate('/login');
      }
    })();
  }, [navigate, reset]);

  const onSubmit = async (data: Form) => {
    setLoading(true); setStatus(null);
    try {
      const updated = await authService.updateProfile(data as any);
      authService.saveUser(updated as any);
      setStatus('Profile updated');
    } catch (err) {
      setStatus('Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-display font-bold">Your Profile</h1>
          <p className="text-zinc-500">Manage your account details</p>
        </div>

        {status && <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{status}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input {...register('name')} type="text" placeholder="Your name" className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200" />
            </div>
            {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input {...register('email')} type="email" placeholder="you@example.com" className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200" />
            </div>
            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">New Password (optional)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input {...register('password')} type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200" />
            </div>
            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg flex items-center justify-center disabled:opacity-50">{loading ? 'Saving...' : 'Save changes'}</button>
        </form>
      </motion.div>
    </div>
  );
}
