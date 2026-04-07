import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { getBlogBySlug } from "@/lib/api";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const normalizeRichContent = (value: string) =>
  decodeHtmlEntities(value)
    .replace(/<p>\s*(?=<(h[1-6]|ul|ol|li|p|blockquote|br)\b)/gi, "")
    .replace(/<\/p>\s*(?=<\/?(h[1-6]|ul|ol|li|p|blockquote|br)\b)/gi, "")
    .replace(/<p><br><\/p>/gi, "")
    .trim();

const parseTags = (rawTags: unknown): string[] => {
  if (Array.isArray(rawTags)) {
    return rawTags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof rawTags !== "string") return [];
  const value = rawTags.trim();
  if (!value) return [];

  const quotedMatches = Array.from(value.matchAll(/"([^"]+)"/g)).map((m) => m[1].trim());
  if (quotedMatches.length > 0) return quotedMatches;

  return value
    .replace(/^\#?\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((tag) => tag.replace(/^#+/, "").replace(/^["']|["']$/g, "").trim())
    .filter(Boolean);
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Blog Not Found | BetterZoJewels",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: `${post.title || "Blog"} | BetterZoJewels Blog`,
    description: post.excerpt || "Read this blog post on BetterZoJewels.",
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const coverImage = post.featured_image || post.cover_image || post.image || "/dummy.jpg";
  const category =
    typeof post.category === "string" ? post.category : post.category?.name || "Blog";
  const author = post.author || post.author_name || "BetterZoJewels Editorial";
  const publishedAt = post.published_at || post.created_at || new Date().toISOString();
  const contentText = post.content || post.body || post.excerpt || "";
  const renderedContent = normalizeRichContent(contentText);
  const tagList = parseTags(post.tags);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />

      <article className="container mx-auto px-4 py-10 max-w-4xl">
        <Link href="/blog" className="text-purple-600 font-semibold hover:underline">
          ← Back to Blog
        </Link>

        <div className="mt-5">
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            {category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mt-3 leading-tight">
            {post.title}
          </h1>
          <p className="text-slate-600 mt-3 text-lg">{post.excerpt}</p>

          <div className="text-sm text-slate-500 mt-4 flex flex-wrap gap-4">
            <span>By {author}</span>
            <span>{new Date(publishedAt).toLocaleDateString()}</span>
            <span>{post.read_time || "5 min read"}</span>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden mt-8 shadow-lg border border-purple-100">
          <img
            src={coverImage}
            alt={post.title}
            className="w-full h-[260px] md:h-[420px] object-cover"
          />
        </div>

        <div
          className="mt-8 space-y-5 text-slate-700 text-lg leading-8 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mt-6 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-5 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2"
          dangerouslySetInnerHTML={{
            __html: renderedContent || `<p>${post.excerpt || ""}</p>`,
          }}
        />

        {tagList.length > 0 && (
          <div className="mt-10 pt-6 border-t border-purple-100">
            <p className="text-sm font-semibold text-slate-700 mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}
