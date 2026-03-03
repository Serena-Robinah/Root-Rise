import React from 'react';
import { X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

export default function AuthModal({ isOpen, onClose, redirectPath = '/checkout' }: AuthModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary-green/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-primary-green transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8 sm:p-12 text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold text-primary-green">Join the Family</h2>
              <p className="text-zinc-500">Please login or sign up to place your order and track your delivery.</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => navigate(`/login?redirect=${redirectPath}`)}
                className="w-full btn-primary py-4 text-lg"
              >
                Login to Account
              </button>
              <button 
                onClick={() => navigate(`/signup?redirect=${redirectPath}`)}
                className="w-full border-2 border-primary-green text-primary-green py-4 rounded-xl font-bold hover:bg-primary-green/5 transition-colors"
              >
                Create New Account
              </button>
            </div>

            <button 
              onClick={onClose}
              className="text-sm font-medium text-zinc-400 hover:text-primary-green transition-colors"
            >
              Continue Browsing
            </button>
          </div>
          
          <div className="bg-soft-cream p-4 text-center">
            <p className="text-xs text-primary-green/60 font-medium">Root & Rise Kids – Safe & Natural for your little ones.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
