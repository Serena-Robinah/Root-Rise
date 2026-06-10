import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', path: '/admin/products', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Mobile backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-primary-green text-white transition-all duration-300 flex flex-col z-50
          fixed inset-y-0 left-0
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-20 md:translate-x-0'}
        `}
      >
        <div className="p-4 md:p-6 flex items-center justify-between">
          <Link to="/" className={`flex items-center space-x-2 ${!isSidebarOpen && 'md:hidden'}`}>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
              <span className="text-primary-green font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-display font-bold whitespace-nowrap">Admin <span className="text-accent-orange">Panel</span></span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0 hidden md:block"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-grow px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-accent-orange text-white shadow-lg'
                    : 'text-soft-cream/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className={`font-medium ${!isSidebarOpen ? 'md:hidden' : ''}`}>{item.name}</span>
                {isActive && <ChevronRight className={`w-4 h-4 ml-auto ${!isSidebarOpen ? 'md:hidden' : ''}`} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-soft-cream/70 hover:bg-red-500/20 hover:text-red-400 transition-all w-full"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`font-medium ${!isSidebarOpen ? 'md:hidden' : ''}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 md:h-20 bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors hidden md:block"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base md:text-xl font-display font-bold text-primary-green">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Admin'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-zinc-800">{user.name}</p>
              <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Administrator</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-soft-cream rounded-full flex items-center justify-center text-primary-green">
              <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
