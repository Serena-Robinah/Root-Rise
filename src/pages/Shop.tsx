import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const ageFilter = searchParams.get('age');
  const categoryFilter = searchParams.get('category');
  const genderFilter = searchParams.get('gender');

  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      });
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
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
  };

  const categories = Array.from(new Set(products.map(p => p.category)));
  const ageGroups = ['0–1', '2–4', '5–7', '8–10', '11–14'];
  const genders = ['Boys', 'Girls', 'Unisex'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold">Shop All Collections</h1>
          <p className="text-zinc-500">{filteredProducts.length} products found</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center space-x-2 btn-primary px-4 py-2"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`md:w-64 space-y-8 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-primary-green">Filters</h3>
              <button 
                onClick={clearFilters}
                className="text-xs text-accent-orange font-bold hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Gender</h4>
              <div className="flex flex-wrap gap-2">
                {genders.map(g => (
                  <button 
                    key={g}
                    onClick={() => updateFilter('gender', genderFilter === g ? null : g)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      genderFilter === g 
                        ? 'bg-primary-green text-white' 
                        : 'bg-soft-cream text-primary-green hover:bg-primary-green/10'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Group */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Age Group</h4>
              <div className="space-y-2">
                {ageGroups.map(age => (
                  <label key={age} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={ageFilter === age}
                      onChange={() => updateFilter('age', ageFilter === age ? null : age)}
                      className="w-5 h-5 rounded border-zinc-300 text-primary-green focus:ring-primary-green"
                    />
                    <span className={`text-sm font-medium ${ageFilter === age ? 'text-primary-green font-bold' : 'text-zinc-600 group-hover:text-primary-green'}`}>
                      {age} Years
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Category</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={categoryFilter === cat}
                      onChange={() => updateFilter('category', categoryFilter === cat ? null : cat)}
                      className="w-5 h-5 rounded border-zinc-300 text-primary-green focus:ring-primary-green"
                    />
                    <span className={`text-sm font-medium ${categoryFilter === cat ? 'text-primary-green font-bold' : 'text-zinc-600 group-hover:text-primary-green'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-soft-cream rounded-full flex items-center justify-center mx-auto text-primary-green">
                <Search className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-display font-bold">No products found</h2>
              <p className="text-zinc-500">Try adjusting your filters or search query to find what you're looking for.</p>
              <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
