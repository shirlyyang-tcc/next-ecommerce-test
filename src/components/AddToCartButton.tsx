'use client';

import React, { useState } from 'react';
import Button from './ui/Button';
import Toast from './ui/Toast';
import { useCart } from '@/contexts/CartContext';

interface AddToCartButtonProps {
  variantId: string;
  availableForSale: boolean;
  quantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  variantId, 
  availableForSale, 
  quantity = 1 
}) => {
  const { addToCart, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleAddToCart = async () => {
    if (!availableForSale) return;
    
    setIsAdding(true);
    try {
      await addToCart(variantId, quantity);
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
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!availableForSale || loading || isAdding}
        onClick={handleAddToCart}
      >
        {loading || isAdding ? 'Adding...' : availableForSale ? 'Add to Cart' : 'Out of Stock'}
      </Button>

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

export default AddToCartButton; 