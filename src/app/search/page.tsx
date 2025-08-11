import React from 'react';
import { notFound } from 'next/navigation';
import { ShopifyProduct, ProductsResponse } from '@/types/shopify';
import ProductGrid from '@/components/ProductGrid';
import shopifyClient, { GET_PRODUCTS } from '@/lib/shopify';

// SSR: 服务端渲染，处理动态搜索
export const dynamic = 'force-dynamic';

async function searchProducts(query: string) {
  try {
    // 这里使用简单的产品搜索，实际项目中可能需要更复杂的搜索逻辑
    const response = await shopifyClient.request<ProductsResponse>(GET_PRODUCTS, { 
      first: 50 
    });
    
    const products = response.products.edges.map((edge: { node: ShopifyProduct }) => edge.node);
    
    // 简单的客户端过滤（实际项目中应该在 Shopify 端进行搜索）
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredProducts;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;
  
  if (!query || query.trim() === '') {
    notFound();
  }

  const products = await searchProducts(query);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-600">
          Found {products.length} product{products.length !== 1 ? 's' : ''} for &quot;{query}&quot;
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No products found for &quot;{query}&quot;</p>
          <p className="text-gray-400">Try searching with different keywords</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
} 