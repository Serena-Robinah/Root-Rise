import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const submittedRef = React.useRef(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const redirect = searchParams.get('redirect') || '/';
  

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    setLoading(true);
    setError(null);
    try {
      const result = await authService.googleLogin(credentialResponse.credential);
      setAuth(result.user, result.token);
      navigate(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signup(data.name, data.email, data.password);
      if (result.token) {
        // Already verified (e.g. admin-created account)
        setAuth(result.user, result.token);
        navigate(redirect);
      } else {
        // Redirect to verify-code page with email pre-filled
        navigate(`/verify-code?email=${encodeURIComponent(data.email)}`);
      }
    } catch (err) {
      submittedRef.current = false;
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-bold">Create Account</h1>
          <p className="text-zinc-500">Join Root & Rise Kids family today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                {...register('name')}
                type="text" 
                placeholder="Enter your full name"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                {...register('email')}
                type="email" 
                placeholder="hello@example.com"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
  <label className="text-sm font-bold text-zinc-700 ml-1">Password</label>
  <div className="relative">
    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
    <input
      {...register('password')}
      type={showPassword ? 'text' : 'password'}
      placeholder="••••••••"
      className="w-full pl-12 pr-12 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
    >
      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </div>
  {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
</div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-zinc-500">
            Already have an account? {' '}
            <Link to={`/login?redirect=${redirect}`} className="text-primary-green font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs text-zinc-400">
            <span className="bg-white px-3">or sign up with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-in failed. Please try again.')}
            useOneTap={false}
            shape="rectangular"
            theme="outline"
            size="large"
            text="signup_with"
            width="368"
          />
        </div>
      </motion.div>
    </div>
  );
}
