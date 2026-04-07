import { Metadata } from "next";
import BlogListingClient from "./BlogListingClient";

export const metadata: Metadata = {
  title: "BetterZoJewels Blog | Jewelry Guides and Trends",
  description:
    "Read jewelry buying guides, care tips, and trend insights from the BetterZoJewels editorial team.",
};

export default function BlogPage() {
  return <BlogListingClient />;
}
