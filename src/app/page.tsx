import React from 'react';
import Link from 'next/link';
import { ShopifyProduct, ProductsResponse } from '@/types/shopify';
import ProductGrid from '@/components/ProductGrid';
import shopifyClient, { GET_PRODUCTS } from '@/lib/shopify';

// SSG: 在构建时生成静态页面
export const revalidate = 3600; // 1小时重新验证

async function getHomePageData() {
  try {
    // 获取特色产品数据
    const productsResponse = await shopifyClient.request<ProductsResponse>(GET_PRODUCTS, { first: 8 });

    return {
      featuredProducts: productsResponse.products.edges.map((edge: { node: ShopifyProduct }) => edge.node)
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      featuredProducts: []
    };
  }
}

export default async function HomePage() {
  const { featuredProducts } = await getHomePageData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Our Store
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing products at great prices
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Shop Now
        </Link>
      </div>

      {/* Featured Products */}
      <section className="mb-16">
        <ProductGrid products={featuredProducts} title="Featured Products" />
      </section>
    </div>
  );
}
