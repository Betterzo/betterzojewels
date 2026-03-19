import ProductClient from '../ProductClient';
import { getProductById } from '@/lib/api';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }): Promise<Metadata> {
  try {
    const { productId } = await params;
    const product = await getProductById(productId);
    return {
      title: product.meta_title || `${product.name} | JewTone Online`,
      description: product.meta_description || product.description || `Buy ${product.name} at JewTone Online. Premium jewelry with secure payment and free shipping.`,
      keywords: product.meta_keywords || `${product.name}, jewelry, ${product.category?.name || 'jewelry'}, premium jewelry`,
      openGraph: {
        title: product.name || 'Product Details | JewTone Online',
        description: product.description || `Buy ${product.name} at JewTone Online.`,
        type: 'website',
        images: product.featured_image ? [product.featured_image] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name || 'Product Details | JewTone Online',
        description: product.description || `Buy ${product.name} at JewTone Online.`,
        images: product.featured_image ? [product.featured_image] : [],
      },
    };
  } catch {
    return {
      title: 'Product Details | JewTone Online',
      description: 'View details and purchase options for this premium jewelry product.',
    };
  }
}

export default async function Page({ params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    let product = null;
    try {
      product = await getProductById(productId);
    } catch (error) {
      console.error('Error fetching product:', error);
      // Continue with null product, ProductClient will handle it
    }
    return <ProductClient productId={productId} initialProduct={product} />;
  } catch (error) {
    console.error('Error in product page:', error);
    return <ProductClient productId="" initialProduct={null} />;
  }
} 