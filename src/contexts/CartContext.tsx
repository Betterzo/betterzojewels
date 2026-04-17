"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { getCartItems, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeCartItem as apiRemoveCartItem } from '@/lib/api';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: number; // cart_item_id from server
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  featured_image?: string;
  category?: string;
  in_stock?: boolean;
  stock?: number;
  // ...any other fields you need
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getItemCount: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [wasAuthenticated, setWasAuthenticated] = useState(isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const pendingOperations = useRef<Set<string>>(new Set());

  const parseStock = (value: unknown): number | undefined => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  };

  const isOutOfStock = (item: { in_stock?: boolean; stock?: number }) => {
    if (item.in_stock === false) return true;
    if (typeof item.stock === 'number' && item.stock <= 0) return true;
    return false;
  };

  // Merge guest cart with server cart on login
  useEffect(() => {
    if (!wasAuthenticated && isAuthenticated) {
      // User just logged in
      const guestCart = localStorage.getItem('cart');
      if (guestCart) {
        try {
          const guestItems: CartItem[] = JSON.parse(guestCart);
          Promise.all(
            guestItems.map(item =>
              apiAddToCart(item.product_id, item.quantity)
            )
          ).then(() => {
            fetchServerCart();
            localStorage.removeItem('cart');
          });
        } catch {
          // If error, just fetch server cart
          fetchServerCart();
        }
      } else {
        fetchServerCart();
      }
    }
    setWasAuthenticated(isAuthenticated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Load cart from server or localStorage on mount or login
  useEffect(() => {
    if (isAuthenticated) {
      fetchServerCart();
    } else {
      const stored = localStorage.getItem('cart');
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch {}
      } else {
        setItems([]);
      }
    }
  }, [isAuthenticated]);

  // Save cart to localStorage whenever items change (for guests)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  // Fetch cart from server
  const fetchServerCart = async () => {
    try {
      setIsLoading(true);
      const res = await getCartItems();
      // Map server response to CartItem[]
      const serverItems = (res.items || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.product?.name || '',
        price: Number(item.price),
        quantity: item.quantity,
        featured_image: item.product?.featured_image,
        category: item.product?.category?.name,
        in_stock:
          typeof item.product?.in_stock === 'boolean'
            ? item.product.in_stock
            : undefined,
        stock:
          parseStock(item.product?.stock) ??
          parseStock(item.product?.quantity) ??
          parseStock(item.product?.available_stock),
      }));
      const availableItems = serverItems.filter((item: CartItem) => !isOutOfStock(item));
      const outOfStockItems = serverItems.filter((item: CartItem) => isOutOfStock(item));
      setItems(availableItems);

      if (outOfStockItems.length > 0) {
        await Promise.allSettled(
          outOfStockItems
            .filter((item: CartItem) => item.id > 0)
            .map((item: CartItem) => apiRemoveCartItem(item.id))
        );
      }
    } catch (e) {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if operation is pending
  const isOperationPending = (operationId: string) => {
    return pendingOperations.current.has(operationId);
  };

  // Helper function to mark operation as pending
  const markOperationPending = (operationId: string) => {
    pendingOperations.current.add(operationId);
  };

  // Helper function to mark operation as complete
  const markOperationComplete = (operationId: string) => {
    pendingOperations.current.delete(operationId);
  };

  // Add to cart with optimistic update
  const addToCart = async (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
    const operationId = `add_${item.product_id}`;

    if (isOutOfStock(item)) {
      throw new Error('OUT_OF_STOCK');
    }
    
    // console.log('addToCart called with:', { item, isAuthenticated, operationId });
    
    if (isOperationPending(operationId)) {
      console.log('Operation already pending, skipping');
      return; // Prevent duplicate operations
    }

    if (isAuthenticated) {
      // console.log('User is authenticated, proceeding with server cart update');
      
      // Optimistic update
      setItems(prev => {
        const existing = prev.find(i => i.product_id === item.product_id);
        if (existing) {
          return prev.map(i =>
            i.product_id === item.product_id
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          );
        }
        // Create temporary item with negative ID for optimistic update
        return [...prev, { 
          ...item, 
          id: -Date.now(), // Temporary negative ID
          quantity: item.quantity || 1 
        }];
      });

      try {
        markOperationPending(operationId);
        // console.log('Calling API to add to cart:', { product_id: item.product_id, quantity: item.quantity || 1 });
        const response = await apiAddToCart(item.product_id, item.quantity || 1);
        // console.log('API response:', response);
        
        // Update with real server data if available
        if (response && response.cart_item) {
          console.log('Updating with server cart item data');
          setItems(prev => {
            const existing = prev.find(i => i.product_id === item.product_id);
            if (existing) {
              return prev.map(i =>
                i.product_id === item.product_id
                  ? { ...i, id: response.cart_item.id, quantity: response.cart_item.quantity }
                  : i
              );
            }
            return prev;
          });
        } else {
          // console.log('No cart_item in response, fetching server cart');
          // If no response data, fetch the cart to ensure consistency
          await fetchServerCart();
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        // Revert optimistic update on error
        await fetchServerCart();
        throw error;
      } finally {
        markOperationComplete(operationId);
      }
    } else {
      console.log('User not authenticated, updating local cart');
      setItems(prev => {
        const existing = prev.find(i => i.product_id === item.product_id);
        if (existing) {
          return prev.map(i =>
            i.product_id === item.product_id
              ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) }
              : i
          );
        }
        return [...prev, { ...item, id: Date.now(), quantity: item.quantity || 1 }];
      });
    }
  };

  // Remove from cart with optimistic update
  const removeFromCart = async (id: number) => {
    const operationId = `remove_${id}`;
    
    if (isOperationPending(operationId)) {
      return; // Prevent duplicate operations
    }

    if (isAuthenticated) {
      // Optimistic update
      const itemToRemove = items.find(item => item.id === id);
      setItems(prev => prev.filter(i => i.id !== id));

      try {
        markOperationPending(operationId);
        await apiRemoveCartItem(id);
        // No need to fetch server cart - optimistic update is sufficient
      } catch (error) {
        // Revert optimistic update on error
        if (itemToRemove) {
          setItems(prev => [...prev, itemToRemove]);
        }
        throw error;
      } finally {
        markOperationComplete(operationId);
      }
    } else {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  // Update quantity with optimistic update
  const updateQuantity = async (id: number, quantity: number) => {
    const operationId = `update_${id}`;
    
    if (isOperationPending(operationId)) {
      return; // Prevent duplicate operations
    }

    if (isAuthenticated) {
      const currentItem = items.find((item) => item.id === id);
      if (currentItem && isOutOfStock(currentItem)) {
        await removeFromCart(id);
        return;
      }

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await removeFromCart(id);
        return;
      }

      // Optimistic update
      setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)));

      try {
        markOperationPending(operationId);
        await apiUpdateCartItem(id, quantity);
        // No need to fetch server cart - optimistic update is sufficient
      } catch (error) {
        // Revert optimistic update on error
        await fetchServerCart();
        throw error;
      } finally {
        markOperationComplete(operationId);
      }
    } else {
      if (quantity <= 0) {
        setItems(prev => prev.filter(i => i.id !== id));
        return;
      }
      setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)));
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isAuthenticated) {
      // Optimistic update
      setItems([]);
      
      try {
        // Remove all items one by one (API does not have clear endpoint)
        await Promise.all(items.map(item => apiRemoveCartItem(item.id)));
        // No need to fetch server cart - optimistic update is sufficient
      } catch (error) {
        // Revert optimistic update on error
        await fetchServerCart();
        throw error;
      }
    } else {
      setItems([]);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getItemCount,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};
