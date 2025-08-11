import { NextRequest, NextResponse } from 'next/server';
import shopifyClient, { GET_COLLECTIONS } from '@/lib/shopify';
import { CollectionsResponse } from '@/types/shopify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get('first') || '10');

    const variables = {
      first,
    };

    const data = await shopifyClient.request<CollectionsResponse>(GET_COLLECTIONS, variables);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
} 