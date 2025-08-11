import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ShopifyProduct, ProductResponse, ProductsResponse } from '@/types/shopify';
import Card from '@/components/ui/Card';
import shopifyClient, { GET_PRODUCTS, GET_PRODUCT_BY_HANDLE } from '@/lib/shopify';
import AddToCartButton from '@/components/AddToCartButton';

// ISR: 增量静态再生
export const revalidate = 900; // 15分钟重新验证

// 预生成热门产品的静态页面
export async function generateStaticParams() {
  try {
    const response = await shopifyClient.request<ProductsResponse>(GET_PRODUCTS, { first: 20 });
    
    return response.products.edges.map(({ node }: { node: ShopifyProduct }) => ({
      handle: node.handle,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// 生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ handle: string }> 
}) {
  const { handle } = await params;
  try {
    const product = await getProduct(handle);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist.',
      };
    }

    const image = product.images.edges[0]?.node;
    
    return {
      title: `${product.title} - Shopify Store`,
      description: product.description || `Shop ${product.title} at our store`,
      openGraph: {
        title: product.title,
        description: product.description,
        images: image ? [image.url] : [],
      },
    };
  } catch {
    return {
      title: 'Product - Shopify Store',
      description: 'Product details',
    };
  }
}

async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    const response = await shopifyClient.request<ProductResponse>(GET_PRODUCT_BY_HANDLE, { handle });
    return response.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ handle: string }> 
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const images = product.images.edges.map(edge => edge.node);
  const firstVariant = product.variants.edges[0]?.node;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            {images[0] ? (
              <Image
                src={images[0].url}
                alt={images[0].altText || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image) => (
                <div
                  key={image.id}
                  className="aspect-square relative overflow-hidden rounded-md border-2 border-gray-200"
                >
                  <Image
                    src={image.url}
                    alt={image.altText || product.title}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            {firstVariant && (
              <p className="text-2xl font-bold text-blue-600">
                ${parseFloat(firstVariant.price.amount).toFixed(2)} {firstVariant.price.currencyCode}
              </p>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Variant Selection */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-4">
              {product.options.map((option) => (
                <div key={option.id}>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {option.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:border-blue-600 hover:text-blue-600 transition-colors"
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          {firstVariant && (
            <AddToCartButton 
              variantId={firstVariant.id}
              availableForSale={firstVariant.availableForSale}
            />
          )}

          {/* Product Details */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">SKU:</span> {firstVariant?.id}</p>
              <p><span className="font-medium">Availability:</span> {firstVariant?.availableForSale ? 'In Stock' : 'Out of Stock'}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 