# Shopify E-commerce Store

A modern e-commerce website built with Next.js 15, TypeScript, Tailwind CSS, and Shopify Storefront API, featuring advanced performance optimizations with SSG, SSR, and ISR.

## Features

- 🛍️ **Product Catalog**: Browse products with pagination and search
- 🛒 **Shopping Cart**: Add products to cart and checkout via Shopify
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- ⚡ **Fast Performance**: Built with Next.js 15 and optimized for speed
- 🔍 **SEO Optimized**: Server-side rendering and meta tags
- 🎨 **Modern UI**: Clean, professional design with smooth animations
- 🚀 **Performance Optimized**: SSG, SSR, and ISR implementation

## Performance Optimizations

### 🏗️ Static Site Generation (SSG)
- **首页**: 预生成静态页面，1小时重新验证
- **404页面**: 静态生成错误页面

### 🔄 Incremental Static Regeneration (ISR)
- **产品列表页**: 30分钟重新验证，预生成前3页
- **产品详情页**: 15分钟重新验证，预生成热门产品
- **动态内容**: 定期更新价格和库存信息

### ⚡ Server-Side Rendering (SSR)
- **搜索页面**: 动态处理搜索查询
- **产品详情页**: 实时获取最新库存和价格
- **个性化内容**: 用户特定的动态内容

### 📊 Performance Monitoring
- 实时性能指标监控
- Core Web Vitals 跟踪
- 页面加载时间分析

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **E-commerce**: Shopify Storefront API
- **Icons**: Lucide React
- **HTTP Client**: GraphQL Request
- **Performance**: SSG, SSR, ISR

## Prerequisites

Before you begin, ensure you have:

1. A Shopify store with Storefront API access
2. Node.js 18+ installed
3. npm, yarn, or pnpm package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd next-ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Shopify Storefront API Configuration
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token

# Next.js Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SITE_URL=https://your-store.com
```

### 4. Get Shopify Storefront API Access

1. Log in to your Shopify admin panel
2. Go to **Settings** > **Apps and sales channels**
3. Click **Develop apps**
4. Create a new app or select an existing one
5. Go to **API credentials**
6. Under **Storefront API**, click **Configure**
7. Select the required scopes:
   - `read_products`
   - `read_cart`
   - `write_cart`
8. Save and copy the **Storefront access token**

### 5. Update Configuration

Replace the placeholder values in `.env.local` with your actual Shopify store domain and access token.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes for Shopify integration
│   ├── cart/              # Shopping cart page (Client-side)
│   ├── products/          # Product pages (ISR/SSR)
│   ├── search/            # Search page (SSR)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage (SSG)
│   ├── not-found.tsx      # 404 page (SSG)
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Header.tsx        # Navigation header
│   ├── ProductCard.tsx   # Product display card
│   ├── ProductGrid.tsx   # Product grid layout
│   ├── AddToCartButton.tsx # Add to cart button
│   ├── PerformanceMonitor.tsx # Performance monitoring
│   └── Toast.tsx         # Notification component
├── contexts/             # React contexts
│   └── CartContext.tsx   # Shopping cart state management
├── lib/                  # Utility libraries
│   └── shopify.ts        # Shopify API client and queries
└── types/                # TypeScript type definitions
    └── shopify.ts        # Shopify API types
```

## Performance Strategy

### 🎯 Rendering Strategy by Page Type

| Page Type | Rendering Method | Revalidation | Use Case |
|-----------|------------------|--------------|----------|
| Homepage | SSG | 1 hour | Static content, featured products |
| Product List | ISR | 30 minutes | Product catalog with pagination |
| Product Detail | ISR/SSR | 15 minutes | Product info with real-time stock |
| Search | SSR | Dynamic | User-specific search results |
| Cart | Client-side | N/A | Interactive shopping cart |

### 📈 Performance Benefits

1. **Fast Initial Load**: SSG pages load instantly
2. **SEO Optimized**: All pages are server-rendered
3. **Real-time Updates**: ISR keeps content fresh
4. **Scalable**: Efficient caching and revalidation
5. **User Experience**: Smooth navigation and interactions

### 🔧 Performance Monitoring

The app includes built-in performance monitoring:

- **Core Web Vitals**: FCP, LCP, CLS tracking
- **Navigation Timing**: Page load metrics
- **Resource Loading**: Asset optimization
- **Development Insights**: Console logging in dev mode

## Key Components

### Shopify Integration (`src/lib/shopify.ts`)
- GraphQL client configuration
- Product queries with pagination
- Cart mutations
- Performance-optimized queries

### Performance-Optimized Pages
- **SSG Pages**: Homepage, 404
- **ISR Pages**: Product lists, product details
- **SSR Pages**: Search results, dynamic content

### Shopping Cart
- Cart creation and management
- Add to cart functionality
- Checkout integration with Shopify
- Local storage persistence

## API Routes

- `GET /api/products` - Fetch product list with pagination
- `GET /api/products/[handle]` - Fetch single product details
- `POST /api/cart` - Create cart and add items

## SEO Features

- **Dynamic Meta Tags**: Product-specific metadata
- **Open Graph**: Social media optimization
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine directives
- **Structured Data**: Product schema markup

## Customization

### Styling
The project uses Tailwind CSS for styling. You can customize the design by:
- Modifying Tailwind classes in components
- Updating the color scheme in `tailwind.config.js`
- Adding custom CSS in `src/app/globals.css`

### Performance Tuning
- Adjust `revalidate` times based on content update frequency
- Modify `generateStaticParams` for different pre-generation strategies
- Optimize GraphQL queries for better performance

### Shopify Configuration
- Update GraphQL queries in `src/lib/shopify.ts` for different data requirements
- Modify product display logic in components
- Add custom fields and metafields support

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Performance Considerations
- Enable Vercel's Edge Network for global CDN
- Configure ISR revalidation settings
- Monitor Core Web Vitals in Vercel Analytics

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SHOPIFY_STORE_DOMAIN` | Your Shopify store domain | Yes |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token | Yes |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Public store domain for client-side | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your website URL for sitemap | No |

## Performance Monitoring

### Development
- Performance metrics logged to console
- Real-time monitoring of page loads
- Core Web Vitals tracking

### Production
- Integrate with analytics services
- Monitor Core Web Vitals
- Track user experience metrics

## Troubleshooting

### Common Issues

1. **API Errors**: Ensure your Shopify access token has the correct permissions
2. **Image Loading**: Check that product images are properly configured in Shopify
3. **Cart Issues**: Verify cart mutations are working with your store's configuration
4. **Performance**: Monitor revalidation times and adjust as needed

### Development Tips

- Use the browser's developer tools to inspect API responses
- Check the Network tab for failed requests
- Verify environment variables are loaded correctly
- Monitor performance metrics in development console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the [Shopify Storefront API documentation](https://shopify.dev/docs/storefront-api)
- Review [Next.js documentation](https://nextjs.org/docs)
- Open an issue in this repository
