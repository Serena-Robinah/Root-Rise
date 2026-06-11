import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Heart, Truck, Quote, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services';
import type { Product } from '@shared/types';
import { useAuthStore } from '@/store/authStore';

// Skeleton card for loading state
function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white animate-pulse">
      <div className="aspect-square bg-zinc-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-zinc-200 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 rounded w-1/2" />
        <div className="h-8 bg-zinc-200 rounded mt-3" />
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: 'Amara N.',
    location: 'Kampala',
    text: 'My daughter absolutely loves her outfits from Root & Rise! The quality is amazing and delivery was so fast. Will definitely be ordering again.',
    rating: 5,
  },
  {
    name: 'Grace M.',
    location: 'Entebbe',
    text: 'Finally found a place with affordable, good-quality kids clothing. The sizes are true to age and the fabric feels so soft on my baby.',
    rating: 5,
  },
  {
    name: 'David K.',
    location: 'Jinja',
    text: 'Ordered for my twins and both pieces arrived in perfect condition. The team was super helpful when I had a question about sizing.',
    rating: 5,
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const { user } = useAuthStore();
  const searchParams = new URLSearchParams(window.location.search);
  const justVerified = searchParams.get('verified') === 'true';

  // Encode en-dash for safe URL usage
  const AGE_NEWBORN = encodeURIComponent('0–1');

  React.useEffect(() => {
    setProductsLoading(true);
    productService.getAll()
      .then(data => setFeaturedProducts(data.slice(0, 4)))
      .catch(err => console.error('Failed to fetch products:', err))
      .finally(() => setProductsLoading(false));
  }, []);

  const ageGroups = [
    { range: '0–1', label: 'Infants', img: '/root-pics/infant dress.jpeg' },
    { range: '2–4', label: 'Toddlers', img: '/root-pics/toddler dress.jpeg' },
    { range: '5–7', label: 'Preschool', img: '/root-pics/preschool jean.jpeg' },
    { range: '8–10', label: 'Big Kids', img: '/root-pics/big kids.jpeg' },
    { range: '11–14', label: 'Teens', img: '/root-pics/teen bags.jpeg' },
  ];

  return (
    <div className="space-y-12 pb-12">
      {justVerified && (
        <div className="bg-emerald-50 text-emerald-700 text-center py-3 font-bold">
          ✅ Your email has been verified! You can now shop freely.
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1920&h=1080&auto=format&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover"
            fetchPriority="high"
            referrerPolicy="no-referrer"
          />
          {/* Slightly stronger overlay on mobile for readability */}
          <div className="absolute inset-0 bg-soft-cream/90 sm:bg-gradient-to-r sm:from-soft-cream sm:via-soft-cream/80 sm:to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-5"
          >
            <div className="space-y-3">
              <span className="inline-block bg-accent-orange/10 text-accent-orange px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase">
                New Collection 2024
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Adorable & Affordable finds for your <span className="text-accent-orange italic">little ones</span>
              </h1>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Discover a curated collection of natural, safe, and playful clothing designed for every stage of childhood.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary text-base px-8 py-3 flex items-center space-x-2">
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={`/shop?age=${AGE_NEWBORN}`} className="btn-accent text-base px-8 py-3">
                View Newborns
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: ShieldCheck, title: 'Safe & Natural', desc: '100% organic materials' },
            { icon: Truck, title: 'Fast Delivery', desc: 'Quick delivery to your door' },
            { icon: Heart, title: 'Family First', desc: 'Designed with love' },
            { icon: Star, title: 'Top Quality', desc: 'Durable for active play' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 p-4 bg-white rounded-2xl shadow-sm"
            >
              <div className="w-10 h-10 bg-soft-cream rounded-full flex items-center justify-center text-primary-green shrink-0">
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-primary-green text-sm">{f.title}</h3>
                <p className="text-xs text-zinc-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Shop by Age */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-bold">Shop by Age</h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm">Finding the perfect fit is easy with our age-based collections.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {ageGroups.map((age, i) => (
            <Link
              key={i}
              to={`/shop?age=${encodeURIComponent(age.range)}`}
              className="group space-y-2 text-center"
            >
              <div className="aspect-square rounded-full overflow-hidden border-4 border-white shadow-md group-hover:border-accent-orange transition-all duration-300">
                <img
                  src={age.img}
                  alt={age.label}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-bold text-primary-green group-hover:text-accent-orange transition-colors text-sm">{age.label}</h3>
                <p className="text-xs text-zinc-500">{age.range} Years</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap justify-between items-end gap-3">
            <div className="space-y-1">
              <h2 className="text-3xl font-display font-bold">Featured Favorites</h2>
              <p className="text-zinc-500 text-sm">Our most-loved pieces for your little ones.</p>
            </div>
            <Link to="/shop" className="text-primary-green font-bold flex items-center space-x-2 hover:text-accent-orange transition-colors text-sm">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {productsLoading ? (
              // Skeleton placeholders while loading
              Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-16 space-y-3">
                <p className="text-4xl">👕</p>
                <p className="text-zinc-500 font-medium">No products yet — check back soon!</p>
                <Link to="/shop" className="text-primary-green font-bold hover:text-accent-orange transition-colors text-sm">
                  Browse the full shop
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-bold">Happy Parents, Happy Kids</h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm">Don't just take our word for it.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-sm space-y-4 flex flex-col"
            >
              <Quote className="w-6 h-6 text-accent-orange/40" />
              <p className="text-zinc-600 text-sm leading-relaxed flex-grow">"{t.text}"</p>
              <div className="space-y-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent-orange text-accent-orange" />
                  ))}
                </div>
                <p className="font-bold text-primary-green text-sm">{t.name}</p>
                <p className="text-xs text-zinc-400">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden h-[280px] flex items-center">
          <img
            src="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1200&h=600&auto=format&fit=crop"
            alt="CTA"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary-green/60" />
          <div className="relative z-10 p-6 sm:p-10 md:p-14 space-y-4 text-white max-w-2xl">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold">Join our community of happy parents</h2>
            <p className="text-soft-cream/90">Sign up and be the first to hear about new arrivals and offers!</p>
            {subscribed ? (
              <p className="text-accent-orange font-bold">🎉 Thank you for subscribing!</p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-accent-orange"
                />
                <button onClick={() => email && setSubscribed(true)} className="btn-accent px-7 shrink-0">Subscribe</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/256756141108?text=Hi%20Root%20%26%20Rise%20Kids!%20I%27d%20like%20to%20ask%20about%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}