# Supabase MCP Setup Guide

This guide explains how to set up and use the Supabase MCP (Model Context Protocol) integration for Izel.

## Database Structure

Your Supabase `clothes` table now includes all necessary columns for the e-commerce UI:

### Core Product Information
- `id` (UUID) - Unique product identifier
- `title` - Product name (mapped from `name`)
- `name` - Original product name
- `brand` - Product brand
- `category` - Main category (e.g., "electronics", "men", "women", "beauty")
- `subcategory` - Sub-category for organization
- `type` - Specific product type (e.g., "Headphones", "Jacket", "Shoes")

### Pricing & Discounts
- `price` (DECIMAL) - Current selling price
- `original_price` (DECIMAL) - Original price before discount
- `discount` (INTEGER) - Calculated discount percentage

### Product Details
- `description` - Full product description
- `details` - Mapped from description for UI compatibility
- `image_url` - Main product image URL
- `images` (ARRAY) - Additional product images
- `colors` (JSONB) - Available colors with hex values
- `sizes` (JSONB) - Available sizes with stock status

### Product Attributes
- `materials` (ARRAY) - Product materials
- `features` (ARRAY) - Product features
- `tags` (ARRAY) - Search tags
- `sku` - Stock keeping unit

### Status & Ratings
- `is_new` (BOOLEAN) - New product flag
- `is_bestseller` (BOOLEAN) - Bestseller flag
- `is_on_sale` (BOOLEAN) - Sale status
- `state` (INTEGER) - UI state (0=normal, 1=featured)
- `rating` (DECIMAL) - Average rating (0-5)
- `review_count` (INTEGER) - Number of reviews
- `stock_quantity` (INTEGER) - Available stock

## Environment Setup

Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Current Product Categories

Your database now includes products in these categories:

### Electronics
- Gaming Headphones Pro
- Mechanical Gaming Keyboard  
- 4K Gaming Monitor

### Men's Clothing
- Quilted Jacket Premium

### Women's Clothing
- Winter Coat Elegant

### Footwear
- Running Shoes Pro

### Beauty
- Luxury Perfume Set

### Bags & Accessories
- Classic Leather Tote Bag
- Urban Explorer Backpack
- Silk Evening Clutch
- Canvas Weekend Tote
- Executive Leather Briefcase
- Athletic Gym Duffle Bag
- Leather Travel Wallet

## API Functions Available

### Basic Queries
```javascript
import { getProducts, getProductById, getProductsByCategory } from './lib/supabase';

// Get all products
const products = await getProducts();

// Get product by ID
const product = await getProductById('product-uuid');

// Get products by category
const menProducts = await getProductsByCategory('men');
const electronics = await getProductsByCategory('electronics');
```

### Advanced Filtering
```javascript
import { getProductsWithFilters } from './lib/supabase';

// Get sale products
const saleProducts = await getProductsWithFilters({ is_on_sale: true });

// Get bestsellers
const bestsellers = await getProductsWithFilters({ is_bestseller: true });

// Get products in price range
const affordableProducts = await getProductsWithFilters({ 
  min_price: 50, 
  max_price: 200 
});
```

### React Hooks
```javascript
import { useProducts, useSaleProducts, useBestsellerProducts } from './hooks/useProducts';

// Use in components
const { products, loading, error } = useProducts();
const { products: saleItems } = useSaleProducts();
const { products: bestsellers } = useBestsellerProducts();
```

## Data Transformation

The system automatically transforms Supabase data to match your UI expectations:

```javascript
// Database field → UI field mapping
{
  image_url → imageSrc,
  rating → stars (rounded),
  review_count → rates,
  original_price → originalPrice,
  is_new → isNew,
  is_bestseller → isBestseller,
  is_on_sale → isOnSale
}
```

## Product Colors & Sizes

Colors are stored as JSONB with this structure:
```json
[
  {"name": "Black", "value": "#000000"},
  {"name": "Navy", "value": "#000080"}
]
```

Sizes are stored as JSONB with stock information:
```json
[
  {"name": "Small", "value": "S", "inStock": true},
  {"name": "Medium", "value": "M", "inStock": true},
  {"name": "Large", "value": "L", "inStock": false}
]
```

## Adding New Products

You can add products through:

1. **Supabase Dashboard**: Table Editor → clothes table
2. **SQL Editor**: Direct SQL inserts
3. **API**: Using Supabase client in your app

### Example Product Insert
```sql
INSERT INTO clothes (
  name, title, brand, category, subcategory, type, 
  price, original_price, discount, description, details, 
  image_url, colors, sizes, is_new, is_bestseller, is_on_sale, 
  rating, review_count, stock_quantity, sku
) VALUES (
  'Wireless Earbuds Pro',
  'Wireless Earbuds Pro', 
  'AudioTech',
  'electronics',
  'Audio',
  'Earbuds',
  99.00,
  129.00,
  23,
  'Premium wireless earbuds with active noise cancellation',
  'Premium wireless earbuds with active noise cancellation and 8-hour battery life',
  '/assets/earbuds.png',
  '[{"name": "White", "value": "#FFFFFF"}, {"name": "Black", "value": "#000000"}]',
  '[{"name": "One Size", "value": "OS", "inStock": true}]',
  true,
  false,
  true,
  4.5,
  156,
  45,
  'AT-EB-001'
);
```

## Troubleshooting

### Common Issues

1. **Products not loading**: Check environment variables
2. **Images not showing**: Verify image URLs are accessible
3. **Filters not working**: Check column names in queries
4. **Type errors**: Ensure data transformation in useProducts hook

### Debug Queries

```sql
-- Check product structure
SELECT id, title, category, type, price, discount, image_url 
FROM clothes 
LIMIT 5;

-- Check sale products
SELECT title, price, original_price, discount, is_on_sale 
FROM clothes 
WHERE is_on_sale = true;

-- Check categories
SELECT DISTINCT category, COUNT(*) as product_count 
FROM clothes 
GROUP BY category;
```

## Next Steps

1. **Add Authentication**: Implement user accounts for wishlists/cart persistence
2. **Inventory Management**: Build admin panel for product management  
3. **Advanced Search**: Implement full-text search with filters
4. **Product Reviews**: Add user review system
5. **Order Management**: Build order tracking system

## Security Notes

- Current setup allows public read access to products
- For admin features, implement Row Level Security (RLS)
- Use proper authentication for write operations
- Consider rate limiting for API calls 