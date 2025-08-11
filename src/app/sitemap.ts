import { MetadataRoute } from 'next';
import shopifyClient, { GET_PRODUCTS } from '@/lib/shopify';
import { ProductsResponse, ShopifyProduct } from '@/types/shopify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-store.com';
  
  // 静态页面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  try {
    // 获取产品页面
    const productsResponse = await shopifyClient.request<ProductsResponse>(GET_PRODUCTS, { first: 100 });
    const productPages = productsResponse.products.edges.map(({ node }: { node: ShopifyProduct }) => ({
      url: `${baseUrl}/products/${node.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
} 