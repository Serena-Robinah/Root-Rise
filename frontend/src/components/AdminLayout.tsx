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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

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
      {/* Sidebar */}
      <aside 
        className={`bg-primary-green text-white transition-all duration-300 flex flex-col z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed inset-y-0 left-0 md:relative`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className={`flex items-center space-x-2 ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary-green font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-display font-bold">Admin <span className="text-accent-orange">Panel</span></span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5 md:hidden" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-grow px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-accent-orange text-white shadow-lg' 
                    : 'text-soft-cream/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                {isActive && isSidebarOpen && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-soft-cream/70 hover:bg-red-500/20 hover:text-red-400 transition-all w-full`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-xl font-display font-bold text-primary-green">
            {menuItems.find(i => i.path === location.pathname)?.name || 'Admin'}
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-zinc-800">{user.name}</p>
              <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-soft-cream rounded-full flex items-center justify-center text-primary-green">
              <UserIcon className="w-6 h-6" />
            </div>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">
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
