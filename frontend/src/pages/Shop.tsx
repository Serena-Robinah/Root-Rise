import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services';
import { AGE_GROUPS, GENDERS } from '@shared/constants';
import type { Product } from '@shared/types';
import { motion } from 'motion/react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState({
    age: null as string | null,
    category: null as string | null,
    gender: null as string | null,
  });

  const ageFilter = searchParams.get('age');
  const categoryFilter = searchParams.get('category');
  const genderFilter = searchParams.get('gender');

  React.useEffect(() => {
    setActiveFilters({
      age: ageFilter,
      category: categoryFilter,
      gender: genderFilter,
    });
  }, [ageFilter, categoryFilter, genderFilter]);

  React.useEffect(() => {
    productService.getAll()
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  React.useEffect(() => {
    let result = products;

    if (ageFilter) {
      result = result.filter(p => p.age_group === ageFilter);
    }
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (genderFilter) {
      result = result.filter(p => p.gender === genderFilter);
    }
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, ageFilter, categoryFilter, genderFilter, searchQuery]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
    setIsFilterOpen(false);
  };

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const hasActiveFilters = ageFilter || categoryFilter || genderFilter || searchQuery;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-display font-bold text-zinc-900">
                  Shop All Collections
                </h1>
                <p className="text-sm md:text-base text-zinc-500 mt-1">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden flex items-center space-x-2 btn-primary px-4 py-2.5 rounded-lg w-full md:w-auto justify-center"
              >
                <Filter className="w-5 h-5" />
                <span className="font-semibold">Filters</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green text-sm md:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`md:col-span-1 ${
              isFilterOpen ? 'block' : 'hidden md:block'
            } fixed md:static inset-0 bg-white md:bg-transparent z-50 md:z-auto overflow-y-auto`}
          >
            <div className="p-4 md:p-0 space-y-6">
              {/* Close button for mobile */}
              <div className="md:hidden flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-zinc-900">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 hover:bg-zinc-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Filter Header */}
              <div className="hidden md:flex items-center justify-between pb-4 border-b border-zinc-200">
                <h3 className="font-bold text-zinc-900">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold text-accent-orange hover:text-accent-orange/80 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Gender Filter */}
              <div className="space-y-3 pb-4 border-b border-zinc-100">
                <h4 className="text-sm font-bold text-zinc-900">Gender</h4>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map(g => (
                    <button
                      key={g}
                      onClick={() => updateFilter('gender', genderFilter === g ? null : g)}
                      className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                        genderFilter === g
                          ? 'bg-primary-green text-white shadow-md'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group Filter */}
              <div className="space-y-3 pb-4 border-b border-zinc-100">
                <h4 className="text-sm font-bold text-zinc-900">Age Group</h4>
                <div className="space-y-2">
                  {AGE_GROUPS.map(age => (
                    <label
                      key={age}
                      className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={ageFilter === age}
                        onChange={() => updateFilter('age', ageFilter === age ? null : age)}
                        className="w-5 h-5 rounded border-zinc-300 text-primary-green focus:ring-primary-green cursor-pointer accent-primary-green"
                      />
                      <span className={`text-sm font-medium ${ageFilter === age ? 'text-primary-green font-semibold' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                        {age} Years
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="space-y-3 pb-4">
                  <h4 className="text-sm font-bold text-zinc-900">Category</h4>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label
                        key={cat}
                        className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-zinc-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={categoryFilter === cat}
                          onChange={() => updateFilter('category', categoryFilter === cat ? null : cat)}
                          className="w-5 h-5 rounded border-zinc-300 text-primary-green focus:ring-primary-green cursor-pointer accent-primary-green"
                        />
                        <span className={`text-sm font-medium ${categoryFilter === cat ? 'text-primary-green font-semibold' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Apply Button */}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="md:hidden w-full btn-primary py-3 rounded-lg font-semibold mt-6"
              >
                Show {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </button>
            </div>

            {/* Mobile Overlay */}
            {isFilterOpen && (
              <div
                className="md:hidden fixed inset-0 bg-black/30 -z-10"
                onClick={() => setIsFilterOpen(false)}
              />
            )}
          </aside>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              >
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-soft-cream/50 rounded-2xl p-8 md:p-12 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Search className="w-8 h-8 text-zinc-300" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-display font-bold text-zinc-900">
                    No products found
                  </h2>
                  <p className="text-zinc-500 text-sm md:text-base">
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                </div>
                <button
                  onClick={clearFilters}
                  className="btn-primary px-6 py-2.5 rounded-lg font-semibold inline-block mt-4"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
