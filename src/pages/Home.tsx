import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Heart, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.slice(0, 4)));
  }, []);

  const ageGroups = [
    { range: '0–1', label: 'Infants', img: 'https://picsum.photos/seed/baby/400/400' },
    { range: '2–4', label: 'Toddlers', img: 'https://picsum.photos/seed/toddler/400/400' },
    { range: '5–7', label: 'Preschool', img: 'https://picsum.photos/seed/preschool/400/400' },
    { range: '8–10', label: 'Big Kids', img: 'https://picsum.photos/seed/bigkids/400/400' },
    { range: '11–14', label: 'Teens', img: 'https://picsum.photos/seed/teens/400/400' },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/kids-hero/1920/1080?blur=2" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-soft-cream via-soft-cream/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-8"
          >
            <div className="space-y-4">
              <span className="inline-block bg-accent-orange/10 text-accent-orange px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase">
                New Collection 2024
              </span>
              <h1 className="text-6xl md:text-7xl font-display font-bold leading-tight">
                Adorable & Affordable finds for your <span className="text-accent-orange italic">little ones</span>
              </h1>
              <p className="text-xl text-zinc-600 leading-relaxed">
                Discover a curated collection of natural, safe, and playful clothing designed for every stage of childhood.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary text-lg px-10 py-4 flex items-center space-x-2">
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/shop?category=Newborn" className="btn-accent text-lg px-10 py-4">
                View Newborns
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: 'Safe & Natural', desc: '100% organic materials' },
            { icon: Truck, title: 'Fast Delivery', desc: 'Free on orders over $50' },
            { icon: Heart, title: 'Family First', desc: 'Designed with love' },
            { icon: Star, title: 'Top Quality', desc: 'Durable for active play' },
          ].map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-sm"
            >
              <div className="w-12 h-12 bg-soft-cream rounded-full flex items-center justify-center text-primary-green">
                <f.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-primary-green">{f.title}</h3>
                <p className="text-xs text-zinc-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Shop by Age */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-display font-bold">Shop by Age</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">Finding the perfect fit is easy with our age-based collections.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {ageGroups.map((age, i) => (
            <Link 
              key={i} 
              to={`/shop?age=${age.range}`}
              className="group space-y-4 text-center"
            >
              <div className="aspect-square rounded-full overflow-hidden border-4 border-white shadow-md group-hover:border-accent-orange transition-all duration-300">
                <img 
                  src={age.img} 
                  alt={age.label} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-bold text-primary-green group-hover:text-accent-orange transition-colors">{age.label}</h3>
                <p className="text-xs text-zinc-500">{age.range} Years</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-4xl font-display font-bold">Featured Favorites</h2>
              <p className="text-zinc-500">Our most-loved pieces for your little ones.</p>
            </div>
            <Link to="/shop" className="text-primary-green font-bold flex items-center space-x-2 hover:text-accent-orange transition-colors">
              <span>View All Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden h-[400px] flex items-center">
          <img 
            src="https://picsum.photos/seed/cta-kids/1200/600" 
            alt="CTA" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary-green/60" />
          <div className="relative z-10 p-12 md:p-24 space-y-8 text-white max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold">Join our community of happy parents</h2>
            <p className="text-lg text-soft-cream/90">Sign up for our newsletter and get 10% off your first order!</p>
            <div className="flex gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-accent-orange"
              />
              <button className="btn-accent px-8">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
