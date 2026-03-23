import Link from 'next/link'
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface Product {
  id: number;
  product_id: number;
  name: string;
  price: number;
  featured_image: string;
  category: { name: string };
  quantity: number;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart({
        product_id: product.id,
        name: product.name,
        price: product.price,
        featured_image: product.featured_image,
        category: product.category.name,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  // Helper for image fallback
  const getImageUrl = (featured_image: string | undefined) => featured_image || '/dummy.jpg';

return (
  <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-purple-100/50 hover:border-purple-300 relative transform hover:-translate-y-1">
    <Link href={`/product/${product.id}`}>
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-purple-50/50 to-pink-50/50 relative">
        <img
          src={getImageUrl(product.featured_image)}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/dummy.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </Link>

    <div className="p-6 space-y-3">
      <Link href={`/product/${product.id}`}>
        <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2 leading-tight">
          {product.name}
        </h3>
      </Link>

      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
        {product.category.name}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-purple-100/50">
        <div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ${product.price.toLocaleString()}
          </span>
        </div>

        <Button
          onClick={handleAddToCart}
          size="sm"
          className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2.5 font-semibold"
          disabled={isLoading}
        >
          <ShoppingBag className="h-4 w-4 mr-1.5" />
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </div>
    </div>
  </div>
);

};

export default ProductCard;
