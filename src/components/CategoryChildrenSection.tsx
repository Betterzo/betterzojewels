import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CategoryChild {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  products?: Array<{ id: number; featured_image?: string | null }>;
}

interface CategoryChildrenSectionProps {
  childrenCategories?: CategoryChild[];
}

export default function CategoryChildrenSection({
  childrenCategories = [],
}: CategoryChildrenSectionProps) {
  if (!childrenCategories.length) return null;

  return (
    <section className="py-8 border-b border-purple-100/60 bg-white/70 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            Explore Subcategories
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Browse all related categories under this section.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {childrenCategories.map((child) => {
            const productCount = child.products?.length || 0;
            const fallbackImage = child.products?.[0]?.featured_image || "/dummy.jpg";
            const imageUrl = child.image || fallbackImage || "/dummy.jpg";

            return (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="group rounded-2xl border border-purple-100 bg-white hover:border-purple-300 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="flex items-center gap-4 p-4">
                  <img
                    src={imageUrl}
                    alt={child.name}
                    className="h-16 w-16 rounded-xl object-cover border border-purple-100"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/dummy.jpg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate group-hover:text-purple-600">
                      {child.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {productCount} {productCount === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-purple-600" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
