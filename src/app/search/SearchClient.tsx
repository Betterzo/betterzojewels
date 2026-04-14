"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProductsPaginated } from "@/lib/api";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchClient({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const nextQuery = (searchParams.get("q") || "").trim();
    setQuery((prev) => (prev === nextQuery ? prev : nextQuery));
    setInputQuery((prev) => (prev === nextQuery ? prev : nextQuery));
  }, [searchParams]);

  useEffect(() => {
    const fetchFirstPage = async () => {
      try {
        setLoading(true);
        const pageData = await getProductsPaginated({
          search: query || undefined,
          page: 1,
        });
        setProducts(Array.isArray(pageData.data) ? pageData.data : []);
        setCurrentPage(pageData.current_page || 1);
        setLastPage(pageData.last_page || 1);
        setTotal(pageData.total || 0);
      } catch {
        setProducts([]);
        setCurrentPage(1);
        setLastPage(1);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstPage();
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextQuery = inputQuery.trim();

    router.push(
      nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search"
    );
    setQuery(nextQuery);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setInputQuery("");
    setQuery("");
    setCurrentPage(1);
    router.push("/search");
  };

  const handleLoadMore = async () => {
    if (loadingMore || currentPage >= lastPage) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const pageData = await getProductsPaginated({
        search: query || undefined,
        page: nextPage,
      });
      const nextProducts = Array.isArray(pageData.data) ? pageData.data : [];

      setProducts((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        const merged = [...prev];
        nextProducts.forEach((item) => {
          if (!seen.has(item.id)) {
            merged.push(item);
          }
        });
        return merged;
      });

      setCurrentPage(pageData.current_page || nextPage);
      setLastPage(pageData.last_page || lastPage);
      setTotal(pageData.total || total);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />

      <section className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            Search Results
          </h1>
          <form onSubmit={handleSearchSubmit} className="mt-4 mb-4">
            <div className="flex gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Search jewelry, gems, rings..."
                  className="pl-10 pr-10 rounded-full border-purple-200"
                />
                {inputQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button type="submit" className="rounded-full px-6">
                Search
              </Button>
            </div>
          </form>
          <p className="text-slate-600">
            {query ? (
              <>
                Showing results for <span className="font-semibold">"{query}"</span>
                {total > 0 && (
                  <span className="ml-2 text-slate-500">
                    ({products.length} / {total})
                  </span>
                )}
              </>
            ) : (
              <>
                Showing all products
                {total > 0 && (
                  <span className="ml-2 text-slate-500">
                    ({products.length} / {total})
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-600">Loading products...</div>
        ) : products.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {currentPage < lastPage && (
              <div className="text-center mt-10">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-6">
              <Search className="h-9 w-9 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No products found</h2>
            <p className="text-slate-600 mb-6">
              Try a different keyword like ring, necklace, or earrings.
            </p>
            <Button
              onClick={() => window.history.back()}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Go Back
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
