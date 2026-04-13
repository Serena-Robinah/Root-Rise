import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-green text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary-green font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-display font-bold">Root & Rise <span className="text-accent-orange">Kids</span></span>
            </Link>
            <p className="text-soft-cream/80 text-sm leading-relaxed">
              Adorable & affordable finds for your little ones. We believe in natural, safe, and playful clothing for every child.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-accent-orange transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-accent-orange transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-accent-orange transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm text-soft-cream/80">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/shop?category=Newborn" className="hover:text-white transition-colors">Newborn</Link></li>
              <li><Link to="/shop?category=Toddler" className="hover:text-white transition-colors">Toddler</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6">Customer Care</h3>
            <ul className="space-y-3 text-sm text-soft-cream/80">
              <li><Link to="#" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-soft-cream/80">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent-orange shrink-0" />
                <span>123 Playful Lane, Kids City, KC 56789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent-orange shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent-orange shrink-0" />
                <span>hello@rootandrise.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-soft-cream/60">
          <p>© {new Date().getFullYear()} Root & Rise Kids. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
