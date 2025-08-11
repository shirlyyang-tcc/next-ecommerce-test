import { NextRequest, NextResponse } from 'next/server';
import shopifyClient, { GET_PRODUCT_BY_HANDLE } from '@/lib/shopify';
import { ProductResponse } from '@/types/shopify';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  try {

    const variables = {
      handle,
    };

    const data = await shopifyClient.request<ProductResponse>(GET_PRODUCT_BY_HANDLE, variables);

    if (!data.product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
} 