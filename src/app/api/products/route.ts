import { NextRequest, NextResponse } from 'next/server';
import shopifyClient, { GET_PRODUCTS } from '@/lib/shopify';
import { ProductsResponse } from '@/types/shopify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get('first') || '12');
    const after = searchParams.get('after') || undefined;

    const variables = {
      first,
      after,
    };

    const data = await shopifyClient.request<ProductsResponse>(GET_PRODUCTS, variables);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 