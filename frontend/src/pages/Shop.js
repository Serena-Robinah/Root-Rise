import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services';
import { AGE_GROUPS, GENDERS } from '@shared/constants';
export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = React.useState([]);
    const [filteredProducts, setFilteredProducts] = React.useState([]);
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const ageFilter = searchParams.get('age');
    const categoryFilter = searchParams.get('category');
    const genderFilter = searchParams.get('gender');
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
            result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        setFilteredProducts(result);
    }, [products, ageFilter, categoryFilter, genderFilter, searchQuery]);
    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        }
        else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };
    const clearFilters = () => {
        setSearchParams(new URLSearchParams());
        setSearchQuery('');
    };
    const categories = Array.from(new Set(products.map(p => p.category)));
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-display font-bold", children: "Shop All Collections" }), _jsxs("p", { className: "text-zinc-500", children: [filteredProducts.length, " products found"] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative flex-grow md:w-64", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" }), _jsx("input", { type: "text", placeholder: "Search products...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20" })] }), _jsxs("button", { onClick: () => setIsFilterOpen(!isFilterOpen), className: "md:hidden flex items-center space-x-2 btn-primary px-4 py-2", children: [_jsx(Filter, { className: "w-5 h-5" }), _jsx("span", { children: "Filters" })] })] })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [_jsx("aside", { className: `md:w-64 space-y-8 ${isFilterOpen ? 'block' : 'hidden md:block'}`, children: _jsxs("div", { className: "bg-white p-6 rounded-2xl shadow-sm space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-bold text-primary-green", children: "Filters" }), _jsx("button", { onClick: clearFilters, className: "text-xs text-accent-orange font-bold hover:underline", children: "Clear All" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-bold text-zinc-400 uppercase tracking-wider", children: "Gender" }), _jsx("div", { className: "flex flex-wrap gap-2", children: GENDERS.map(g => (_jsx("button", { onClick: () => updateFilter('gender', genderFilter === g ? null : g), className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${genderFilter === g
                                                    ? 'bg-primary-green text-white'
                                                    : 'bg-soft-cream text-primary-green hover:bg-primary-green/10'}`, children: g }, g))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-bold text-zinc-400 uppercase tracking-wider", children: "Age Group" }), _jsx("div", { className: "space-y-2", children: AGE_GROUPS.map(age => (_jsxs("label", { className: "flex items-center space-x-3 cursor-pointer group", children: [_jsx("input", { type: "checkbox", checked: ageFilter === age, onChange: () => updateFilter('age', ageFilter === age ? null : age), className: "w-5 h-5 rounded border-zinc-300 text-primary-green focus:ring-primary-green" }), _jsxs("span", { className: `text-sm font-medium ${ageFilter === age ? 'text-primary-green font-bold' : 'text-zinc-600 group-hover:text-primary-green'}`, children: [age, " Years"] })] }, age))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-bold text-zinc-400 uppercase tracking-wider", children: "Category" }), _jsx("div", { className: "space-y-2", children: categories.map(cat => (_jsxs("label", { className: "flex items-center space-x-3 cursor-pointer group", children: [_jsx("input", { type: "checkbox", checked: categoryFilter === cat, onChange: () => updateFilter('category', categoryFilter === cat ? null : cat), className: "w-5 h-5 rounded border-zinc-300 text-primary-green focus:ring-primary-green" }), _jsx("span", { className: `text-sm font-medium ${categoryFilter === cat ? 'text-primary-green font-bold' : 'text-zinc-600 group-hover:text-primary-green'}`, children: cat })] }, cat))) })] })] }) }), _jsx("div", { className: "flex-grow", children: filteredProducts.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8", children: filteredProducts.map(product => (_jsx(ProductCard, { product: product }, product.id))) })) : (_jsxs("div", { className: "bg-white rounded-3xl p-20 text-center space-y-4", children: [_jsx("div", { className: "w-20 h-20 bg-soft-cream rounded-full flex items-center justify-center mx-auto text-primary-green", children: _jsx(Search, { className: "w-10 h-10" }) }), _jsx("h2", { className: "text-2xl font-display font-bold", children: "No products found" }), _jsx("p", { className: "text-zinc-500", children: "Try adjusting your filters or search query to find what you're looking for." }), _jsx("button", { onClick: clearFilters, className: "btn-primary", children: "Clear All Filters" })] })) })] })] }));
}
//# sourceMappingURL=Shop.js.map