"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/api";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/ui/loading";
import { get } from "http";

export default function HomeClient() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  //   Promise.all([getCategories(), getProducts()])
  //     .then(([catData, prodData]) => {
  //       setCategories(catData);
  //       console.log("Fetched Categories:", catData);
  //       setProducts(prodData);
  //     })
  //     .catch(() => setError("Failed to load data."))
  //     .finally(() => setLoading(false));
  // }, []);


  useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try{
          const res= await getCategories();
          setCategories(res);
          // console.log("Fetched Categories:", res);

          const prodRes = await getProducts();
          setProducts(prodRes.slice(0, 4)); // Set only the first 4 products for featured
          // console.log("Fetched Products:", prodRes);
        } catch (err) {
          setError("Failed to load data.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      setMounted(true);
  }, []);
  if (!mounted || loading) return <LoadingPage />;

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
  //       <p className="text-red-600">{error}</p>
  //     </div>
  //   );
  // }

  // const mappedCategories = categories.map((cat: any) => ({
  //   name: cat.name,
  //   image: cat.image,
  //   href: `/category/${cat.slug}`,
  // }));


  // console.log("categories", categories);
  

// const mappedCategories = safeCategories.map((cat: any) => ({
//   name: cat.name,
//   image: cat.image,
//   href: `/category/${cat.slug}`,
// }));


  // console.log("mappedCategories", mappedCategories);
  // console.log("featuredProducts", featuredProducts);

 

  // console.log("safeProducts", safeProducts);

// const featuredProducts = safeProducts.slice(0, 4).map((prod: any) => ({
//   id: prod.id,
//   product_id: prod.product_id || prod.id,
//   name: prod.name,
//   price: Number(prod.price),
//   featured_image:
//     prod.featured_image ||
//     "https://via.placeholder.com/400x400?text=No+Image",
//   category:
//     prod.category ||
//     categories.find((cat: any) => cat.id === prod.category_id)?.name ||
//     "Jewelry",
//   description: prod.description || "",
//   quantity: 1,
// }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 text-slate-900">
      <Header />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-hero text-white">

        {/* Multi Image Background */}
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 opacity-30">

          {[
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900",
            "https://images.unsplash.com/photo-1596944924591-1168bd3dbfc7?w=900",
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900",
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900",
            "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=900",
            "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900",
          ].map((img, i) => (
            <div
              key={i}
              className="bg-cover bg-center animate-[slowZoom_20s_linear_infinite]"
              style={{
                backgroundImage: `url(${img})`,
              }}
            />
          ))}
        </div>

        {/* Premium Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-purple-800/70 to-pink-900/90" /> */}

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl animate-fadeIn">

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-tight text-white drop-shadow-2xl">
            Timeless Luxury
          </h1>

          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mb-8" />

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light">
            Discover handcrafted jewelry designed to celebrate elegance,
            heritage, and eternal beauty.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link href="/category/rings">
              <Button className="bg-white text-purple-600 hover:bg-purple-50 rounded-full px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                Shop Collection
              </Button>
            </Link>

            <Link href="/category/necklaces">
              <Button
                variant="outline"
                className="border-2 border-white text-purple-600 hover:bg-white hover:text-purple-600 rounded-full px-8 py-6 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                Explore Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-lg">
              Curated collections crafted for timeless beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.slug ? `/category/${category.slug}` : "#"}
                className="group shadow-xl hover:shadow-2xl duration-500 overflow-hidden bg-white border border-purple-100/50 rounded-3xl hover:border-purple-300 transition-all hover:scale-[1.02] hover:-translate-y-1"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-72 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Featured Collection
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-lg">
              Signature pieces reflecting craftsmanship and refinement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/category/rings">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-10 py-6 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Crafted for Eternity
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed text-lg">
              For over three decades, we have created jewelry that celebrates
              elegance, heritage, and timeless craftsmanship.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              From rare diamonds to exquisite emeralds, every piece tells
              a story meant to last generations.
            </p>
            <Button
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Our Story
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800"
              alt="Luxury jewelry"
              className="w-full rounded-3xl shadow-2xl relative z-10"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}