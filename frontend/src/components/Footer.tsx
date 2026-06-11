import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.27.135.53.20.79.20.347 0 .697-.08 1.047-.24.2-.096.397-.144.572-.144.479 0 .921.29.921.733 0 .568-.761.988-1.526 1.139l-.074.014c-.437.08-.64.124-.695.398-.062.316.003.6.161.87.229.394 1.15 2.065.938 3.39-.094.585-.491.87-.944.87-.131 0-.268-.02-.403-.06l-.038-.013c-.36-.109-.761-.254-1.194-.254-.22 0-.45.027-.686.089-.457.12-.863.47-1.31.867-.667.589-1.41 1.26-2.532 1.47-.097.018-.196.025-.295.025-.1 0-.198-.007-.297-.025-1.12-.21-1.864-.88-2.531-1.47-.447-.397-.853-.747-1.31-.867-.237-.062-.467-.089-.686-.089-.433 0-.834.145-1.194.254l-.038.013c-.135.04-.272.06-.403.06-.453 0-.85-.285-.944-.87-.212-1.325.709-2.996.938-3.39.158-.27.223-.554.161-.87-.055-.274-.258-.318-.695-.398l-.074-.014C2.345 10.54 1.584 10.12 1.584 9.552c0-.443.442-.733.921-.733.175 0 .372.048.572.144.35.16.7.24 1.047.24.26 0 .52-.065.79-.20l-.03-.51-.003-.06C4.777 6.89 4.651 4.864 5.18 3.671 6.763 1.126 10.12.793 11.11.793l.547-.001.549.001z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-primary-green text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
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
            <div className="flex space-x-3 pt-1">
              <a href="https://www.instagram.com/rootandrisehub_ug" target="_blank" rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent-orange transition-colors flex items-center justify-center">
                <InstagramIcon />
              </a>
              <a href="https://www.tiktok.com/@rootandrisehub" target="_blank" rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent-orange transition-colors flex items-center justify-center">
                <TikTokIcon />
              </a>
              <a href="https://www.snapchat.com/add/Rootandrisehub" target="_blank" rel="noopener noreferrer"
                aria-label="Snapchat"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent-orange transition-colors flex items-center justify-center">
                <SnapchatIcon />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm text-soft-cream/80">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/shop?age=0–1" className="hover:text-white transition-colors">Newborn</Link></li>
              <li><Link to="/shop?age=2–4" className="hover:text-white transition-colors">Toddler</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-5">Customer Care</h3>
            <ul className="space-y-3 text-sm text-soft-cream/80">
              <li><Link to="#" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-5">Contact Us</h3>
            <ul className="space-y-4 text-sm text-soft-cream/80">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent-orange shrink-0" />
                <span>Contact us for more details</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent-orange shrink-0" />
                <span>+256 756 141 108</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent-orange shrink-0" />
                <span>rootsandrisehub@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-soft-cream/60">
          <p>© {new Date().getFullYear()} Root & Rise Kids. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}