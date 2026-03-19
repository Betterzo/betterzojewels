'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, ShoppingBag, Menu, X, LogOut, Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { getCategories } from '@/lib/api';
import { toast } from 'sonner';

const Header = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { getItemCount, isLoading } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-purple-100/50 shadow-md">
      <div className="container mx-auto px-4 lg:px-6">

        {/* Top Bar */}
        <div className="flex items-center justify-between h-24">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {/* <Sparkles className="h-7 w-7 text-purple-600" />
            Jewtone */}
            <img
              src="/logo-1.png"
              alt="Jewtone Logo"
              className="h-24 w-64 object-contain bg-transparent"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-slate-700 hover:text-purple-600 transition-all font-semibold px-4 py-2.5 rounded-xl hover:bg-purple-50/80 relative group"
              >
                {category.name}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative group">
                <Input
                  type="search"
                  placeholder="Search jewelry, gems, rings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-12 pr-4 py-3 bg-white/95 backdrop-blur-sm border border-purple-200/50 rounded-full focus:border-purple-500 focus:ring-2 focus:ring-purple-200/50 transition-all shadow-md hover:shadow-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 h-5 w-5 group-focus-within:text-purple-600 transition-colors" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full hover:bg-purple-100 text-slate-700 hover:text-purple-600 transition-all"
                  >
                    <User className="h-5 w-5"  />
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="rounded-full hover:bg-red-100 text-slate-700 hover:text-red-600 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full hover:bg-purple-100 text-slate-700 hover:text-purple-600 transition-all"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cartpage" className="relative">
              <Button
                size="sm"
                disabled={isLoading}
                variant="ghost"
                className="rounded-full hover:bg-purple-100 text-slate-700 hover:text-purple-600 transition-all relative"
              >
                <ShoppingBag
                  className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`}
                />
              </Button>

              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg ring-2 ring-white">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {/* Mobile Toggle */}
            <Button
              size="sm"
              variant="ghost"
              className="lg:hidden rounded-full hover:bg-purple-100 text-slate-700 hover:text-purple-600 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[#EADFD8] bg-[#FAF9F6] py-4">

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border border-[#EADFD8] focus:border-[#B76E79] focus:ring-0"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B6F65] h-4 w-4" />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block py-2 text-[#2C2C2C] hover:text-[#B76E79] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                 
                </Link>
              ))}
                
            </nav>

            {/* Mobile Auth */}
            <div className="border-t border-[#EADFD8] pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="block py-2 text-[#2C2C2C] hover:text-[#B76E79]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-[#2C2C2C] hover:text-[#B76E79]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block py-2 text-[#2C2C2C] hover:text-[#B76E79]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;