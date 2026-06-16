import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Home, Store, Settings } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { items } = useCartStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* ── DESKTOP / TOP NAV ── */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-primary-green rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-lg font-display font-bold text-primary-green">
                Root & Rise <span className="text-accent-orange">Kids</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`font-medium transition-colors ${isActive('/') ? 'text-primary-green' : 'text-zinc-500 hover:text-primary-green'}`}>Home</Link>
              <Link to="/shop" className={`font-medium transition-colors ${isActive('/shop') ? 'text-primary-green' : 'text-zinc-500 hover:text-primary-green'}`}>Shop</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className={`font-medium transition-colors ${location.pathname.startsWith('/admin') ? 'text-primary-green' : 'text-zinc-500 hover:text-primary-green'}`}>Admin</Link>
              )}
            </div>

            {/* Desktop right side */}
            <div className="hidden md:flex items-center gap-4 border-l pl-6">
              <Link to="/cart" className="relative p-2 text-zinc-500 hover:text-primary-green transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent-orange text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="text-sm font-bold text-zinc-700 hover:text-primary-green transition-colors">
                    Hi, {user.name.split(' ')[0]}
                  </Link>
                  <button onClick={logout} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 bg-primary-green text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary-green/90 transition-colors">
                  <User className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>

            {/* Mobile — just cart icon in top bar */}
            <div className="md:hidden flex items-center gap-2">
              <Link to="/cart" className="relative p-2 text-zinc-600">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent-orange text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">

          {/* Home */}
          <Link to="/" className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all ${isActive('/') ? 'text-primary-green' : 'text-zinc-400'}`}>
            <div className={`p-1.5 rounded-xl transition-all ${isActive('/') ? 'bg-primary-green/10' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-black ${isActive('/') ? 'text-primary-green' : 'text-zinc-400'}`}>Home</span>
          </Link>

          {/* Shop */}
          <Link to="/shop" className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all ${isActive('/shop') ? 'text-primary-green' : 'text-zinc-400'}`}>
            <div className={`p-1.5 rounded-xl transition-all ${isActive('/shop') ? 'bg-primary-green/10' : ''}`}>
              <Store className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-black ${isActive('/shop') ? 'text-primary-green' : 'text-zinc-400'}`}>Shop</span>
          </Link>

          {/* Cart — center highlight */}
          <Link to="/cart" className="flex flex-col items-center gap-0.5 px-2 py-1.5 -mt-4">
            <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${isActive('/cart') ? 'bg-primary-green' : 'bg-accent-orange'}`}>
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-accent-orange text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow border border-accent-orange/20">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black text-zinc-400 mt-0.5">Cart</span>
          </Link>

          {/* Profile / Login */}
          {user ? (
            <Link to="/profile" className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all ${isActive('/profile') ? 'text-primary-green' : 'text-zinc-400'}`}>
              <div className={`p-1.5 rounded-xl transition-all ${isActive('/profile') ? 'bg-primary-green/10' : ''}`}>
                <div className="w-5 h-5 bg-primary-green rounded-full flex items-center justify-center">
                  <span className="text-white text-[9px] font-black">{user.name.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <span className={`text-[10px] font-black ${isActive('/profile') ? 'text-primary-green' : 'text-zinc-400'}`}>Profile</span>
            </Link>
          ) : (
            <Link to="/login" className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all ${isActive('/login') ? 'text-primary-green' : 'text-zinc-400'}`}>
              <div className={`p-1.5 rounded-xl transition-all ${isActive('/login') ? 'bg-primary-green/10' : ''}`}>
                <User className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-black ${isActive('/login') ? 'text-primary-green' : 'text-zinc-400'}`}>Login</span>
            </Link>
          )}

          {/* Admin — only if admin */}
          {user?.role === 'admin' && (
            <Link to="/admin" className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all ${location.pathname.startsWith('/admin') ? 'text-primary-green' : 'text-zinc-400'}`}>
              <div className={`p-1.5 rounded-xl transition-all ${location.pathname.startsWith('/admin') ? 'bg-primary-green/10' : ''}`}>
                <Settings className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-black ${location.pathname.startsWith('/admin') ? 'text-primary-green' : 'text-zinc-400'}`}>Admin</span>
            </Link>
          )}
        </div>
      </div>

      {/* Spacer so content doesn't hide behind bottom nav on mobile */}
      <div className="md:hidden h-20" />
    </>
  );
}