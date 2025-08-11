'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShopifyProduct } from '@/types/shopify';
import Card from './ui/Card';
import Button from './ui/Button';
import Toast from './ui/Toast';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  const image = product.images.edges[0]?.node;
  const variant = product.variants.edges[0]?.node;
  const price = variant?.price || product.priceRange.minVariantPrice;

  const handleAddToCart = async () => {
    if (!variant?.availableForSale || !variant?.id) return;
    
    setIsAdding(true);
    try {
      await addToCart(variant.id, 1);
      setToastMessage('Added to cart successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setToastMessage('Failed to add to cart. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow duration-300">
        <Link href={`/products/${product.handle}`}>
          <div className="aspect-square relative overflow-hidden">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText || product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
        </Link>
        
        <div className="p-4">
          <Link href={`/products/${product.handle}`}>
            <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-gray-900">
              ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
            </span>
            {!variant?.availableForSale && (
              <span className="text-sm text-red-600">Out of Stock</span>
            )}
          </div>
          
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            disabled={!variant?.availableForSale || loading || isAdding}
            onClick={handleAddToCart}
          >
            {loading || isAdding ? 'Adding...' : variant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </div>
      </Card>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default ProductCard; 