import { NextRequest, NextResponse } from 'next/server';
import shopifyClient, { 
  CREATE_CART, 
  ADD_TO_CART, 
  REMOVE_FROM_CART, 
  UPDATE_CART_QUANTITY 
} from '@/lib/shopify';
import { 
  CartCreateResponse, 
  CartAddResponse, 
  CartRemoveResponse, 
  CartUpdateResponse 
} from '@/types/shopify';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, cartId, lines, lineIds } = body;

    if (action === 'create') {
      const variables = {
        input: {
          lines: lines || [],
        },
      };

      const data = await shopifyClient.request<CartCreateResponse>(CREATE_CART, variables);
      return NextResponse.json(data);
    }

    if (action === 'add' && cartId) {
      const variables = {
        cartId,
        lines,
      };

      const data = await shopifyClient.request<CartAddResponse>(ADD_TO_CART, variables);
      return NextResponse.json(data);
    }

    if (action === 'remove' && cartId && lineIds) {
      const variables = {
        cartId,
        lineIds,
      };

      const data = await shopifyClient.request<CartRemoveResponse>(REMOVE_FROM_CART, variables);
      return NextResponse.json(data);
    }

    if (action === 'update' && cartId && lines) {
      const variables = {
        cartId,
        lines,
      };

      const data = await shopifyClient.request<CartUpdateResponse>(UPDATE_CART_QUANTITY, variables);
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: 'Invalid action or missing required parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error with cart operation:', error);
    return NextResponse.json(
      { error: 'Failed to perform cart operation' },
      { status: 500 }
    );
  }
} 