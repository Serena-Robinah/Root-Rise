import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services';
import { motion } from 'motion/react';
const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
export default function Signup() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const redirect = searchParams.get('redirect') || '/';
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signupSchema),
    });
    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authService.signup(data.name, data.email, data.password);
            setAuth(result.user, result.token);
            navigate(redirect);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-[80vh] flex items-center justify-center px-4 py-12", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white p-8 sm:p-12 rounded-3xl shadow-xl w-full max-w-md space-y-8", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("h1", { className: "text-4xl font-display font-bold", children: "Create Account" }), _jsx("p", { className: "text-zinc-500", children: "Join Root & Rise Kids family today" })] }), error && (_jsxs("div", { className: "bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium", children: [_jsx(AlertCircle, { className: "w-5 h-5 shrink-0" }), _jsx("span", { children: error })] })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-zinc-700 ml-1", children: "Full Name" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" }), _jsx("input", { ...register('name'), type: "text", placeholder: "Jane Doe", className: "w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20" })] }), errors.name && _jsx("p", { className: "text-xs text-red-500 ml-1", children: errors.name.message })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-zinc-700 ml-1", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" }), _jsx("input", { ...register('email'), type: "email", placeholder: "hello@example.com", className: "w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20" })] }), errors.email && _jsx("p", { className: "text-xs text-red-500 ml-1", children: errors.email.message })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-zinc-700 ml-1", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" }), _jsx("input", { ...register('password'), type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20" })] }), errors.password && _jsx("p", { className: "text-xs text-red-500 ml-1", children: errors.password.message })] }), _jsxs("button", { type: "submit", disabled: loading, className: "w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2 disabled:opacity-50", children: [_jsx("span", { children: loading ? 'Creating Account...' : 'Sign Up' }), !loading && _jsx(ArrowRight, { className: "w-5 h-5" })] })] }), _jsx("div", { className: "text-center pt-4", children: _jsxs("p", { className: "text-zinc-500", children: ["Already have an account? ", ' ', _jsx(Link, { to: `/login?redirect=${redirect}`, className: "text-primary-green font-bold hover:underline", children: "Login here" })] }) })] }) }));
}
//# sourceMappingURL=Signup.js.map