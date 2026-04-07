"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { ApiBlogPost, getBlogsPaginated } from "@/lib/api";

interface BlogCardData {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readTime: string;
}

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const stripHtml = (value: string) =>
  decodeHtmlEntities(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeBlog = (post: ApiBlogPost): BlogCardData => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: stripHtml(post.excerpt || post.content || post.body || ""),
  coverImage: post.featured_image || post.cover_image || post.image|| post.thumbnail_image || "/dummy.jpg",
  category: typeof post.category === "string" ? post.category : post.category?.name || "Blog",
  publishedAt: post.published_at || post.created_at || new Date().toISOString(),
  readTime: post.read_time || "5 min read",
});

export default function BlogListingClient() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<BlogCardData[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await getBlogsPaginated({
          search: query.trim() || undefined,
          page: currentPage,
        });

        const list = Array.isArray(response.data) ? response.data.map(normalizeBlog) : [];
        setPosts(list);
        setTotalPosts(response.total || list.length);
        setLastPage(response.last_page || 1);
      } catch {
        setPosts([]);
        setTotalPosts(0);
        setLastPage(1);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, currentPage]);

  const buildPaginationModel = useMemo(() => {
    const totalPages = Math.max(1, lastPage);
    const pages = new Set<number>();

    [1, 2, 3, totalPages - 1, totalPages, currentPage - 1, currentPage, currentPage + 1].forEach((page) => {
      if (page >= 1 && page <= totalPages) pages.add(page);
    });

    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result: Array<number | "ellipsis"> = [];

    sorted.forEach((page, index) => {
      if (index > 0 && page - sorted[index - 1] > 1) {
        result.push("ellipsis");
      }
      result.push(page);
    });

    return result;
  }, [currentPage, lastPage]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />

      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">BetterZoJewels Blog</h1>
          <p className="mt-3 text-white/90">
            Jewelry guides, styling tips, and buying advice.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="search"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search blog posts..."
              className="pl-12 h-12 rounded-full border-purple-200"
            />
          </div>
          <p className="text-sm text-slate-600 mt-3 text-center">
            Showing {posts.length} of {totalPosts} posts
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-600">Loading blog posts...</div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-xl">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-5">
                      <p className="text-xs font-semibold text-purple-600 mb-2">
                        {post.category}
                      </p>
                      <h2 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="text-xs text-slate-500 flex justify-between">
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {lastPage > 1 && (
              <Pagination className="mt-10">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {buildPaginationModel.map((entry, index) =>
                    entry === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={entry}>
                        <PaginationLink
                          href="#"
                          isActive={entry === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(entry);
                          }}
                        >
                          {entry}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < lastPage) setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-800">No posts found</h2>
            <p className="text-slate-600 mt-2">Try a different keyword.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
