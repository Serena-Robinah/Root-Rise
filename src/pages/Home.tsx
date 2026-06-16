import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Heart, Truck, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const testimonials = [
  {
    name: 'Amara N.',
    location: 'Kampala',
    text: 'My daughter absolutely loves her outfits from Root & Rise! The quality is amazing and delivery was so fast.',
    rating: 5,
    color: 'bg-primary-green',
  },
  {
    name: 'Grace M.',
    location: 'Entebbe',
    text: 'Finally found a place with affordable, good-quality kids clothing. The fabric feels so soft on my baby.',
    rating: 5,
    color: 'bg-accent-orange',
  },
  {
    name: 'David K.',
    location: 'Jinja',
    text: 'Ordered for my twins and both pieces arrived in perfect condition. Super helpful team!',
    rating: 5,
    color: 'bg-primary-green',
  },
];

// Skeleton loader
function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white animate-pulse">
      <div className="aspect-[4/5] bg-zinc-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-zinc-200 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 rounded w-1/2" />
        <div className="h-8 bg-zinc-200 rounded mt-3" />
      </div>
    </div>
  );
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => { setFeaturedProducts(data.slice(0, 4)); setProductsLoading(false); })
      .catch(() => setProductsLoading(false));
  }, []);

  const ageGroups = [
    { range: '0–1', label: 'Infants', img: '/root-pics/root-pics/infant dress.jpeg' },
    { range: '2–4', label: 'Toddlers', img: '/root-pics/root-pics/toddler dress.jpeg' },
    { range: '5–7', label: 'Preschool', img: '/root-pics/root-pics/preschool jean.jpeg' },
    { range: '8–10', label: 'Big Kids', img: '/root-pics/root-pics/big kids.jpeg' },
    { range: '11–14', label: 'Teens', img: '/root-pics/root-pics/teen bags.jpeg' },
  ];

  return (
    <div className="space-y-16 pb-16">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1920&h=1080&auto=format&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover scale-105"
            fetchPriority="high"
            referrerPolicy="no-referrer"
          />
          {/* Strong gradient — readable on all screens */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a2e1a]/90 via-[#0a2e1a]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-2xl space-y-8"
          >
            {/* Pill badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-accent-orange text-white px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-lg"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              New Collection 2024
            </motion.span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[1.05] text-white drop-shadow-lg">
              Adorable &<br />
              Affordable finds<br />
              for your{' '}
              <span className="text-accent-orange italic">little ones</span>
            </h1>

            <p className="text-lg text-white/80 leading-relaxed max-w-lg">
              Natural, safe, and playful clothing designed for every stage of childhood — delivered fast to your door.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 bg-accent-orange text-white font-black px-8 py-4 rounded-2xl text-base shadow-xl hover:shadow-accent-orange/40 hover:scale-105 transition-all duration-300"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop?age=0–1"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-white/25 transition-all duration-300"
              >
                View Newborns
              </Link>
            </div>

            {/* Social proof mini bar */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {['bg-accent-orange', 'bg-primary-green', 'bg-yellow-400', 'bg-pink-400'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                    {['A','G','D','S'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-white/70 text-xs">Loved by 200+ parents in Uganda</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#FAF7F2"/>
          </svg>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: ShieldCheck, title: 'Safe & Natural', desc: '100% organic materials', bg: 'bg-emerald-50', color: 'text-emerald-600', ring: 'bg-emerald-100' },
            { icon: Truck, title: 'Fast Delivery', desc: 'Quick to your door', bg: 'bg-orange-50', color: 'text-orange-500', ring: 'bg-orange-100' },
            { icon: Heart, title: 'Family First', desc: 'Designed with love', bg: 'bg-pink-50', color: 'text-pink-500', ring: 'bg-pink-100' },
            { icon: Star, title: 'Top Quality', desc: 'Durable for active play', bg: 'bg-yellow-50', color: 'text-yellow-500', ring: 'bg-yellow-100' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`${f.bg} rounded-2xl p-5 flex flex-col items-start gap-3 border border-white shadow-sm`}
            >
              <div className={`w-11 h-11 ${f.ring} rounded-xl flex items-center justify-center ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-zinc-800">{f.title}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY AGE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-accent-orange text-xs font-black uppercase tracking-widest">Collections</p>
            <h2 className="text-3xl font-display font-black">Shop by Age</h2>
          </div>
          <Link to="/shop" className="text-sm font-bold text-primary-green hover:text-accent-orange flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {ageGroups.map((age, i) => (
            <Link
              key={i}
              to={`/shop?age=${encodeURIComponent(age.range)}`}
              className="group relative overflow-hidden rounded-2xl aspect-square shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={age.img}
                alt={age.label}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Text at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="font-black text-sm leading-tight">{age.label}</p>
                <p className="text-white/70 text-[10px]">{age.range} yrs</p>
              </div>
              {/* Orange accent on hover */}
              <div className="absolute top-3 right-3 w-7 h-7 bg-accent-orange rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="space-y-1">
              <p className="text-accent-orange text-xs font-black uppercase tracking-widest">Trending Now</p>
              <h2 className="text-3xl font-display font-black">Featured Favorites</h2>
            </div>
            <Link to="/shop" className="text-sm font-bold text-primary-green hover:text-accent-orange flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {productsLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : featuredProducts.length > 0
              ? featuredProducts.map(product => <ProductCard key={product.id} product={product} />)
              : (
                <div className="col-span-full text-center py-16 space-y-3">
                  <p className="text-4xl">👕</p>
                  <p className="text-zinc-500 font-medium">No products yet — check back soon!</p>
                </div>
              )
            }
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-accent-orange text-xs font-black uppercase tracking-widest">Reviews</p>
          <h2 className="text-3xl font-display font-black">Happy Parents, Happy Kids</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 overflow-hidden"
            >
              {/* Big decorative quote */}
              <div className={`absolute -top-2 -right-2 w-16 h-16 ${t.color} rounded-full opacity-10`} />
              <Quote className={`w-8 h-8 mb-3 ${i % 2 === 0 ? 'text-primary-green' : 'text-accent-orange'} opacity-30`} />
              <p className="text-zinc-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex text-accent-orange mb-2">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="font-black text-sm text-primary-green">{t.name}</p>
              <p className="text-xs text-zinc-400">{t.location}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1200&h=600&auto=format&fit=crop"
            alt="CTA"
            className="w-full h-[320px] object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {/* Much darker overlay */}
          <div className="absolute inset-0 bg-primary-green/80" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 space-y-5">
            <p className="text-accent-orange text-xs font-black uppercase tracking-widest">Stay in the loop</p>
            <h2 className="text-3xl md:text-4xl font-display font-black max-w-lg leading-tight">
              Join our community of happy parents
            </h2>
            <p className="text-white/80 text-sm max-w-sm">
              Be the first to hear about new arrivals and special offers!
            </p>
            {subscribed ? (
              <p className="text-accent-orange font-black text-lg">🎉 Thank you for subscribing!</p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-grow px-5 py-3 rounded-xl bg-white/15 border border-white/25 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-orange text-sm"
                />
                <button
                  onClick={() => email && setSubscribed(true)}
                  className="bg-accent-orange text-white font-black px-6 py-3 rounded-xl hover:bg-accent-orange/90 transition-colors shrink-0 text-sm"
                >
                  Subscribe
                </button>
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}