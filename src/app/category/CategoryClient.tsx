"use client";
import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryChildrenSection from '@/components/CategoryChildrenSection';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  children?: Array<{
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    products?: Array<{ id: number; featured_image?: string | null }>;
  }>;
}

interface CategoryClientProps {
  category: Category;
  products: any[];
}

export default function CategoryClient({ category, products }: CategoryClientProps) {
  const PRODUCTS_PER_PAGE = 12;
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  const maxPrice = useMemo(() => {
    const parsedPrices = products
      .map((p) => Number.parseFloat(p.price))
      .filter((price) => Number.isFinite(price) && price >= 0);

    return parsedPrices.length ? Math.max(...parsedPrices) : 100000;
  }, [products]);

  // Get unique materials from products
  const materials = useMemo(() => {
    const materialSet = new Set<string>();
    products.forEach(product => {
      if (product.material) materialSet.add(product.material);
    });
    return Array.from(materialSet);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(product =>
        product.material && selectedMaterials.includes(product.material)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [products, searchQuery, priceRange, selectedMaterials, sortBy]);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [searchQuery, priceRange, selectedMaterials, sortBy]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMoreProducts = visibleProducts.length < filteredProducts.length;


  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange([0, maxPrice]);
    setSelectedMaterials([]);
    setSortBy('featured');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || 
    priceRange[0] !== 0 || 
    priceRange[1] !== maxPrice || 
    selectedMaterials.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />
      
      {/* Category Header */}
      <section className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center flex flex-col items-center">
            {category?.image && (
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
                <img 
                  src={category.image} 
                  alt={category?.name || 'Category'} 
                  className="relative w-32 h-32 object-contain rounded-full border-4 border-white/30 shadow-2xl" 
                />
              </div>
            )}
            <h1 className="text-5xl font-bold mb-4 flex items-center gap-3">
              <Sparkles className="h-8 w-8" />
              {category?.name || 'Category'}
            </h1>
            {category?.description && (
              <p className="text-xl text-white/90 max-w-2xl mx-auto">{category.description}</p>
            )}
            <p className="text-white/80 mt-2">{filteredProducts.length} products available</p>
          </div>
        </div>
      </section>

      <CategoryChildrenSection childrenCategories={category?.children || []} />

      {/* Modern Filter & Search Bar */}
      <section className="relative lg:sticky lg:top-24 z-40 bg-white/95 backdrop-blur-xl border-b border-purple-100/50 shadow-lg">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative group">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-white/95 border border-purple-200/50 rounded-full focus:border-purple-500 focus:ring-2 focus:ring-purple-200/50 transition-all shadow-md hover:shadow-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 h-5 w-5 group-focus-within:text-purple-600 transition-colors" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="w-full lg:w-64">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-full border-2 border-purple-100 focus:border-purple-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">⭐ Featured</SelectItem>
                  <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                  <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
                  <SelectItem value="newest">🆕 Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full border-2 border-purple-100 hover:border-purple-500 hover:bg-purple-50"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {selectedMaterials.length + (priceRange[0] !== 0 || priceRange[1] !== maxPrice ? 1 : 0)}
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-4 sm:p-6 bg-white rounded-2xl border-2 border-purple-100 shadow-lg animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* Price Range */}
                <div className="rounded-xl border border-purple-100 p-4 bg-purple-50/30">
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">
                    Price Range
                  </label>
                  <p className="text-sm text-slate-600 mb-3">
                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </p>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={maxPrice}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>₹0</span>
                    <span>₹{maxPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Materials */}
                {materials.length > 0 && (
                  <div className="rounded-xl border border-purple-100 p-4 bg-purple-50/30">
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Material</label>
                    <div className="max-h-40 overflow-y-auto pr-1 space-y-2">
                      {materials.map(material => (
                        <div key={material} className="flex items-center space-x-2">
                          <Checkbox
                            id={material}
                            checked={selectedMaterials.includes(material)}
                            onCheckedChange={() => handleMaterialToggle(material)}
                          />
                          <label htmlFor={material} className="text-sm text-slate-700 cursor-pointer hover:text-purple-600">
                            {material}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      id: product.id,
                      product_id: product.id,
                      name: product.name,
                      price: parseFloat(product.price),
                      featured_image: product.featured_image || product.images?.[0]?.image_url,
                      category: { name: product.category?.name || category.name },
                      quantity: 1,
                      in_stock: product.in_stock,
                      stock: product.stock ?? product.quantity ?? product.available_stock,
                      description: product.description
                    }} 
                  />
                ))}
              </div>
              {hasMoreProducts && (
                <div className="text-center mt-12">
                  <Button 
                    onClick={() => setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE)}
                    size="lg" 
                    className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Load More Products
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-6">
                <Search className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">No products found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your filters or search terms</p>
              <Button
                onClick={resetFilters}
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 