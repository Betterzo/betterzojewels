import { Metadata } from 'next';
import CategoryClient from '../../category/CategoryClient';
import { getCategoryBySlug, getProductsByCategorySlug } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  try {
    const { category } = await params;
    const categoryData = await getCategoryBySlug(category);
    return {
      title: `${categoryData.name} | BetterZoJewels Online`,
      description: categoryData.description || `Browse premium ${categoryData.name.toLowerCase()} at BetterZoJewels Online. Discover handcrafted jewelry with secure payment options.`,
      keywords: `${categoryData.name}, jewelry, ${categoryData.name.toLowerCase()}, premium jewelry, online jewelry`,
      openGraph: {
        title: `${categoryData.name} | BetterZoJewels Online`,
        description: categoryData.description || `Browse premium ${categoryData.name.toLowerCase()} at BetterZoJewels Online.`,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Shop by Category | BetterZoJewels Online',
      description: 'Browse jewelry by category at BetterZoJewels Online. Discover rings, necklaces, earrings, bracelets, and more.',
      keywords: 'jewelry, rings, necklaces, earrings, bracelets, category, shop jewelry',
    };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  try {
    const { category } = await params;
    const categoryData = await getCategoryBySlug(category);
    const products = await getProductsByCategorySlug(category);
    // console.log("Category Data:", categoryData);
    // console.log("Products:", products);
    return <CategoryClient category={categoryData} products={products || []} />;
  } catch (error: any) {
    console.error('Error loading category page:', error);
    // Return a fallback category page
    const { category } = await params;
    const formattedName = category
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    
    const fallbackCategory = {
      id: 0,
      name: formattedName,
      slug: category,
      description: `Browse ${formattedName} at BetterZoJewels Online`,
      image: null
    };
    return <CategoryClient category={fallbackCategory} products={[]} />;
  }
} 