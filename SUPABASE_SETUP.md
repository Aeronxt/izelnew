# Supabase Setup Guide

Izel is now integrated with Supabase for dynamic product management. Follow these steps to set up your Supabase backend:

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project" and fill in the details:
   - Project name: Your choice (e.g., "ecommerce-store")
   - Database Password: Choose a strong password
   - Region: Select the closest to your users

## 2. Set Up the Database

1. Once your project is created, go to the SQL Editor
2. Copy and paste the entire contents of `supabase/schema.sql` into the editor
3. Click "Run" to create the `clothes` table and insert sample data

## 3. Get Your API Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy these values:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - Anon/Public API key

## 4. Configure Your Environment

1. Create a `.env` file in the root of your project
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 5. Database Schema

The `clothes` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| title | VARCHAR(255) | Product name |
| price | DECIMAL(10,2) | Product price |
| image_url | TEXT | URL to product image |
| type | VARCHAR(100) | Product type (e.g., "Electronics", "Clothing") |
| category | VARCHAR(100) | Product category (e.g., "men", "women", "electronics") |
| details | TEXT | Product description |
| discount | INTEGER | Discount percentage (0-100) |
| rating | DECIMAL(2,1) | Average rating (0-5) |
| review_count | INTEGER | Number of reviews |
| state | INTEGER | Product state (0=normal, 1=featured) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## 6. Managing Products

You can manage products through:

1. **Supabase Dashboard**: Go to Table Editor → clothes table
2. **SQL Editor**: Write custom SQL queries
3. **API**: Use the Supabase client in your code

## 7. Image Storage

For product images, you have two options:

1. **Local Images**: Store images in the `public/assets` folder and use paths like `/assets/product.png`
2. **Supabase Storage**: Upload images to Supabase Storage and use the public URLs

To use Supabase Storage:
1. Go to Storage in your Supabase dashboard
2. Create a new bucket called "products"
3. Set it to public
4. Upload images and use their public URLs in the `image_url` field

## 8. Security

The current setup allows public read access to the products. If you need authentication:

1. Enable authentication in Supabase
2. Update Row Level Security policies
3. Implement user authentication in your React app

## Troubleshooting

- **Products not loading**: Check your environment variables and ensure they're correct
- **CORS errors**: Make sure your Supabase project URL is correct
- **Empty product list**: Verify the SQL script ran successfully and data was inserted

## Next Steps

- Add user authentication for admin features
- Implement product search and filtering
- Add shopping cart persistence with Supabase
- Create an admin panel for product management 