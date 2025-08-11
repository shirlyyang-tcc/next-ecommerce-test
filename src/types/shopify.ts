// Shopify API response types
export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyPrice;
  maxVariantPrice: ShopifyPrice;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyPrice;
  availableForSale: boolean;
  selectedOptions?: {
    name: string;
    value: string;
  }[];
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  priceRange: ShopifyPriceRange;
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
  options?: {
    id: string;
    name: string;
    values: string[];
  }[];
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: ShopifyImage;
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: ShopifyPrice;
    product: {
      title: string;
      handle: string;
      images: {
        edges: {
          node: ShopifyImage;
        }[];
      };
    };
  };
}

export interface ShopifyCartCost {
  subtotalAmount: ShopifyPrice;
  totalAmount: ShopifyPrice;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
  cost: ShopifyCartCost;
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

// API response types
export interface ProductsResponse {
  products: {
    pageInfo: ShopifyPageInfo;
    edges: {
      node: ShopifyProduct;
    }[];
  };
}

export interface ProductResponse {
  product: ShopifyProduct;
}

export interface CollectionsResponse {
  collections: {
    edges: {
      node: ShopifyCollection;
    }[];
  };
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart;
    userErrors: {
      field: string;
      message: string;
    }[];
  };
}

export interface CartAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart;
    userErrors: {
      field: string;
      message: string;
    }[];
  };
}

export interface CartRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart;
    userErrors: {
      field: string;
      message: string;
    }[];
  };
}

export interface CartUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart;
    userErrors: {
      field: string;
      message: string;
    }[];
  };
} 