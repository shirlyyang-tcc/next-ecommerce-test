'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { ShopifyCart } from '@/types/shopify';

interface CartContextType {
  cart: ShopifyCart | null;
  loading: boolean;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopify-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem('shopify-cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('shopify-cart');
    }
  }, [cart]);

  const addToCart = async (variantId: string, quantity: number) => {
    setLoading(true);
    try {
      let response;
      
      if (!cart) {
        // Create new cart
        response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'create',
            lines: [
              {
                merchandiseId: variantId,
                quantity,
              },
            ],
          }),
        });
      } else {
        // Add to existing cart
        response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'add',
            cartId: cart.id,
            lines: [
              {
                merchandiseId: variantId,
                quantity,
              },
            ],
          }),
        });
      }

      const data = await response.json();
      
      if (data.cartCreate?.cart) {
        setCart(data.cartCreate.cart);
      } else if (data.cartLinesAdd?.cart) {
        setCart(data.cartLinesAdd.cart);
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (lineId: string) => {
    if (!cart) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'remove',
          cartId: cart.id,
          lineIds: [lineId],
        }),
      });

      const data = await response.json();
      
      if (data.cartLinesRemove?.cart) {
        setCart(data.cartLinesRemove.cart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          cartId: cart.id,
          lines: [
            {
              id: lineId,
              quantity,
            },
          ],
        }),
      });

      const data = await response.json();
      
      if (data.cartLinesUpdate?.cart) {
        setCart(data.cartLinesUpdate.cart);
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  const cartItemCount = cart?.lines.edges.reduce((total, { node }) => total + node.quantity, 0) || 0;

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 