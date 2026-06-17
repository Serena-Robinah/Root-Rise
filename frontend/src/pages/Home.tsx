import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Heart, Truck, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services';
import type { Product } from '@shared/types';
import { useAuthStore } from '@/store/authStore';

function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white animate-pulse">
      <div className="aspect-[4/5] bg-zinc-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-zinc-200 rounded w-3/4" />
        <div className="h-3 bg-zinc-200 rounded w-1/2" />
      </div>
    </div>
  );
}

const testimonials = [
  { name: 'Amara N.', location: 'Kampala', text: 'My daughter absolutely loves her outfits from Root & Rise! The quality is amazing and delivery was so fast.', rating: 5 },
  { name: 'Grace M.', location: 'Entebbe', text: 'Finally found a place with affordable, good-quality kids clothing. The fabric feels so soft on my baby.', rating: 5 },
  { name: 'David K.', location: 'Jinja', text: 'Ordered for my twins and both pieces arrived in perfect condition. Super helpful team!', rating: 5 },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const { user } = useAuthStore();
  const searchParams = new URLSearchParams(window.location.search);
  const justVerified = searchParams.get('verified') === 'true';
  {/* ── TICKER ── */}
<div className="bg-primary-green text-white text-xs font-black overflow-hidden py-2">
  <div className="flex animate-marquee whitespace-nowrap">
    {[...Array(3)].map((_, i) => (
      <span key={i} className="flex items-center gap-6 px-6">
        <span>🚚 Free Delivery in Kampala</span>
        <span>·</span>
        <span>✨ New Arrivals Every Week</span>
        <span>·</span>
        <span>👶 Uganda's #1 Kids Store</span>
        <span>·</span>
        <span>🌿 100% Safe & Natural</span>
        <span>·</span>
        <span>💛 Sizes XS – XL Available</span>
        <span>·</span>
      </span>
    ))}
  </div>
</div>
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
    <div className="space-y-10 pb-10">
      {justVerified && (
        <div className="bg-emerald-50 text-emerald-700 text-center py-3 font-bold text-sm">
          ✅ Your email has been verified! You can now shop freely.
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative min-h-[45vh] md:min-h-[80vh] flex items-start overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1920&h=1080&auto=format&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover"
            fetchPriority="high"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-soft-cream/85 md:bg-gradient-to-r md:from-soft-cream md:via-soft-cream/80 md:to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 pb-8 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl space-y-4"
          >
            <span className="inline-block bg-accent-orange/10 text-accent-orange px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              New Collection 2024
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Adorable & Affordable finds for your <span className="text-accent-orange italic">little ones</span>
            </h1>
            <p className="text-sm md:text-lg text-zinc-600 leading-relaxed max-w-lg">
              Natural, safe, and playful clothing for every stage of childhood.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/shop" className="btn-primary text-sm md:text-base px-6 py-2.5 md:px-8 md:py-3 flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={`/shop?age=${AGE_NEWBORN}`} className="btn-accent text-sm md:text-base px-6 py-2.5 md:px-8 md:py-3">
                View Newborns
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: ShieldCheck, title: 'Safe & Natural', desc: '100% organic', bg: 'bg-emerald-50', color: 'text-emerald-600', ring: 'bg-emerald-100' },
            { icon: Truck, title: 'Fast Delivery', desc: 'To your door', bg: 'bg-orange-50', color: 'text-orange-500', ring: 'bg-orange-100' },
            { icon: Heart, title: 'Family First', desc: 'Made with love', bg: 'bg-pink-50', color: 'text-pink-500', ring: 'bg-pink-100' },
            { icon: Star, title: 'Top Quality', desc: 'Built to last', bg: 'bg-yellow-50', color: 'text-yellow-500', ring: 'bg-yellow-100' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`${f.bg} rounded-2xl p-3 md:p-4 flex items-center gap-3`}
            >
              <div className={`w-9 h-9 ${f.ring} rounded-xl flex items-center justify-center ${f.color} shrink-0`}>
                <f.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-xs text-zinc-800">{f.title}</h3>
                <p className="text-[10px] text-zinc-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY AGE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-accent-orange text-xs font-black uppercase tracking-widest">Collections</p>
            <h2 className="text-2xl md:text-3xl font-display font-black">Shop by Age</h2>
          </div>
          <Link to="/shop" className="text-xs font-bold text-primary-green hover:text-accent-orange flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
          {ageGroups.map((age, i) => (
            <Link
              key={i}
              to={`/shop?age=${encodeURIComponent(age.range)}`}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              style={{ aspectRatio: '3/4' }}
            >
              <img
                src={age.img}
                alt={age.label}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="font-black text-white text-xs leading-tight">{age.label}</p>
                <p className="text-white/60 text-[9px]">{age.range} yrs</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-accent-orange text-xs font-black uppercase tracking-widest">Trending</p>
              <h2 className="text-2xl md:text-3xl font-display font-black">Featured Favorites</h2>
            </div>
            <Link to="/shop" className="text-xs font-bold text-primary-green hover:text-accent-orange flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {productsLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : featuredProducts.length > 0
              ? featuredProducts.map(product => <ProductCard key={product.id} product={product} />)
              : (
                <div className="col-span-full text-center py-12 space-y-2">
                  <p className="text-3xl">👕</p>
                  <p className="text-zinc-400 text-sm">No products yet — check back soon!</p>
                </div>
              )
            }
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="text-center space-y-1">
          <p className="text-accent-orange text-xs font-black uppercase tracking-widest">Reviews</p>
          <h2 className="text-2xl md:text-3xl font-display font-black">Happy Parents, Happy Kids</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 space-y-3"
            >
              <Quote className="w-6 h-6 text-accent-orange/30" />
              <p className="text-zinc-600 text-sm leading-relaxed">"{t.text}"</p>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-accent-orange text-accent-orange" />
                  ))}
                </div>
                <p className="font-black text-xs text-primary-green">{t.name}</p>
                <p className="text-[10px] text-zinc-400">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1200&h=600&auto=format&fit=crop"
            alt="CTA"
            className="w-full h-[220px] md:h-[280px] object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary-green/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 space-y-3">
            <p className="text-accent-orange text-xs font-black uppercase tracking-widest">Stay in the loop</p>
            <h2 className="text-xl md:text-3xl font-display font-black max-w-sm leading-tight">
              Join our community of happy parents
            </h2>
            {subscribed ? (
              <p className="text-accent-orange font-black">🎉 Thank you for subscribing!</p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-grow px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-orange text-sm"
                />
                <button
                  onClick={() => email && setSubscribed(true)}
                  className="bg-accent-orange text-white font-black px-5 py-2.5 rounded-xl hover:bg-accent-orange/90 transition-colors text-sm shrink-0"
                >
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp */}
      <a
        href="https://wa.me/256756141108?text=Hi%20Root%20%26%20Rise%20Kids!%20I%27d%20like%20to%20ask%20about%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 md:w-7 md:h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}