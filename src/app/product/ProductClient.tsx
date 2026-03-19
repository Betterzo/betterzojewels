"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { getProductById, getRelatedProducts } from '@/lib/api';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { ProductDetailSkeleton } from '@/components/ui/skeletons';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  featured_image: string;
  images?: string[];
  category?: {
    name: string;
    slug: string;
  };
  in_stock?: boolean;
  rating?: number;
  review_count?: number;
  weight?: number;
  dimensions?: string;
  material?: string;
  [key: string]: any;
}

interface ProductClientProps {
  productId: string;
  initialProduct?: Product | null;
}

export default function ProductClient({ productId, initialProduct }: ProductClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(!initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!initialProduct && productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const productData = await getProductById(productId);
      setProduct(productData);
      
      // Fetch related products
      if (productData?.category?.id) {
        try {
          const related = await getRelatedProducts(productData.category.id, productData.id);
          setRelatedProducts(related || []);
        } catch (error) {
          console.error('Error fetching related products:', error);
          setRelatedProducts([]);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user?.user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    try {
      await addToCart({
        product_id: product!.id,
        name: product!.name,
        price: product!.price,
        featured_image: product!.featured_image,
        quantity: quantity
      });
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user?.user) {
      toast.error('Please login to purchase');
      router.push('/login');
      return;
    }

    try {
      await addToCart({
        product_id: product!.id,
        name: product!.name,
        price: product!.price,
        featured_image: product!.featured_image,
        quantity: quantity
      });
      router.push('/checkout');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <ProductDetailSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-6">
              <ShoppingCart className="h-10 w-10 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Product Not Found</h1>
            <p className="text-slate-600 mb-6 text-lg">The product you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => router.push('/')}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6"
            >
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images ? [product.featured_image, ...product.images] : [product.featured_image || '/dummy.jpg'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-purple-100">
              <img
                src={images[selectedImage] || '/dummy.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/dummy.jpg";
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-purple-500 ring-2 ring-purple-200' : 'border-purple-100 hover:border-purple-300'
                    }`}
                  >
                    <img
                      src={image || '/dummy.jpg'}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/dummy.jpg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-3">{product.name}</h1>
              {product.category && (
                <Badge variant="secondary" className="mb-3 bg-purple-100 text-purple-700 hover:bg-purple-200">
                  {product.category.name}
                </Badge>
              )}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating!) ? 'text-yellow-400 fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">
                    {product.rating} ({product.review_count || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${Number(product.price).toLocaleString()}
            </div>

            <div className="prose prose-sm text-slate-600 leading-relaxed">
              <p>{product.description || 'No description available.'}</p>
            </div>

            {/* Product Specifications */}
            {(product.weight || product.dimensions || product.material) && (
              <Card className="border-2 border-purple-100 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800 font-bold">Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.weight && (
                    <div className="flex justify-between py-2 border-b border-purple-50">
                      <span className="text-slate-600 font-medium">Weight:</span>
                      <span className="text-slate-800 font-semibold">{product.weight}g</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between py-2 border-b border-purple-50">
                      <span className="text-slate-600 font-medium">Dimensions:</span>
                      <span className="text-slate-800 font-semibold">{product.dimensions}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600 font-medium">Material:</span>
                      <span className="text-slate-800 font-semibold">{product.material}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-slate-700">Quantity:</label>
                <div className="flex items-center border-2 border-purple-200 rounded-full overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-purple-50 text-purple-600 font-semibold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x-2 border-purple-200 text-slate-800 font-semibold min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-purple-50 text-purple-600 font-semibold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl font-semibold py-6"
                  disabled={product.in_stock === false}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="flex-1 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-full transition-all duration-300 font-semibold py-6"
                  disabled={product.in_stock === false}
                >
                  Buy Now
                </Button>
                <Button 
                  size="icon" 
                  variant="outline"
                  className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full hover:border-purple-400 transition-all"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {product.in_stock === false && (
                <p className="text-red-600 text-sm font-medium">This item is currently out of stock</p>
              )}
            </div>

            {/* Shipping and Returns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t-2 border-purple-100">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Free Shipping</p>
                  <p className="text-xs text-slate-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors">
                <div className="p-2 bg-pink-200 rounded-lg">
                  <Shield className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Secure Payment</p>
                  <p className="text-xs text-slate-600">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Easy Returns</p>
                  <p className="text-xs text-slate-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <Separator className="mb-8 border-purple-200" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card 
                  key={relatedProduct.id} 
                  className="cursor-pointer hover:shadow-xl transition-all border-2 border-purple-100 hover:border-purple-300 bg-white rounded-2xl overflow-hidden group"
                  onClick={() => router.push(`/product/${relatedProduct.id}`)}
                >
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                    <img
                      src={relatedProduct.featured_image || '/dummy.jpg'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/dummy.jpg";
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">{relatedProduct.name}</h3>
                    <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${Number(relatedProduct.price).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 