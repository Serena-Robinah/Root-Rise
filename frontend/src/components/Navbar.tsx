import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { items } = useCartStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-display font-bold text-primary-green">Root & Rise <span className="text-accent-orange">Kids</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-zinc-600 hover:text-primary-green font-medium">Home</Link>
            <Link to="/shop" className="text-zinc-600 hover:text-primary-green font-medium">Shop</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-zinc-600 hover:text-primary-green font-medium">Admin</Link>
            )}
            
            <div className="flex items-center space-x-4 border-l pl-8">
              <Link to="/cart" className="relative p-2 text-zinc-600 hover:text-primary-green transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-accent-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-zinc-600">Hi, {user.name}</span>
                  <button onClick={logout} className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="p-2 text-zinc-600 hover:text-primary-green transition-colors">
                  <User className="w-6 h-6" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-zinc-600">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-zinc-600">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4 space-y-4">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-zinc-600 font-medium">Home</Link>
          <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block text-zinc-600 font-medium">Shop</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-zinc-600 font-medium">Admin</Link>
          )}
          {user ? (
            <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left text-red-500 font-medium">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-zinc-600 font-medium">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
