import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services';
import { AGE_GROUPS, GENDERS } from '@shared/constants';
import type { Product } from '@shared/types';
import { motion, AnimatePresence } from 'motion/react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openSection, setOpenSection] = React.useState<string | null>('gender');

  const ageFilter = searchParams.get('age');
  const categoryFilter = searchParams.get('category');
  const genderFilter = searchParams.get('gender');

  React.useEffect(() => {
    productService.getAll()
      .then(data => { setProducts(data); setFilteredProducts(data); })
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  React.useEffect(() => {
    let result = products;
    if (ageFilter) result = result.filter(p => p.age_group === ageFilter);
    if (categoryFilter) result = result.filter(p => p.category === categoryFilter);
    if (genderFilter) result = result.filter(p => p.gender === genderFilter);
    if (searchQuery) result = result.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(result);
  }, [products, ageFilter, categoryFilter, genderFilter, searchQuery]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) { newParams.set(key, value); } else { newParams.delete(key); }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
    setIsFilterOpen(false);
  };

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const hasActiveFilters = ageFilter || categoryFilter || genderFilter || searchQuery;
  const activeFilterCount = [ageFilter, categoryFilter, genderFilter, searchQuery].filter(Boolean).length;

  const FilterSection = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => (
    <div className="border-b border-zinc-100 last:border-0">
      <button
        onClick={() => setOpenSection(openSection === id ? null : id)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-50 transition-colors"
      >
        <span className="text-xs font-black text-zinc-700 uppercase tracking-widest">{title}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${openSection === id ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {openSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>

      {/* ── TOP BAR ── */}
      <div className="sticky top-0 z-40 border-b border-zinc-200/50 backdrop-blur-xl" style={{ backgroundColor: 'rgba(250,247,242,0.92)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">

            {/* Search — takes most of the space */}
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-zinc-200 focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/10 text-sm text-zinc-800 placeholder-zinc-400 transition-all shadow-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-zinc-200 hover:bg-zinc-300 rounded-full flex items-center justify-center transition-colors">
                  <X className="w-3 h-3 text-zinc-600" />
                </button>
              )}
            </div>

            {/* Filter toggle — mobile only */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden relative flex-shrink-0 flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent-orange rounded-full text-[10px] font-black flex items-center justify-center shadow">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Result count */}
            <p className="hidden md:block flex-shrink-0 text-xs text-zinc-400 font-medium whitespace-nowrap">
              <span className="text-zinc-800 font-black">{filteredProducts.length}</span> items
            </p>
          </div>

          {/* Active filter pills */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap gap-1.5 mt-2 overflow-hidden"
              >
                {ageFilter && (
                  <span className="inline-flex items-center gap-1 bg-primary-green text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {ageFilter} yrs <button onClick={() => updateFilter('age', null)}><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {categoryFilter && (
                  <span className="inline-flex items-center gap-1 bg-primary-green text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {categoryFilter} <button onClick={() => updateFilter('category', null)}><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {genderFilter && (
                  <span className="inline-flex items-center gap-1 bg-primary-green text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {genderFilter} <button onClick={() => updateFilter('gender', null)}><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-accent-orange text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    "{searchQuery}" <button onClick={() => setSearchQuery('')}><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-[11px] font-bold text-zinc-400 hover:text-red-400 transition-colors px-1">
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile backdrop */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsFilterOpen(false)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          {/* ── SIDEBAR ── */}
          <aside className={`md:col-span-1 ${isFilterOpen ? 'block' : 'hidden md:block'} fixed md:static inset-y-0 left-0 w-4/5 max-w-xs md:w-auto bg-white md:bg-transparent z-50 md:z-auto overflow-y-auto shadow-2xl md:shadow-none`}>
            <div className="md:sticky md:top-24 space-y-3">

              {/* Mobile header */}
              <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-100">
                <h3 className="font-black text-zinc-900">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter card */}
              <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">

                {/* Card header */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-white/60" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Filter</span>
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 bg-accent-orange rounded-full text-[10px] font-black text-white flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-[10px] font-black text-accent-orange hover:text-accent-orange/70 transition-colors">
                      Reset
                    </button>
                  )}
                </div>

                {/* Gender */}
                <FilterSection title="Gender" id="gender">
                  <div className="flex flex-wrap gap-1.5">
                    {GENDERS.map(g => (
                      <button
                        key={g}
                        onClick={() => updateFilter('gender', genderFilter === g ? null : g)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          genderFilter === g
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* Age */}
                <FilterSection title="Age Group" id="age">
                  <div className="grid grid-cols-2 gap-1.5">
                    {AGE_GROUPS.map(age => (
                      <button
                        key={age}
                        onClick={() => updateFilter('age', ageFilter === age ? null : age)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-left ${
                          ageFilter === age
                            ? 'bg-primary-green text-white border-primary-green'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:border-primary-green hover:text-primary-green'
                        }`}
                      >
                        {age} yrs
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* Category */}
                {categories.length > 0 && (
                  <FilterSection title="Category" id="category">
                    <div className="space-y-1">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => updateFilter('category', categoryFilter === cat ? null : cat)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            categoryFilter === cat
                              ? 'bg-accent-orange/10 text-accent-orange'
                              : 'hover:bg-zinc-50 text-zinc-600'
                          }`}
                        >
                          {cat}
                          {categoryFilter === cat && <span className="w-2 h-2 bg-accent-orange rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                )}
              </div>

              {/* Mobile apply */}
              <button onClick={() => setIsFilterOpen(false)} className="md:hidden w-full bg-zinc-900 text-white py-3 rounded-2xl font-black text-sm">
                Show {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </button>
            </div>
          </aside>

          {/* ── PRODUCT GRID ── */}
          <div className="md:col-span-3">
            {/* Desktop count */}
            <div className="hidden md:flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-500">
                Showing <span className="font-black text-zinc-800">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                {hasActiveFilters && <span className="text-accent-orange font-bold"> (filtered)</span>}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
              >
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-zinc-100 p-12 text-center space-y-4"
              >
                <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-zinc-300" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-zinc-800">Nothing found</h2>
                  <p className="text-zinc-400 text-sm mt-1">Try adjusting your filters or search.</p>
                </div>
                <button onClick={clearFilters} className="bg-zinc-900 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-zinc-800 transition-colors">
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}