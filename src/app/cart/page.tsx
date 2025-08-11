'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { cart, loading, removeFromCart, updateQuantity } = useCart();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.lines.edges.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <Link href="/products" className="inline-block">
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleRemoveItem = async (lineId: string) => {
    try {
      await removeFromCart(lineId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      await handleRemoveItem(lineId);
      return;
    }
    
    try {
      await updateQuantity(lineId, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-4">
              {cart.lines.edges.map(({ node: line }) => (
                <div key={line.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex-shrink-0 w-20 h-20 relative">
                    {line.merchandise.product.images.edges[0] ? (
                      <Image
                        src={line.merchandise.product.images.edges[0].node.url}
                        alt={line.merchandise.product.images.edges[0].node.altText || line.merchandise.product.title}
                        fill
                        className="object-cover rounded-md"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {line.merchandise.product.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {line.merchandise.title}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ${parseFloat(line.merchandise.price.amount).toFixed(2)} {line.merchandise.price.currencyCode}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)}
                        className="w-6 h-6 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm text-gray-500 w-8 text-center">{line.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
                        className="w-6 h-6 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(line.id)}
                      className="text-red-600 hover:text-red-800 text-sm ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ${parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)} {cart.cost.subtotalAmount.currencyCode}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>
                    ${parseFloat(cart.cost.totalAmount.amount).toFixed(2)} {cart.cost.totalAmount.currencyCode}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mb-4"
              onClick={() => window.open(cart.checkoutUrl, '_blank')}
            >
              Proceed to Checkout
            </Button>
            
            <Link href="/products" className="block">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
} 