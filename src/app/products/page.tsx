import React from 'react';
import { ShopifyProduct, ProductsResponse } from '@/types/shopify';
import ProductGrid from '@/components/ProductGrid';
import shopifyClient, { GET_PRODUCTS } from '@/lib/shopify';

// ISR: 增量静态再生
export const revalidate = 1800; // 30分钟重新验证

// 预生成前几页的静态页面
export async function generateStaticParams() {
  try {
    const response = await shopifyClient.request<ProductsResponse>(GET_PRODUCTS, { first: 12 });
    const totalProducts = response.products.edges.length;
    const pages = Math.ceil(totalProducts / 12);
    
    // 预生成前3页
    return Array.from({ length: Math.min(pages, 3) }, (_, i) => ({
      page: (i + 1).toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getProducts(page: number = 1) {
  try {
    const first = 12;
    const after = page > 1 ? `cursor-${(page - 1) * first}` : undefined;
    
    const response = await shopifyClient.request<ProductsResponse>(GET_PRODUCTS, { 
      first, 
      after 
    });

    return {
      products: response.products.edges.map((edge: { node: ShopifyProduct }) => edge.node),
      pageInfo: response.products.pageInfo,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        endCursor: ''
      },
      currentPage: page
    };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');
  const { products, pageInfo, currentPage } = await getProducts(page);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-600">Discover our complete collection</p>
      </div>

      <ProductGrid products={products} />

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        {pageInfo.hasPreviousPage && (
          <a
            href={`/products?page=${currentPage - 1}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </a>
        )}
        
        <span className="px-4 py-2 text-sm text-gray-700">
          Page {currentPage}
        </span>
        
        {pageInfo.hasNextPage && (
          <a
            href={`/products?page=${currentPage + 1}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
} 